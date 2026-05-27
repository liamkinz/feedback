// src/auth/register/composables/useRegisterForm.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import type { RegisterForm } from '../types/register.types'

export function useRegisterForm() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { toast, success, error, info } = useToast()

  const form = ref<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const showPassword = ref(false)

  const passwordMismatch = computed(
    () => form.value.password !== form.value.confirmPassword && form.value.confirmPassword !== '',
  )

  const isValid = computed(
    () =>
      form.value.name.trim() !== '' &&
      form.value.email.trim() !== '' &&
      form.value.password.length >= 6 &&
      !passwordMismatch.value,
  )

  const handleRegister = async () => {
    if (!isValid.value) return

    const result = await authStore.signUp(form.value.email, form.value.password, form.value.name)

    if (result.ok) {
      // Show confirmation notice then redirect
      info('Account created! Please check your email to confirm before logging in.')
      setTimeout(() => router.push('/auth/login'), 3000)
    } else {
      error(result.error ?? 'Registration failed. Please try again.')
    }
  }

  return {
    form,
    showPassword,
    isValid,
    passwordMismatch,
    isLoading: authStore.isLoading,
    toast,
    handleRegister,
  }
}
