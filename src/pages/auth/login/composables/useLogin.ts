import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { resendConfirmationEmail } from '@/services/authService'
// import { useToast } from '@/composables/useToast'
import { useToast } from 'vue-toastification'
import type { LoginForm } from '../types/login.types'

const toast = useToast()

export function useLoginForm() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { success, error, warning, info } = useToast()

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
        toast.info('Please confirm your email before logging in.')
      } else {
        toast.error(result.error ?? 'Login failed. Please try again.')
      }
      return
    }

    setTimeout(() => router.push('/dashboard'), 1000)
  }

  // ── Resend Confirmation Email ─────────────────────────────────
  const handleResend = async () => {
    if (!form.value.email) {
      toast.error('Please enter your email address first.')
      return
    }

    isResending.value = true
    const resendResult = await resendConfirmationEmail(form.value.email)
    if (resendResult.ok) {
      toast.success('Confirmation email sent! Check your inbox.')
      emailNotConfirmed.value = false
    } else {
      toast.error(resendResult.error ?? 'Failed to resend. Please try again.')
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
