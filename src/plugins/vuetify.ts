import 'vuetify/styles'
// import '@mdi/font/css/materialdesignicons.css'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// ✅ Import only the icons you actually use
import {
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBox,
  mdiRadioboxMarked,
  mdiRadioboxBlank,
  mdiChevronDown,
  mdiMenu,
  mdiCloseCircle,
  mdiClose,
  mdiCloudUpload,
  mdiMagnify,
  mdiCalendarRange,
  mdiHomeOutline,
  mdiViewDashboardOutline,
  mdiOfficeBuildingOutline,
  mdiClipboardCheckOutline,
  mdiMapMarkerOutline,
  mdiCalendarCheckOutline,
  mdiEmailOutline,
  mdiCloseBox,
  mdiWeatherNight,
  mdiWhiteBalanceSunny,
  mdiArrowRight,
  mdiChevronRight,
  mdiRocketLaunchOutline,
  mdiEye,
  mdiEyeOff,
  mdiFilePdfBox,
  mdiCalendarSearch,
} from '@mdi/js'

// ─── Theme Definitions ────────────────────────────────────────────────────────

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#FFFFFF',
    surface: '#FFFFFF',
  },
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#2196F3',
    secondary: '#616161',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#121212',
    surface: '#212121',
  },
}

// ─── Vuetify Instance ─────────────────────────────────────────────────────────

export const vuetify = createVuetify({
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
      // Vuetify internal icons
      checkboxOn: mdiCheckboxMarked,
      checkboxOff: mdiCheckboxBlankOutline,
      checkboxIndeterminate: mdiMinusBox,
      radioOn: mdiRadioboxMarked,
      radioOff: mdiRadioboxBlank,
      dropdown: mdiChevronDown,
      menu: mdiMenu,
      clear: mdiCloseCircle,
      close: mdiClose,

      // App-specific icons
      cloudUpload: mdiCloudUpload,
      magnify: mdiMagnify,
      calendarRange: mdiCalendarRange,
      homeOutline: mdiHomeOutline,
      viewDashboardOutline: mdiViewDashboardOutline,
      officeBuildingOutline: mdiOfficeBuildingOutline,
      clipboardCheckOutline: mdiClipboardCheckOutline,
      mapMarkerOutline: mdiMapMarkerOutline,
      calendarCheckOutline: mdiCalendarCheckOutline,
      emailOutline: mdiEmailOutline,
      closeBox: mdiCloseBox,
      arrowRight: mdiArrowRight,
      chevronRight: mdiChevronRight,
      rocketLaunchOutline: mdiRocketLaunchOutline,

      // Theme toggle icons
      weatherNight: mdiWeatherNight,
      whiteBalanceSunny: mdiWhiteBalanceSunny,

      //Auth
      eye: mdiEye,
      eyeOff: mdiEyeOff,

      //Exporting PDF
      filePdfBox: mdiFilePdfBox,
      calendarSearch: mdiCalendarSearch,
    },
    sets: { mdi },
  },

  defaults: {
    VBtn: {
      variant: 'elevated',
      rounded: 'md',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VCard: {
      rounded: 'lg',
    },
  },
})
