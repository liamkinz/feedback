<script lang="ts" setup>
import type { CTAButton, LandingNavItem, UIConfig } from '@/stores/appConfig'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useTheme } from '@/stores/useTheme'

interface Props {
  config?: UIConfig | null
}

const props = defineProps<Props>()

const router = useRouter()
const { mobile } = useDisplay()
const { toggleTheme: applyThemeToggle, getCurrentTheme, isLoadingTheme } = useTheme()

const mobileDrawer = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)
const activeTarget = ref('')

let ticking = false

function readScroll() {
  const scrolled = window.scrollY
  const reachable = document.documentElement.scrollHeight - window.innerHeight

  isScrolled.value = scrolled > 16
  scrollProgress.value = reachable > 0 ? Math.min((scrolled / reachable) * 100, 100) : 0

  if (mobile.value && mobileDrawer.value) mobileDrawer.value = false
}

function handleScroll() {
  if (ticking) return

  ticking = true
  requestAnimationFrame(() => {
    readScroll()
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  readScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navbarConfig = computed(() => props.config?.navbar)
const barColor = computed(() => navbarConfig.value?.color || 'surface')

const gap = 12

const panelStyle = computed(() => ({
  top: `${gap}px`,
  left: `${gap}px`,
  width: `calc(100% - ${gap * 2}px)`,
}))

const currentTheme = computed(() => getCurrentTheme())
const themeIcon = computed(() =>
  currentTheme.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night',
)
const themeTooltip = computed(
  () => `Switch to ${currentTheme.value === 'dark' ? 'light' : 'dark'} theme`,
)

function toggleTheme() {
  applyThemeToggle()
}

function scrollToSection(sectionId: string) {
  const element = document.querySelector(`#${sectionId}`)
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function runAction(action: LandingNavItem['action'], target: string) {
  if (mobile.value) mobileDrawer.value = false

  switch (action) {
    case 'scroll': {
      activeTarget.value = target
      scrollToSection(target)
      break
    }
    case 'navigate': {
      router.push(target)
      break
    }
    case 'external': {
      window.open(target, '_blank', 'noopener,noreferrer')
      break
    }
  }
}

function handleNavigation(item: LandingNavItem) {
  runAction(item.action, item.target)
}

function handleCTAAction(button: CTAButton) {
  runAction(button.action, button.target)
}
</script>

<template>
  <v-navigation-drawer
    v-if="mobile && config?.showNavbar && navbarConfig"
    v-model="mobileDrawer"
    temporary
    location="start"
    :color="barColor"
    width="280"
  >
    <div class="d-flex align-center ga-3 pa-4">
      <v-avatar color="primary" variant="tonal" rounded="lg" size="40">
        <v-icon :icon="navbarConfig.icon" size="22" />
      </v-avatar>
      <span class="text-subtitle-1 font-weight-bold">{{ navbarConfig.title }}</span>
    </div>

    <v-divider class="panel-divider" />

    <v-list nav class="pa-3">
      <v-list-item
        v-for="item in navbarConfig.navigationItems"
        :key="item.label"
        rounded="lg"
        @click="handleNavigation(item)"
      >
        <v-list-item-title class="text-body-2">{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <v-divider class="panel-divider" />
      <div class="pa-3">
        <v-btn
          :loading="isLoadingTheme"
          variant="tonal"
          block
          class="mb-2"
          :prepend-icon="themeIcon"
          @click="toggleTheme"
        >
          {{ themeTooltip }}
        </v-btn>

        <v-btn
          v-if="navbarConfig.ctaButton"
          :color="navbarConfig.ctaButton.color"
          :variant="navbarConfig.ctaButton.variant"
          block
          @click="handleCTAAction(navbarConfig.ctaButton)"
        >
          {{ navbarConfig.ctaButton.label }}
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar
    v-if="config?.showNavbar && navbarConfig"
    :color="barColor"
    :elevation="0"
    rounded="xl"
    height="60"
    class="glass-panel"
    :class="{ 'glass-panel--scrolled': isScrolled }"
    :style="panelStyle"
  >
    <div class="d-flex align-center ga-2 w-100 px-3">
      <v-btn v-if="mobile" icon variant="text" size="small" @click="mobileDrawer = !mobileDrawer">
        <v-icon icon="mdi-menu" />
      </v-btn>

      <div class="d-flex align-center ga-2 overflow-hidden">
        <template v-if="navbarConfig.logo?.src">
          <v-img
            :src="navbarConfig.logo.src"
            :alt="navbarConfig.logo.alt"
            :width="navbarConfig.logo.width"
            :height="navbarConfig.logo.height"
            contain
          >
            <template #error>
              <v-avatar color="primary" variant="tonal" rounded="lg" size="34">
                <v-icon :icon="navbarConfig.icon" size="18" />
              </v-avatar>
            </template>
          </v-img>
        </template>
        <v-avatar v-else color="primary" variant="tonal" rounded="lg" size="34">
          <v-icon :icon="navbarConfig.icon" size="18" />
        </v-avatar>

        <span class="text-subtitle-2 font-weight-bold text-truncate">
          {{ navbarConfig.title }}
        </span>
      </div>

      <v-spacer />

      <div v-if="!mobile && navbarConfig.navigationItems.length" class="segmented d-flex ga-1">
        <button
          v-for="item in navbarConfig.navigationItems"
          :key="item.label"
          type="button"
          class="segmented__item text-body-2 rounded-lg"
          :class="{ 'segmented__item--active': activeTarget === item.target }"
          @click="handleNavigation(item)"
        >
          {{ item.label }}
        </button>
      </div>

      <v-spacer v-if="!mobile" />

      <v-btn :loading="isLoadingTheme" icon variant="text" size="small" @click="toggleTheme">
        <v-icon :icon="themeIcon" size="20" />
        <v-tooltip activator="parent" location="bottom">{{ themeTooltip }}</v-tooltip>
      </v-btn>

      <v-btn
        v-if="navbarConfig.ctaButton && !mobile"
        :color="navbarConfig.ctaButton.color"
        :variant="navbarConfig.ctaButton.variant"
        size="small"
        rounded="lg"
        @click="handleCTAAction(navbarConfig.ctaButton)"
      >
        {{ navbarConfig.ctaButton.label }}
      </v-btn>
    </div>

    <v-progress-linear
      :model-value="scrollProgress"
      color="primary"
      height="2"
      class="reading-line"
    />
  </v-app-bar>
</template>

<style scoped>
/* Same inset glass sheet as InsideNavbar5 and OuterFooter3. */
.glass-panel {
  position: fixed !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.35);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.glass-panel--scrolled {
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.18);
}

.reading-line {
  position: absolute;
  bottom: 0;
  left: 0;
}

/* currentColor keeps the pills legible whichever colour the panel resolves to. */
.segmented__item {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 6px 14px;
  opacity: 0.75;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;
}

.segmented__item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
  opacity: 1;
}

.segmented__item--active {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
  opacity: 1;
  font-weight: 600;
}

.panel-divider {
  border-color: currentColor;
  opacity: 0.2;
}
</style>
