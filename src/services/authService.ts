import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { db } from '@/db/database'
import type { LocalUser } from '@/db/database'
import { defaultRoleId } from '@/utils/roles'

const SALT_ROUNDS = 10

export type AuthErrorCode = 'EMAIL_NOT_CONFIRMED' | 'INVALID_CREDENTIALS' | 'UNKNOWN'
export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: AuthErrorCode }
export type LoginResult = { user: LocalUser; token: string | null; isOffline: boolean }

// ── Helpers ────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

async function cacheUserLocally(user: {
  supabaseId: string
  email: string
  name: string
  role: number
  password: string
}): Promise<void> {
  const existing = await db.users.where('email').equals(user.email).first()
  const passwordHash = await hashPassword(user.password)

  if (existing) {
    await db.users.update(existing.id!, {
      passwordHash,
      name: user.name,
      role: user.role,
      lastLogin: new Date().toISOString(),
    })
  } else {
    await db.users.add({
      supabaseId: user.supabaseId,
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash,
      lastLogin: new Date().toISOString(),
    })
  }
}

function normalizeAuthError(message: string): { error: string; code: AuthErrorCode } {
  const lower = message.toLowerCase()

  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return { error: 'Please confirm your email before logging in.', code: 'EMAIL_NOT_CONFIRMED' }
  }

  if (lower.includes('invalid login credentials')) {
    return { error: 'Incorrect email or password.', code: 'INVALID_CREDENTIALS' }
  }

  return { error: message || 'Authentication failed. Please try again.', code: 'UNKNOWN' }
}

async function toAuthResult<T>(
  promise: Promise<T>,
  fallbackMessage: string,
): Promise<AuthResult<T>> {
  return promise
    .then((data) => ({ ok: true as const, data }))
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : fallbackMessage
      return {
        ok: false as const,
        error: message || fallbackMessage,
        code: 'UNKNOWN' as const,
      }
    })
}

// ── Register ───────────────────────────────────────────────────
// Stores name in auth.users.raw_user_meta_data. Role is NOT sent here — a
// database trigger (see supabase/migrations/0001_roles_and_role_pages.sql)
// backfills every new signup to the Viewer role.

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult<null>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // → stored in auth.users.raw_user_meta_data
    },
  })

  if (error) return { ok: false, error: error.message, code: 'UNKNOWN' }
  if (!data.user) {
    return { ok: false, error: 'Registration failed. Please try again.', code: 'UNKNOWN' }
  }

  const cacheResult = await toAuthResult(
    cacheUserLocally({
      supabaseId: data.user.id,
      email,
      name,
      role: defaultRoleId,
      password,
    }),
    'Failed to cache user locally.',
  )

  if (!cacheResult.ok) {
    return { ok: false, error: cacheResult.error, code: cacheResult.code }
  }

  return { ok: true, data: null }
}

// ── Online Login ───────────────────────────────────────────────
// ── Updated loginOnline ────────────────────────────────────────
async function loginOnline(
  email: string,
  password: string,
): Promise<AuthResult<{ user: LocalUser; token: string }>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const failure = normalizeAuthError(error.message || '')
    return { ok: false, error: failure.error, code: failure.code }
  }

  if (!data.user || !data.session) {
    return { ok: false, error: 'Login failed. Please try again.', code: 'UNKNOWN' }
  }

  const meta = data.user.user_metadata
  const roleId = Number(meta?.role)

  const user: LocalUser = {
    supabaseId: data.user.id,
    email: data.user.email!,
    name: meta?.name ?? '',
    role: Number.isFinite(roleId) ? roleId : defaultRoleId,
    passwordHash: '',
    lastLogin: new Date().toISOString(),
  }

  const cacheResult = await toAuthResult(
    cacheUserLocally({ ...user, password }),
    'Failed to cache user locally.',
  )
  if (!cacheResult.ok) {
    return { ok: false, error: cacheResult.error, code: cacheResult.code }
  }

  return { ok: true, data: { user, token: data.session.access_token } }
}

// ── Offline Auth (Dexie) ───────────────────────────────────────

export async function loginOffline(
  email: string,
  password: string,
): Promise<AuthResult<LocalUser>> {
  const localResult = await toAuthResult(
    db.users.where('email').equals(email).first(),
    'Failed to read local credentials.',
  )

  if (!localResult.ok) return localResult
  if (!localResult.data) {
    return {
      ok: false,
      error: 'No offline credentials found. Please log in online first.',
      code: 'UNKNOWN',
    }
  }

  const isValid = await verifyPassword(password, localResult.data.passwordHash)
  if (!isValid) {
    return { ok: false, error: 'Incorrect password.', code: 'INVALID_CREDENTIALS' }
  }

  await db.users
    .update(localResult.data.id!, {
      lastLogin: new Date().toISOString(),
    })
    .catch(() => 0)

  return { ok: true, data: localResult.data }
}

// ── Smart Login (online first, fallback to offline) ────────────
export async function login(email: string, password: string): Promise<AuthResult<LoginResult>> {
  if (navigator.onLine) {
    const result = await loginOnline(email, password)
    if (result.ok) {
      return {
        ok: true,
        data: { user: result.data.user, token: result.data.token, isOffline: false },
      }
    }

    return { ok: false, error: result.error, code: result.code }
  }

  const offlineResult = await loginOffline(email, password)
  if (!offlineResult.ok) {
    return { ok: false, error: offlineResult.error, code: offlineResult.code }
  }

  return {
    ok: true,
    data: { user: offlineResult.data, token: null, isOffline: true },
  }
}

// ── Logout ─────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (navigator.onLine) {
    await supabase.auth.signOut()
  }
}

// ── Restore Session ────────────────────────────────────────────

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ── Current User (fresh from Supabase, not the local cache) ─────
// Used by the account settings page so "loading" reflects a real request,
// the same way the rest of the app does.

export async function getCurrentUser(): Promise<
  AuthResult<{ email: string; name: string; phone: string }>
> {
  const { data, error } = await supabase.auth.getUser()

  if (error) return { ok: false, error: error.message, code: 'UNKNOWN' }
  if (!data.user) return { ok: false, error: 'No authenticated user', code: 'UNKNOWN' }

  return {
    ok: true,
    data: {
      email: data.user.email ?? '',
      name: data.user.user_metadata?.name ?? '',
      phone: data.user.user_metadata?.phone ?? '',
    },
  }
}

// ── Update Profile ─────────────────────────────────────────────
// Update name in auth.users metadata. Role is deliberately NOT updatable
// here — supabase.auth.updateUser() lets a signed-in user rewrite their own
// user_metadata, so if `role` were accepted above, anyone could grant
// themselves Super Admin from the browser console. Changing a role has to
// happen from the SQL editor (see the migration) until there's a trusted
// server-side path for it.

export async function updateProfile(updates: {
  name?: string
  phone?: string
}): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.updateUser({
    data: updates, // → updates raw_user_meta_data
  })

  if (error) return { ok: false, error: error.message, code: 'UNKNOWN' }

  // Sync to local Dexie too
  const { data } = await supabase.auth.getUser()
  if (data.user) {
    const local = await db.users.where('supabaseId').equals(data.user.id).first()

    if (local) {
      await db.users.update(local.id!, updates).catch(() => 0)
    }
  }

  return { ok: true, data: null }
}

// ── Change Password ────────────────────────────────────────────
// A signed-in user changing their own password — no admin API needed.

export async function changePassword(password: string): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { ok: false, error: error.message, code: 'UNKNOWN' }
  return { ok: true, data: null }
}

// ── Resend Confirmation Email ──────────────────────────────────
export async function resendConfirmationEmail(email: string): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  })
  if (error) return { ok: false, error: error.message, code: 'UNKNOWN' }
  return { ok: true, data: null }
}
