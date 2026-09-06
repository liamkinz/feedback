import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { appConfig as staticAppConfig } from '@/config/app.config'

export interface LandingNavItem {
  label: string
  action: 'scroll' | 'navigate' | 'external'
  target: string
}

export interface CTAButton {
  label: string
  variant: 'elevated' | 'outlined' | 'text'
  color: string
  action: 'navigate' | 'external' | 'scroll'
  target: string
}

export interface LogoConfig {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface NavbarConfig {
  title: string
  // Small line under the title. Navbar variants 3 and 4 show it; others ignore it.
  tagline?: string
  icon: string
  logo?: LogoConfig
  color: string
  elevation: number
  density: 'default' | 'prominent' | 'comfortable' | 'compact'
  navigationItems: LandingNavItem[]
  ctaButton: CTAButton
}

export interface SocialLink {
  platform: string
  icon: string
  url: string
  label: string
}

export interface FooterConfig {
  companyName: string
  tagline: string
  icon: string
  color: string
  copyright: string
  socialLinks: SocialLink[]
}

export interface SidebarConfig {
  title: string
  subtitle: string
}

// Top bar of the signed-in app shell. Separate from NavbarConfig so the
// public navbar can stay brand-colored while the app shell stays neutral.
export interface AppBarConfig {
  color?: string
  elevation?: number
  showSearch?: boolean
  searchPlaceholder?: string
}

export interface UIConfig {
  showNavbar: boolean
  showFooter: boolean
  navbar: NavbarConfig
  appBar?: AppBarConfig
  sidebar?: SidebarConfig
  footer: FooterConfig
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
}

export interface BackgroundImage {
  src: string
  alt: string
  overlay: {
    enabled: boolean
    color: string
    opacity: number
  }
}

export interface AuthPageConfig {
  title: string
  subtitle?: string
  backgroundImage?: BackgroundImage
}

export interface AppConfig {
  theme: ThemeConfig
  ui: UIConfig
  authPage?: AuthPageConfig
}

export const useAppConfigStore = defineStore('appConfig', () => {
  // Config is bundled at build time from src/config/app.config.ts, so it's
  // present before the first component renders — no request, no loading flash.
  const config = ref<AppConfig | null>(staticAppConfig)

  const ui = computed(() => config.value?.ui ?? null)
  const authPage = computed(() => config.value?.authPage ?? null)
  const themeColors = computed(() => config.value?.theme ?? null)

  return {
    config,
    ui,
    authPage,
    themeColors,
  }
})
