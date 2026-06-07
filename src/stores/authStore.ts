import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, register, getCurrentSession, type AuthResult } from '@/services/authService'
import { useToast } from 'vue-toastification'
import type { LocalUser } from '@/db/database'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<LocalUser | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const isOffline = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name ?? '')
  const userRole = computed(() => user.value?.role ?? 'user')

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
      user.value = {
        supabaseId: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name ?? '',
        role: 'user',
        passwordHash: '',
        lastLogin: new Date().toISOString(),
      }
      token.value = session.access_token
    }
  }

  return {
    user,
    token,
    isLoading,
    isOffline,
    error,
    isAuthenticated,
    userName,
    userRole,
    signIn,
    signUp,
    signOut,
    restoreSession,
  }
})
