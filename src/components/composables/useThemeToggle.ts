import { computed, onMounted } from 'vue'
import type { ComputedRef } from 'vue'
import { useTheme } from 'vuetify'

type ThemeName = 'light' | 'dark'

const THEME_KEY = 'app-theme' as const

interface UseThemeToggle {
  isDark: ComputedRef<boolean>
  toggleTheme: () => void
  setTheme: (name: ThemeName) => void
}

export function useThemeToggle(): UseThemeToggle {
  const theme = useTheme()

  const isDark = computed<boolean>(() => theme.global.current.value.dark)

  function isValidTheme(value: string | null): value is ThemeName {
    return value === 'light' || value === 'dark'
  }

  function setTheme(name: ThemeName): void {
    theme.global.name.value = name
    localStorage.setItem(THEME_KEY, name)
  }

  function toggleTheme(): void {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  onMounted((): void => {
    const saved = localStorage.getItem(THEME_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemTheme: ThemeName = prefersDark ? 'dark' : 'light'
    setTheme(isValidTheme(saved) ? saved : systemTheme)
  })

  return { isDark, toggleTheme, setTheme }
}
