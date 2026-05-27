import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { resendConfirmationEmail } from '@/services/authService'
import { useToast } from '@/composables/useToast'
import type { LoginForm } from '../types/login.types'

export function useLoginForm() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { toast, success, error, warning, info } = useToast()

  const form = ref<LoginForm>({ email: '', password: '' })
  const showPassword = ref(false)
  const isResending = ref(false)
  const emailNotConfirmed = ref(false) // ← barrier state

  const isValid = computed(
    () => form.value.email.trim() !== '' && form.value.password.trim() !== '',
  )

  // ── Login ────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!isValid.value) return

    emailNotConfirmed.value = false

    const result = await authStore.signIn(form.value.email, form.value.password)

    if (!result.ok) {
      if (
        result.code === 'EMAIL_NOT_CONFIRMED' ||
        result.error.toLowerCase().includes('email not confirmed')
      ) {
        emailNotConfirmed.value = true // ← trigger barrier UI
        warning('Please confirm your email before logging in.')
      } else {
        error(result.error ?? 'Login failed. Please try again.')
      }
      return
    }

    if (authStore.isOffline) {
      warning('Logged in offline. Data will sync when connected.')
    } else {
      success('Welcome back!')
    }

    setTimeout(() => router.push('/dashboard'), 1000)
  }

  // ── Resend Confirmation Email ─────────────────────────────────
  const handleResend = async () => {
    if (!form.value.email) {
      error('Please enter your email address first.')
      return
    }

    isResending.value = true
    const resendResult = await resendConfirmationEmail(form.value.email)
    if (resendResult.ok) {
      success('Confirmation email sent! Check your inbox.')
      emailNotConfirmed.value = false
    } else {
      error(resendResult.error ?? 'Failed to resend. Please try again.')
    }
    isResending.value = false
  }

  return {
    form,
    showPassword,
    isValid,
    isLoading: authStore.isLoading,
    isOffline: authStore.isOffline,
    emailNotConfirmed,
    isResending,
    toast,
    handleLogin,
    handleResend,
  }
}
