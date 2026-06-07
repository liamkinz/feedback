// src/auth/register/composables/useRegisterForm.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import type { RegisterForm } from '../types/register.types'

export function useRegisterForm() {
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()

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
      setTimeout(() => router.push('/auth/login'), 3000)
    }
  }

  return {
    form,
    showPassword,
    isValid,
    passwordMismatch,
    isLoading: authStore.isLoading,
    handleRegister,
  }
}
