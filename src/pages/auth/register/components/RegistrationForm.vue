<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRegisterForm } from '../composables/useRegister'
import { useToast } from 'vue-toastification'

const toast = useToast()
const erroMessage = ref('')

const onRegister = async () => {
  try {
    await handleRegister()
  } catch (error: any) {
    erroMessage.value = error.message || 'Registration failed. Please try again.'
    toast.error(erroMessage.value)
  }
}

const { form, showPassword, isValid, passwordMismatch, isLoading, handleRegister } =
  useRegisterForm()

const isOnline = ref(navigator.onLine)

const handleOnline = () => {
  isOnline.value = true
}
const handleOffline = () => {
  isOnline.value = false
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// ── Password strength ──────────────────────────────────────────
const strengthScore = computed(() => {
  const p = form.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[strengthScore.value]
})

function getStrengthClass(bar: number) {
  return bar <= strengthScore.value
    ? `strength-bar--active-${strengthScore.value}`
    : 'strength-bar--inactive'
}
</script>

<template>
  <div class="register-card">
    <!-- Title -->
    <div class="register-header">
      <h1 class="register-title">Create Account</h1>
      <p class="register-subtitle">
        Already have an account?
        <RouterLink to="/auth/login" class="register-link">Sign In</RouterLink>
      </p>
    </div>

    <!-- Offline Warning -->
    <div v-if="!isOnline" class="register-offline">
      ⚠️ Registration requires an internet connection.
    </div>

    <!-- Error Alert -->
    <div v-if="erroMessage" class="register-error">
      {{ erroMessage }}
    </div>

    <!-- Form -->
    <div class="register-form">
      <!-- Full Name -->
      <div class="field-group">
        <label class="field-label">Full Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Juan dela Cruz"
          class="field-input"
          autocomplete="name"
        />
      </div>

      <!-- Email -->
      <div class="field-group">
        <label class="field-label">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          class="field-input"
          autocomplete="email"
        />
      </div>

      <!-- Password -->
      <div class="field-group">
        <label class="field-label">Password</label>
        <div class="field-input-wrap">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Minimum 6 characters"
            class="field-input"
            autocomplete="new-password"
          />
          <button type="button" class="field-eye" @click="showPassword = !showPassword">
            <v-icon size="18" color="#888">
              {{ showPassword ? '$eyeOff' : '$eye' }}
            </v-icon>
          </button>
        </div>

        <!-- Password strength indicator -->
        <div class="password-strength">
          <div v-for="i in 4" :key="i" class="strength-bar" :class="getStrengthClass(i)" />
        </div>
        <span class="strength-label">{{ strengthLabel }}</span>
      </div>

      <!-- Confirm Password -->
      <div class="field-group">
        <label class="field-label">Confirm Password</label>
        <div class="field-input-wrap">
          <input
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Re-enter your password"
            class="field-input"
            :class="{ 'field-input--error': passwordMismatch }"
            autocomplete="new-password"
            @keyup.enter="handleRegister"
          />
          <button type="button" class="field-eye" @click="showPassword = !showPassword">
            <v-icon size="18" color="#888">
              {{ showPassword ? '$eyeOff' : '$eye' }}
            </v-icon>
          </button>
        </div>
        <span v-if="passwordMismatch" class="field-error-text"> Passwords do not match </span>
      </div>

      <!-- Register Button -->
      <button
        class="register-btn"
        :class="{ 'register-btn--loading': isLoading }"
        :disabled="!isValid || isLoading || !isOnline"
        @click="onRegister"
      >
        <span v-if="!isLoading">CREATE ACCOUNT</span>
        <span v-else class="register-spinner" />
      </button>

      <!-- Divider -->
      <div class="divider">
        <span class="divider-line" />
        <span class="divider-text">Or continue with</span>
        <span class="divider-line" />
      </div>

      <!-- Social Buttons -->
      <div class="social-row">
        <button class="social-btn social-btn--google">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
            />
            <path
              fill="#34A853"
              d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
            />
            <path
              fill="#4A90E2"
              d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
            />
            <path
              fill="#FBBC05"
              d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
            />
          </svg>
          Google
        </button>

        <button class="social-btn social-btn--facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Facebook
        </button>
      </div>

      <!-- Terms -->
      <p class="terms-text">
        By creating an account, you agree to our
        <a href="#" class="terms-link">Terms of Service</a>
        and
        <a href="#" class="terms-link">Privacy Policy</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
  background: #2a2a2e;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
}

/* Header */
.register-header {
  margin-bottom: 2rem;
}
.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.4rem;
}
.register-subtitle {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  gap: 0.4rem;
}
.register-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}
.register-link:hover {
  text-decoration: underline;
}

/* Alerts */
.register-error,
.register-offline {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}
.register-error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.register-offline {
  background: rgba(234, 179, 8, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

/* Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #ccc;
}

/* Inputs */
.field-input-wrap {
  position: relative;
}
.field-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1c1c1e;
  border: 1px solid #3a3a3e;
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.field-input::placeholder {
  color: #555;
}
.field-input:focus {
  border-color: #4a90e2;
}
.field-input--error {
  border-color: #ef4444 !important;
}
.field-input-wrap .field-input {
  padding-right: 2.8rem;
}
.field-eye {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
}
.field-error-text {
  font-size: 0.78rem;
  color: #f87171;
}

/* Password Strength */
.password-strength {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.4rem;
}
.strength-bar {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  transition: background 0.3s;
}
.strength-bar--inactive {
  background: #3a3a3e;
}
.strength-bar--active-1 {
  background: #ef4444;
}
.strength-bar--active-2 {
  background: #f59e0b;
}
.strength-bar--active-3 {
  background: #3b82f6;
}
.strength-bar--active-4 {
  background: #22c55e;
}
.strength-label {
  font-size: 0.75rem;
  color: #888;
  min-height: 1rem;
}

/* Register Button */
.register-btn {
  width: 100%;
  padding: 0.85rem;
  background: #e8e8e8;
  color: #1c1c1e;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 0.25rem;
}
.register-btn:hover:not(:disabled) {
  background: #fff;
  transform: translateY(-1px);
}
.register-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.register-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #555;
  border-top-color: #1c1c1e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #555;
  font-size: 0.8rem;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: #3a3a3e;
}

/* Social */
.social-row {
  display: flex;
  gap: 0.75rem;
}
.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem;
  background: transparent;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.social-btn--google {
  border: 1.5px solid #ea4335;
  color: #ea4335;
}
.social-btn--google:hover {
  background: rgba(234, 67, 53, 0.08);
}
.social-btn--facebook {
  border: 1.5px solid #1877f2;
  color: #1877f2;
}
.social-btn--facebook:hover {
  background: rgba(24, 119, 242, 0.08);
}

/* Terms */
.terms-text {
  font-size: 0.78rem;
  color: #555;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}
.terms-link {
  color: #4a90e2;
  text-decoration: none;
}
.terms-link:hover {
  text-decoration: underline;
}
</style>
