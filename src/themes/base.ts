/**
 * Theme factory
 *
 * Builds full light and dark Vuetify palettes from just two brand colors
 * (see src/config/app.config.ts). No hardcoded colors here — everything
 * else (hovers, tints, borders, dark mode) is derived from those two.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1]!, 16),
        g: Number.parseInt(result[2]!, 16),
        b: Number.parseInt(result[3]!, 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Mixes toward white (positive amount) or black (negative amount), which
// keeps the hue steady — multiplying the raw channels instead skews it.
function adjustColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const target = amount >= 0 ? 255 : 0
  const weight = Math.min(1, Math.abs(amount))

  const r = Math.round(rgb.r + (target - rgb.r) * weight)
  const g = Math.round(rgb.g + (target - rgb.g) * weight)
  const b = Math.round(rgb.b + (target - rgb.b) * weight)

  return rgbToHex(r, g, b)
}

// Status colors are fixed instead of generated from the brand color — a
// "success" alert tinted with a blue primary would read as information.
const lightStatusColors = {
  error: '#DC2626',
  warning: '#B45309',
  info: '#0284C7',
  success: '#059669',
}

const darkStatusColors = {
  error: '#F87171',
  warning: '#FBBF24',
  info: '#38BDF8',
  success: '#34D399',
}

// Neutrals the surfaces are built from, independent of the brand color so a
// saturated primary can't tint the page background.
const lightNeutrals = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceBright: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  surfaceContainer: '#F4F6FA',
  surfaceVariant: '#E2E8F0',
  onSurfaceVariant: '#5A6478',
  onBackground: '#111827',
  outline: '#D9DEE8',
}

const darkNeutrals = {
  background: '#0B1120',
  surface: '#131B2C',
  surfaceBright: '#1C2638',
  surfaceLight: '#1C2638',
  surfaceContainer: '#182134',
  surfaceVariant: '#2C3850',
  onSurfaceVariant: '#A3AEC4',
  onBackground: '#E8EDF7',
  outline: '#2E3A52',
}

// WCAG relative luminance. The 0-255 channels are gamma-encoded, so they have
// to be linearized before weighting — averaging the raw values (the old
// 0.299/0.587/0.114 shortcut) overrates mid-tone blues and picked white text
// for the dark-theme primary at only 3.6:1.
function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  function linearize(channel: number): number {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

// WCAG 2.1 contrast ratio between two relative luminances, 1:1 to 21:1.
function contrastRatio(a: number, b: number): number {
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)
  return (lighter + 0.05) / (darker + 0.05)
}

// Picks whichever of black or white actually contrasts better against the
// given background, rather than guessing from a brightness cutoff.
function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'

  const background = relativeLuminance(rgb)
  const againstWhite = contrastRatio(background, 1)
  const againstBlack = contrastRatio(background, 0)

  return againstBlack >= againstWhite ? '#000000' : '#FFFFFF'
}

export function createLightTheme(primaryColor: string, secondaryColor: string) {
  return {
    dark: false,
    colors: {
      primary: primaryColor,
      'primary-darken-1': adjustColor(primaryColor, -0.15),
      'primary-lighten-1': adjustColor(primaryColor, 0.15),
      'primary-lighten-2': adjustColor(primaryColor, 0.3),

      secondary: secondaryColor,
      'secondary-darken-1': adjustColor(secondaryColor, -0.15),
      'secondary-lighten-1': adjustColor(secondaryColor, 0.15),

      accent: adjustColor(primaryColor, 0.25),
      'accent-darken-1': adjustColor(primaryColor, 0.15),
      'accent-lighten-1': adjustColor(primaryColor, 0.4),

      background: lightNeutrals.background,
      surface: lightNeutrals.surface,
      'surface-bright': lightNeutrals.surfaceBright,
      'surface-light': lightNeutrals.surfaceLight,
      'surface-container': lightNeutrals.surfaceContainer,
      'surface-variant': lightNeutrals.surfaceVariant,
      'on-surface-variant': lightNeutrals.onSurfaceVariant,

      outline: lightNeutrals.outline,

      'on-primary': getContrastColor(primaryColor),
      'on-secondary': getContrastColor(secondaryColor),
      'on-background': lightNeutrals.onBackground,
      'on-surface': lightNeutrals.onBackground,

      error: lightStatusColors.error,
      warning: lightStatusColors.warning,
      info: lightStatusColors.info,
      success: lightStatusColors.success,

      'on-error': '#FFFFFF',
      'on-warning': '#FFFFFF',
      'on-info': '#FFFFFF',
      'on-success': '#FFFFFF',
    },
    variables: {
      'border-color': lightNeutrals.outline,
      'border-opacity': 1,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.6,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.08,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.16,
      'dragged-opacity': 0.08,
    },
  }
}

export function createDarkTheme(primaryColor: string, secondaryColor: string) {
  return {
    dark: true,
    colors: {
      primary: adjustColor(primaryColor, 0.15),
      'primary-darken-1': primaryColor,
      'primary-lighten-1': adjustColor(primaryColor, 0.3),
      'primary-lighten-2': adjustColor(primaryColor, 0.45),

      secondary: adjustColor(secondaryColor, 0.15),
      'secondary-darken-1': secondaryColor,
      'secondary-lighten-1': adjustColor(secondaryColor, 0.3),

      accent: adjustColor(primaryColor, 0.35),
      'accent-darken-1': adjustColor(primaryColor, 0.25),
      'accent-lighten-1': adjustColor(primaryColor, 0.5),

      background: darkNeutrals.background,
      surface: darkNeutrals.surface,
      'surface-bright': darkNeutrals.surfaceBright,
      'surface-light': darkNeutrals.surfaceLight,
      'surface-container': darkNeutrals.surfaceContainer,
      'surface-variant': darkNeutrals.surfaceVariant,
      'on-surface-variant': darkNeutrals.onSurfaceVariant,

      outline: darkNeutrals.outline,

      'on-primary': getContrastColor(adjustColor(primaryColor, 0.15)),
      'on-secondary': getContrastColor(adjustColor(secondaryColor, 0.15)),
      'on-background': darkNeutrals.onBackground,
      'on-surface': darkNeutrals.onBackground,

      error: darkStatusColors.error,
      warning: darkStatusColors.warning,
      info: darkStatusColors.info,
      success: darkStatusColors.success,

      'on-error': '#0F172A',
      'on-warning': '#0F172A',
      'on-info': '#0F172A',
      'on-success': '#0F172A',
    },
    variables: {
      'border-color': darkNeutrals.outline,
      'border-opacity': 1,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.6,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.12,
      'focus-opacity': 0.16,
      'selected-opacity': 0.12,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.2,
      'dragged-opacity': 0.12,
    },
  }
}

export function createThemes(primary: string, secondary: string) {
  return {
    light: createLightTheme(primary, secondary),
    dark: createDarkTheme(primary, secondary),
  }
}
