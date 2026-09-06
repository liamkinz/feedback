import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, register, getCurrentSession, type AuthResult } from '@/services/authService'
import { useToast } from 'vue-toastification'
import type { LocalUser } from '@/db/database'
import { defaultRoleId } from '@/utils/roles'
import { supabaseAdmin } from '@/lib/supabase'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

// Shape of a row from Supabase's admin user list — separate from LocalUser
// (the offline-cache shape used for the signed-in user's own session).
export interface AdminUserData {
  id: string
  email?: string
  created_at?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
  full_name?: string
  role_id?: number
}

function toAdminUserData(user: {
  id: string
  email?: string
  created_at?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}): AdminUserData {
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    user_metadata: user.user_metadata,
    app_metadata: user.app_metadata,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name,
    role_id: Number(user.user_metadata?.role) || undefined,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<LocalUser | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const isOffline = ref(false)
  const error = ref<string | null>(null)
  const users = ref<AdminUserData[]>([])
  const toast = useToast()

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name ?? '')
  const userRole = computed(() => user.value?.role ?? defaultRoleId)

  // ── Login ────────────────────────────────────────────────────
  async function signIn(email: string, password: string): Promise<AuthResult<null>> {
    isLoading.value = true
    error.value = null

    const result = await login(email, password)

    if (result.ok) {
      user.value = result.data.user
      token.value = result.data.token
      isOffline.value = result.data.isOffline
      isLoading.value = false

      if (result.data.isOffline) {
        toast.warning('Logged in offline. Data will sync when connected.')
      } else {
        toast.success(`Welcome back, ${user.value.name}!`)
      }

      return { ok: true, data: null }
    }

    error.value = result.error
    isLoading.value = false
    return { ok: false, error: result.error, code: result.code }
  }

  // ── Register ─────────────────────────────────────────────────
  async function signUp(email: string, password: string, name: string): Promise<AuthResult<null>> {
    isLoading.value = true
    error.value = null

    const result = await register(email, password, name)

    if (result.ok) {
      isLoading.value = false
      toast.info('Account created! Please check your email to confirm before logging in.')
      return { ok: true, data: null }
    }

    toast.error(result.error ?? 'Registration failed. Please try again.')
    error.value = result.error
    isLoading.value = false
    return { ok: false, error: result.error, code: result.code }
  }

  // ── Logout ───────────────────────────────────────────────────
  async function signOut(): Promise<void> {
    await logout()
    user.value = null
    token.value = null
    isOffline.value = false
    toast.success('Logged out successfully')
  }

  // ── Restore session on page reload ───────────────────────────
  async function restoreSession(): Promise<void> {
    const session = await getCurrentSession()
    if (session?.user) {
      const roleId = Number(session.user.user_metadata?.role)

      user.value = {
        supabaseId: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name ?? '',
        role: Number.isFinite(roleId) ? roleId : defaultRoleId,
        passwordHash: '',
        lastLogin: new Date().toISOString(),
      }
      token.value = session.access_token
    }
  }

  // ── Admin: user management ─────────────────────────────────────
  // These need the service-role client (supabaseAdmin) — see the warning in
  // src/lib/supabase.ts. Every RLS check on who may call this happens on the
  // page/route level (role_pages), not here.

  async function getAllUsers(): Promise<{ users?: AdminUserData[]; error?: unknown }> {
    isLoading.value = true
    try {
      const { data, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()

      if (fetchError) return { error: fetchError }
      if (!data?.users) return { error: new Error('No users data returned') }

      const mapped = data.users.map(toAdminUserData)
      users.value = mapped
      return { users: mapped }
    } catch (err) {
      return { error: err }
    } finally {
      isLoading.value = false
    }
  }

  async function getUser(userId: string): Promise<{ user?: AdminUserData; error?: unknown }> {
    isLoading.value = true
    try {
      const {
        data: { user: fetchedUser },
        error: fetchError,
      } = await supabaseAdmin.auth.admin.getUserById(userId)

      if (fetchError) return { error: fetchError }
      if (!fetchedUser) return { error: new Error('User not found') }

      return { user: toAdminUserData(fetchedUser) }
    } catch (err) {
      return { error: err }
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(userId: string): Promise<{ success?: true; error?: unknown }> {
    isLoading.value = true
    try {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

      if (deleteError) return { error: deleteError }

      users.value = users.value.filter((u) => u.id !== userId)
      return { success: true }
    } catch (err) {
      return { error: err }
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(
    userId: string,
    updateData: { email?: string; password?: string; user_metadata?: Record<string, any> },
  ): Promise<{ user?: AdminUserData; error?: unknown }> {
    isLoading.value = true
    try {
      const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        updateData,
      )

      if (updateError) return { error: updateError }
      if (!data.user) return { error: new Error('No user data returned') }

      const updated = toAdminUserData(data.user)
      const index = users.value.findIndex((u) => u.id === userId)
      if (index !== -1) users.value[index] = updated

      return { user: updated }
    } catch (err) {
      return { error: err }
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    isOffline,
    error,
    users,
    isAuthenticated,
    userName,
    userRole,
    signIn,
    signUp,
    signOut,
    restoreSession,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
  }
})

// Shared logout for the sidebar and every navbar variant, so each one
// doesn't need its own router-context plumbing to sign out and land safely
// on the public site. A full navigation (rather than router.push) so no
// stale authenticated state lingers in memory after logout.
export async function doLogout() {
  const confirmed = await useConfirmDialog().confirmDialog('Are you sure you want to logout?', {
    title: 'Confirm Logout',
    confirmText: 'Logout',
  })

  if (!confirmed) return { cancelled: true }

  const authStore = useAuthStore()
  await authStore.signOut()
  window.location.assign('/')
  return { cancelled: false }
}
