/**
 * App shell configuration
 *
 * Drives the navbar/sidebar/footer choice, the app's theme colors, and the
 * auth page copy. No copy or brand color should be hardcoded in the shell
 * components — it all comes from here instead.
 */

import type { AppConfig } from '@/stores/appConfig'
import csmrLogo from '@/assets/CSMRLogo.png'
import csmrBackground from '@/assets/CSMRBackgroundPic.png'

export const appConfig: AppConfig = {
  // These two colors generate the full light and dark Vuetify palettes — see
  // src/themes/base.ts. Swap both for a different brand; everything else
  // (hovers, tints, borders, dark mode) is derived.
  theme: {
    primaryColor: '#1976D2',
    secondaryColor: '#424242',
  },

  ui: {
    showNavbar: true,
    showFooter: true,

    navbar: {
      title: 'CSMR',
      tagline: 'Feedback Console',
      icon: 'mdi-cube-outline',
      logo: {
        src: csmrLogo,
        alt: 'CSMR logo',
        width: 32,
        height: 32,
      },
      color: 'primary',
      elevation: 0,
      density: 'comfortable',
      navigationItems: [],
      ctaButton: {
        label: 'Sign in',
        variant: 'outlined',
        color: 'on-primary',
        action: 'navigate',
        target: '/auth',
      },
    },

    // Top bar of the signed-in app shell.
    appBar: {
      color: 'surface',
      elevation: 0,
      showSearch: false,
    },

    // Header of the signed-in app shell's left drawer.
    sidebar: {
      title: 'CSMR',
      subtitle: 'Feedback Console',
    },

    footer: {
      companyName: 'CSMR',
      tagline: 'Client feedback and inspection logging',
      icon: 'mdi-cube-outline',
      // A Vuetify theme token, so the footer follows the palette above.
      color: 'primary',
      copyright: 'CSMR. All rights reserved.',
      socialLinks: [],
    },
  },

  authPage: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue to your workspace',
    backgroundImage: {
      src: csmrBackground,
      alt: 'CSMR background',
      overlay: {
        enabled: true,
        color: '#0B1226',
        opacity: 0.35,
      },
    },
  },
}
