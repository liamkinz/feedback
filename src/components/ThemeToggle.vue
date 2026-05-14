<script setup lang="ts">
import { ref } from 'vue'
import { useThemeToggle } from '@/components/composables/useThemeToggle'

const { isDark, toggleTheme: originalToggleTheme } = useThemeToggle()
const isAnimating = ref(false)

const toggleTheme = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  originalToggleTheme()
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}
</script>

<template>
  <button
    class="theme-toggle"
    :class="{ 'theme-toggle--dark': isDark }"
    :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    @click="toggleTheme"
  >
    <!-- Track -->
    <span class="toggle-track">
      <!-- Stars (visible in dark mode) -->
      <span class="track-star track-star--1" />
      <span class="track-star track-star--2" />
      <span class="track-star track-star--3" />

      <!-- Thumb (the sliding circle) -->
      <span class="toggle-thumb" :class="{ 'is-animating': isAnimating }">
        <v-icon class="thumb-icon thumb-icon--sun" size="13">mdi-white-balance-sunny</v-icon>
        <v-icon class="thumb-icon thumb-icon--moon" size="13">mdi-moon-waning-crescent</v-icon>
      </span>
    </span>
  </button>
</template>

<style scoped>
/* ── Toggle Wrapper ── */
.theme-toggle {
  --track-w: 52px;
  --track-h: 28px;
  --thumb-size: 22px;
  --thumb-offset: 3px;
  --track-light-from: #87ceeb;
  --track-light-to: #ffd580;
  --track-dark-from: #1a2e5a;
  --track-dark-to: #0d1b2a;
  --thumb-light: #fff;
  --thumb-dark: #e8eaf6;
  --transition: 0.45s cubic-bezier(0.4, 0, 0.2, 1);

  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 4px;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.theme-toggle:focus-visible .toggle-track {
  box-shadow: 0 0 0 3px rgba(79, 142, 247, 0.5);
}

/* ── Track ── */
.toggle-track {
  position: relative;
  width: var(--track-w);
  height: var(--track-h);
  border-radius: 999px;
  background: linear-gradient(135deg, var(--track-light-from), var(--track-light-to));
  transition:
    background var(--transition),
    box-shadow var(--transition);
  overflow: hidden;
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.15),
    0 1px 4px rgba(0, 0, 0, 0.12);
}

.theme-toggle--dark .toggle-track {
  background: linear-gradient(135deg, var(--track-dark-from), var(--track-dark-to));
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.4),
    0 0 8px rgba(79, 142, 247, 0.2);
}

/* ── Stars (dark mode decoration) ── */
.track-star {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.theme-toggle--dark .track-star {
  opacity: 1;
}

.track-star--1 {
  width: 3px;
  height: 3px;
  top: 6px;
  left: 8px;
  transition-delay: 0.05s;
}
.track-star--2 {
  width: 2px;
  height: 2px;
  top: 14px;
  left: 14px;
  transition-delay: 0.1s;
}
.track-star--3 {
  width: 2px;
  height: 2px;
  top: 8px;
  left: 20px;
  transition-delay: 0.15s;
}

/* ── Thumb ── */
.toggle-thumb {
  position: absolute;
  top: var(--thumb-offset);
  left: var(--thumb-offset);
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: var(--thumb-light);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform var(--transition),
    background var(--transition),
    box-shadow var(--transition);
  will-change: transform;
}

.theme-toggle--dark .toggle-thumb {
  transform: translateX(calc(var(--track-w) - var(--thumb-size) - var(--thumb-offset) * 2));
  background: var(--thumb-dark);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.4),
    0 0 6px rgba(79, 142, 247, 0.3);
}

.toggle-thumb.is-animating {
  transform: scaleX(1.15);
}

.theme-toggle--dark .toggle-thumb.is-animating {
  transform: translateX(calc(var(--track-w) - var(--thumb-size) - var(--thumb-offset) * 2))
    scaleX(1.15);
}

/* ── Icons inside thumb ── */
.thumb-icon {
  position: absolute;
  transition:
    opacity 0.25s ease,
    transform 0.3s ease;
}

/* Sun icon — visible in light mode */
.thumb-icon--sun {
  color: #f59e0b !important;
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.theme-toggle--dark .thumb-icon--sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* Moon icon — visible in dark mode */
.thumb-icon--moon {
  color: #4f8ef7 !important;
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-toggle--dark .thumb-icon--moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
</style>
