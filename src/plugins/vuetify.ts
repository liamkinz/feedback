import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@/styles/app.scss'
import { createThemes } from '@/themes'
import { appConfig } from '@/config/app.config'

// ─── Theme Definitions ────────────────────────────────────────────────────────
// Built once from the two brand colors in src/config/app.config.ts — see
// src/themes/base.ts. Baked into createVuetify() below rather than swapped in
// at runtime, so Vuetify's internal theme bookkeeping only ever sees one
// complete, valid theme object per mode.

const { light: lightTheme, dark: darkTheme } = createThemes(
  appConfig.theme.primaryColor,
  appConfig.theme.secondaryColor,
)

// ─── Vuetify Instance ─────────────────────────────────────────────────────────

const vuetify = createVuetify({
  // Every ported shell component gets its responsiveness from
  // `const { mobile } = useDisplay()`, tuned for this breakpoint — the
  // sidebar hides itself at the same width.
  display: {
    mobileBreakpoint: 'md',
  },

  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      // A few short names used around the app for icons that predate the
      // shell merge — kept so those call sites didn't need to change.
      cloudUpload: 'mdi-cloud-upload',
      magnify: 'mdi-magnify',
      calendarRange: 'mdi-calendar-range',
      calendar: 'mdi-calendar',
      filePdfBox: 'mdi-file-pdf-box',
      chartBar: 'mdi-chart-bar',
      refresh: 'mdi-refresh',
      calendarSearch: 'mdi-calendar-search',
    },
    sets: { mdi },
  },

  // App-wide component defaults. Setting them here instead of repeating props
  // on every component is what keeps buttons, cards and inputs looking the
  // same across the whole app — change a value here and it updates everywhere.
  defaults: {
    global: {
      ripple: true,
    },
    VBtn: {
      // `text-none` turns off Material's ALL-CAPS button labels.
      class: 'text-none font-weight-medium',
      rounded: 'lg',
      variant: 'flat',
      elevation: 0,
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
      border: true,
    },
    VSheet: {
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
    },
    VChip: {
      rounded: 'lg',
      size: 'small',
    },
    VAlert: {
      variant: 'tonal',
      rounded: 'lg',
      border: 'start',
    },
    VList: {
      rounded: 'lg',
    },
    VListItem: {
      rounded: 'lg',
    },
    VDialog: {
      scrollable: true,
    },
    VMenu: {
      transition: 'slide-y-transition',
    },
    VTooltip: {
      location: 'bottom',
    },
    VDataTable: {
      hover: true,
    },
    VTabs: {
      sliderColor: 'primary',
    },
    VTab: {
      class: 'text-none font-weight-medium',
    },
    VAvatar: {
      rounded: 'lg',
    },
    VProgressLinear: {
      rounded: true,
      color: 'primary',
    },
  },
})

// Export vuetify instance for dynamic theme updates
export { vuetify }

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default vuetify
