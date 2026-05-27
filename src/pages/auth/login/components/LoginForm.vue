<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLoginForm } from '../composables/useLogin'

const {
  form,
  showPassword,
  isValid,
  isLoading,
  emailNotConfirmed, // ← new
  isResending, // ← new
  toast, // ← new
  handleResend, // ← new
  handleLogin,
} = useLoginForm()

const rememberMe = ref(false)

// ← Add this
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
</script>

<template>
  <div class="login-card">
    <!-- Title -->
    <div class="login-header">
      <h3 class="login-welcome">Welcome Back to CSMR</h3>
      <h1 class="login-title">Login</h1>
      <p class="login-subtitle">
        Don't have an account yet?
        <RouterLink to="/auth/register" class="login-link">Sign Up</RouterLink>
      </p>
    </div>

    <!-- ✅ Email Not Confirmed Barrier -->
    <div v-if="emailNotConfirmed" class="confirm-barrier">
      <div class="confirm-barrier__icon">✉️</div>
      <h3 class="confirm-barrier__title">Confirm Your Email</h3>
      <p class="confirm-barrier__text">
        We sent a confirmation link to
        <strong>{{ form.email }}</strong>
        >. Please check your inbox and click the link before logging in.
      </p>
      <button class="confirm-barrier__resend" :disabled="isResending" @click="handleResend">
        {{ isResending ? 'Sending...' : 'Resend Confirmation Email' }}
      </button>
      <button class="confirm-barrier__dismiss" @click="emailNotConfirmed = false">
        Back to Login
      </button>
    </div>

    <!-- Login Form — hidden when barrier is shown -->
    <div v-else class="login-form">
      <!-- Offline Warning -->
      <div v-if="!isOnline" class="login-offline">
        You're offline — logging in with saved credentials.
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
          @keyup.enter="handleLogin"
        />
      </div>

      <!-- Password -->
      <div class="field-group">
        <div class="field-label-row">
          <label class="field-label">Password</label>
          <RouterLink to="/auth/forgot-password" class="forgot-link"> Forgot Password? </RouterLink>
        </div>
        <div class="field-input-wrap">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            class="field-input"
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
          <button type="button" class="field-eye" @click="showPassword = !showPassword">
            <v-icon size="18" color="#888">
              {{ showPassword ? '$eyeOff' : '$eye' }}
            </v-icon>
          </button>
        </div>
      </div>

      <!-- Remember Me -->
      <label class="remember-row">
        <input v-model="rememberMe" type="checkbox" class="remember-checkbox" />
        <span class="remember-label">Remember me</span>
      </label>

      <!-- Login Button -->
      <button
        class="login-btn"
        :class="{ 'login-btn--loading': isLoading }"
        :disabled="!isValid || isLoading"
        @click="handleLogin"
      >
        <span v-if="!isLoading">LOGIN</span>
        <span v-else class="login-spinner" />
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
    </div>
  </div>

  <!-- ✅ Vuetify Toast -->
  <v-snackbar
    v-model="toast.show"
    :color="toast.color"
    :timeout="toast.timeout"
    location="top right"
    rounded="lg"
    elevation="4"
  >
    {{ toast.message }}
    <template #actions>
      <v-btn variant="text" @click="toast.show = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
  background: #2a2a2e;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
}

/* Header */
.login-header {
  margin-bottom: 2rem;
}
.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.4rem;
}
.login-welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  margin: 0 0 0.4rem;
}
.login-subtitle {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  gap: 0.4rem;
}
.login-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}
.login-link:hover {
  text-decoration: underline;
}

/* Alerts */
.login-error,
.login-offline {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}
.login-error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.login-offline {
  background: rgba(234, 179, 8, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #ccc;
}
.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forgot-link {
  font-size: 0.8rem;
  color: #4a90e2;
  text-decoration: none;
}
.forgot-link:hover {
  text-decoration: underline;
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

/* Remember me */
.remember-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  margin-top: -0.25rem;
}
.remember-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #4a90e2;
  cursor: pointer;
}
.remember-label {
  color: #ccc;
  font-size: 0.9rem;
}

/* Login Button */
.login-btn {
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
}
.login-btn:hover:not(:disabled) {
  background: #fff;
  transform: translateY(-1px);
}
.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.login-spinner {
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

/* ── Email Confirmation Barrier ─────────────────────────────── */
.confirm-barrier {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  gap: 1rem;
}

.confirm-barrier__icon {
  font-size: 3rem;
  line-height: 1;
}

.confirm-barrier__title {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.confirm-barrier__text {
  color: #aaa;
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
}

.confirm-barrier__text strong {
  color: #fff;
}

.confirm-barrier__resend {
  width: 100%;
  padding: 0.8rem;
  background: #4a90e2;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-barrier__resend:hover:not(:disabled) {
  background: #357abd;
}

.confirm-barrier__resend:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-barrier__dismiss {
  background: none;
  border: none;
  color: #888;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
}

.confirm-barrier__dismiss:hover {
  color: #ccc;
}
</style>
