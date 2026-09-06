/**
 * Theme Store
 *
 * Centralized theme management with:
 * - Pinia store for state management
 * - localStorage persistence
 * - Theme colors from src/config/app.config.ts
 * - Light/Dark theme switching
 */

import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { vuetify } from '@/plugins/vuetify'

const themeStorageKey = 'theme-preference'

export const useTheme = defineStore('theme', () => {
  // State
  const isInitialized = ref(false)
  const themeLoadError = ref<string | null>(null)
  const isLoadingTheme = ref(false)

  // Computed: Get current theme from Vuetify
  const currentTheme = computed<'light' | 'dark'>(() => {
    return (vuetify.theme?.global.name.value as 'light' | 'dark') || 'light'
  })

  // Single source of truth for "are we in dark mode". Components read this
  // instead of each calling Vuetify's own useTheme() and deriving it again.
  // Reads Vuetify's *resolved* theme rather than comparing the theme name, so
  // it stays correct if a palette is renamed or a third theme is added.
  const isDark = computed(() => vuetify.theme?.global.current.value.dark ?? false)

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = (theme: 'light' | 'dark') => {
    localStorage.setItem(themeStorageKey, theme)
    vuetify.theme?.change(theme)
  }

  /**
   * Apply the saved theme preference from localStorage.
   * Should be called after Vuetify and Pinia are set up.
   */
  const initializeTheme = () => {
    if (isInitialized.value) {
      return // Already applied
    }

    try {
      isLoadingTheme.value = true
      themeLoadError.value = null

      const savedTheme = localStorage.getItem(themeStorageKey)
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
      }
      // If no saved theme, keep the default from src/plugins/vuetify.ts

      isInitialized.value = true
    } catch (error) {
      // localStorage throws in private-mode browsers. The app still works,
      // it just won't remember the choice between visits.
      themeLoadError.value =
        error instanceof Error ? error.message : 'Failed to load theme preference'
      console.error('Theme initialization failed:', error)
    } finally {
      isLoadingTheme.value = false
    }
  }

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  /**
   * Get current theme name
   */
  const getCurrentTheme = (): 'light' | 'dark' => {
    return currentTheme.value
  }

  return {
    // State
    isThemeLoaded: isInitialized,
    currentTheme,
    isDark,
    isInitialized,
    themeLoadError: readonly(themeLoadError),
    isLoadingTheme: readonly(isLoadingTheme),

    // Actions
    initializeTheme,
    setTheme,
    toggleTheme,
    getCurrentTheme,
  }
})
