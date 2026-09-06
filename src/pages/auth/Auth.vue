<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import { useAppConfigStore } from '@/stores/appConfig'

const router = useRouter()
const route = useRoute()
const { mobile } = useDisplay()

const appConfig = useAppConfigStore()
const { authPage: authPageData, ui } = storeToRefs(appConfig)

const isLoginMode = ref(true)

// Brand line under the card. Reuses the footer's company name so the auth page
// doesn't introduce a second place to spell the product name.
const brandName = computed(() => ui.value?.footer?.companyName ?? ui.value?.navbar?.title ?? '')

const background = computed(() => authPageData.value?.backgroundImage ?? null)

const overlayStyle = computed(() => {
  const overlay = background.value?.overlay
  if (!overlay?.enabled) return {}

  return {
    backgroundColor: overlay.color,
    opacity: String(overlay.opacity),
  }
})

function switchToRegister() {
  isLoginMode.value = false
  router.replace({ query: { mode: 'register' } })
}

function switchToLogin() {
  isLoginMode.value = true
  router.replace({ query: { mode: 'login' } })
}

function navigateHome() {
  router.push('/')
}

onMounted(() => {
  isLoginMode.value = route.query.mode !== 'register'
})
</script>

<template>
  <div class="auth-shell">
    <v-img
      v-if="background?.src"
      :src="background.src"
      :alt="background.alt"
      class="auth-shell__image"
      cover
    />
    <div class="auth-shell__tint" :style="overlayStyle" />

    <div class="auth-shell__grid">
      <!-- Empty on purpose — its only job is to claim the right-hand grid
           column so the form docks left instead of sitting dead-center. -->
      <div class="auth-shell__aside d-none d-lg-block" />

      <div class="auth-shell__panel d-flex align-center justify-center pa-4">
        <div class="w-100" style="max-width: 460px">
          <v-btn
            variant="text"
            rounded="lg"
            class="glass-chip on-glass mb-4"
            prepend-icon="mdi-arrow-left"
            @click="navigateHome"
          >
            Back to home
          </v-btn>

          <v-sheet rounded="xl" class="auth-card" :class="mobile ? 'pa-6' : 'pa-8'">
            <div class="d-flex align-center ga-4 mb-6">
              <v-avatar color="primary" variant="tonal" rounded="lg" size="44">
                <v-icon icon="mdi-cube-outline" size="24" />
              </v-avatar>
              <div class="overflow-hidden">
                <h1 class="text-h6 font-weight-bold text-truncate">
                  {{ authPageData?.title }}
                </h1>
                <p
                  v-if="authPageData?.subtitle"
                  class="text-body-2 text-medium-emphasis mb-0 text-truncate"
                >
                  {{ authPageData.subtitle }}
                </p>
              </div>
            </div>

            <div class="segmented d-flex mb-6 rounded-lg">
              <button
                type="button"
                class="segmented__item text-body-2 rounded-lg"
                :class="{ 'segmented__item--active': isLoginMode }"
                @click="switchToLogin"
              >
                Sign in
              </button>
              <button
                type="button"
                class="segmented__item text-body-2 rounded-lg"
                :class="{ 'segmented__item--active': !isLoginMode }"
                @click="switchToRegister"
              >
                Sign up
              </button>
            </div>

            <v-fade-transition mode="out-in">
              <LoginForm v-if="isLoginMode" key="login" />
              <RegisterForm v-else key="register" @switch-to-login="switchToLogin" />
            </v-fade-transition>
          </v-sheet>

          <p v-if="brandName" class="auth-brand text-caption text-center mt-6 mb-0">
            {{ brandName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: rgb(var(--v-theme-background));
  overflow: hidden;
}

.auth-shell__image,
.auth-shell__tint {
  position: absolute;
  inset: 0;
}

.auth-shell__grid {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
}

.auth-shell__panel {
  min-height: 100vh;
  min-height: 100dvh;
}

@media (min-width: 1280px) {
  .auth-shell__grid {
    grid-template-columns: 1.1fr 1fr;
  }

  .auth-shell__aside {
    order: 2;
  }

  .auth-shell__panel {
    order: 1;
  }
}

.auth-card {
  background-color: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
}

.glass-chip {
  background-color: rgba(11, 18, 38, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .auth-card {
    background-color: rgb(var(--v-theme-surface));
  }

  .glass-chip {
    background-color: rgba(11, 18, 38, 0.72);
  }
}

.on-glass {
  color: #fff;
}

/* Brand line under the card. Sits on the photo, not on a surface, so it takes
   a fixed light color instead of a theme token. */
.auth-brand {
  color: rgba(255, 255, 255, 0.72);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.segmented {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  padding: 4px;
}

.segmented__item {
  flex: 1;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 8px 12px;
  opacity: 0.7;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;
}

.segmented__item:hover {
  opacity: 1;
}

.segmented__item:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: -2px;
}

.segmented__item--active {
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-primary));
  opacity: 1;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
</style>
