<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  requiredRule,
  emailRule,
  passwordRule,
  matchesRule,
  passwordChecks,
  passwordMinLength,
} from '@/utils/formRules'
import { useAuthStore } from '@/stores/authStore'

const emit = defineEmits<{
  'switch-to-login': []
}>()

const authStore = useAuthStore()

const formRef = ref()
const formValid = ref(false)
const showPassword = ref(false)

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isLoading = computed(() => authStore.isLoading)

const requirements = computed(() => passwordChecks(registerForm.password))
const metCount = computed(() => Object.values(requirements.value).filter(Boolean).length)

const strengthColor = computed(() => {
  if (metCount.value <= 2) return 'error'
  if (metCount.value < 5) return 'warning'
  return 'success'
})

const strengthLabel = computed(() => {
  if (!registerForm.password) return ''
  if (metCount.value <= 2) return 'Weak'
  if (metCount.value < 5) return 'Getting there'
  return 'Strong'
})

function clearErrors() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
}

async function handleRegister() {
  if (!formValid.value) return
  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return
  }

  clearErrors()

  const result = await authStore.signUp(
    registerForm.email.trim().toLowerCase(),
    registerForm.password,
    registerForm.name.trim(),
  )

  if (!result.ok) {
    const message = result.error.toLowerCase()
    if (message.includes('email')) errors.email = result.error
    else if (message.includes('password')) errors.password = result.error
    return
  }

  emit('switch-to-login')
}
</script>

<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="handleRegister">
    <label class="auth-field-label" for="register-name">Name</label>
    <v-text-field
      id="register-name"
      v-model="registerForm.name"
      placeholder="Your name"
      variant="outlined"
      density="comfortable"
      autocomplete="name"
      :rules="[requiredRule]"
      :error-messages="errors.name"
      class="mb-3"
    />

    <label class="auth-field-label" for="register-email">Email</label>
    <v-text-field
      id="register-email"
      v-model="registerForm.email"
      type="email"
      placeholder="you@company.com"
      variant="outlined"
      density="comfortable"
      autocomplete="email"
      :rules="[requiredRule, emailRule]"
      :error-messages="errors.email"
      class="mb-3"
    />

    <label class="auth-field-label" for="register-password">Password</label>
    <v-text-field
      id="register-password"
      v-model="registerForm.password"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="`At least ${passwordMinLength} characters`"
      variant="outlined"
      density="comfortable"
      autocomplete="new-password"
      :rules="[requiredRule, passwordRule]"
      :error-messages="errors.password"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      @click:append-inner="showPassword = !showPassword"
    />

    <div v-if="registerForm.password" class="d-flex align-center ga-3 mb-3 mt-2">
      <v-progress-linear
        :model-value="(metCount / 5) * 100"
        :color="strengthColor"
        height="4"
        rounded
        class="flex-grow-1"
      />
      <span class="text-caption" :class="`text-${strengthColor}`">{{ strengthLabel }}</span>
    </div>

    <label class="auth-field-label" for="register-confirm">Confirm password</label>
    <v-text-field
      id="register-confirm"
      v-model="registerForm.confirmPassword"
      :type="showPassword ? 'text' : 'password'"
      placeholder="Repeat your password"
      variant="outlined"
      density="comfortable"
      autocomplete="new-password"
      :rules="[
        requiredRule,
        (v) => matchesRule(v, registerForm.password, 'Passwords do not match'),
      ]"
      :error-messages="errors.confirmPassword"
      class="mb-5"
    />

    <v-btn
      type="submit"
      color="primary"
      variant="flat"
      size="large"
      rounded="lg"
      block
      :loading="isLoading"
      :disabled="!formValid || isLoading"
    >
      Create account
      <v-icon icon="mdi-arrow-right" size="18" end />
    </v-btn>
  </v-form>
</template>

<style scoped>
/* Named `auth-field-label` rather than `field-label`: the legacy inspection-form
   stylesheet (src/assets/styles/forms.css) owns that name globally and forces
   Poppins/uppercase onto anything wearing it. */
.auth-field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
  color: rgba(var(--v-theme-on-surface), 0.92);
}
</style>
