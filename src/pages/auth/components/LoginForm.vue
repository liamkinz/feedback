<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requiredRule, emailRule } from '@/utils/formRules'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const formRef = ref()
const formValid = ref(false)
const showPassword = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const isLoading = computed(() => authStore.isLoading)

function clearErrors() {
  errors.email = ''
  errors.password = ''
}

async function handleLogin() {
  if (!formValid.value) return

  clearErrors()

  const result = await authStore.signIn(loginForm.email.trim().toLowerCase(), loginForm.password)

  if (!result.ok) {
    const message = result.error.toLowerCase()
    if (message.includes('email')) errors.email = result.error
    else if (message.includes('password') || message.includes('credentials')) {
      errors.password = result.error
    }
    return
  }

  router.push('/account/home')
}
</script>

<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="handleLogin">
    <label class="auth-field-label" for="login-email">Email</label>
    <v-text-field
      id="login-email"
      v-model="loginForm.email"
      type="email"
      placeholder="you@company.com"
      variant="outlined"
      density="comfortable"
      autocomplete="email"
      :rules="[requiredRule, emailRule]"
      :error-messages="errors.email"
      class="mb-3"
    />

    <label class="auth-field-label" for="login-password">Password</label>
    <v-text-field
      id="login-password"
      v-model="loginForm.password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="Enter your password"
      variant="outlined"
      density="comfortable"
      autocomplete="current-password"
      :rules="[requiredRule]"
      :error-messages="errors.password"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      class="mb-5"
      @click:append-inner="showPassword = !showPassword"
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
      Sign in
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
