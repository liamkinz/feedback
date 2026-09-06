<script lang="ts" setup>
import { computed } from 'vue'
import type { UIConfig } from '@/stores/appConfig'
import { useSidebarState } from '@/composables/useSidebarState'

interface Props {
  config?: UIConfig | null
  /** Use a compact/minimal UI (intended for inner layouts). */
  compact?: boolean
}

const props = defineProps<Props>()

const { contentOffset } = useSidebarState()

const footerConfig = computed(() => props.config?.footer)
const currentYear = computed(() => new Date().getFullYear())

const footerColor = computed(() => footerConfig.value?.color || 'surface')

const gap = 12

const shellStyle = computed(() => {
  // contentOffset already accounts for mobile and for a hidden sidebar.
  const offset = props.compact ? contentOffset.value : 0

  return {
    paddingLeft: `${offset + gap}px`,
    paddingRight: `${gap}px`,
    paddingBottom: `${gap}px`,
  }
})

function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <v-footer
    v-if="config?.showFooter && footerConfig"
    app
    color="transparent"
    class="pa-0"
    :style="shellStyle"
  >
    <v-sheet :color="footerColor" rounded="xl" class="panel w-100">
      <!-- Compact/minimal footer for inner layouts -->
      <template v-if="compact">
        <div class="d-flex align-center ga-3 px-4 py-2 flex-wrap">
          <v-avatar color="primary" variant="tonal" rounded="lg" size="28">
            <v-icon :icon="footerConfig.icon" size="16" />
          </v-avatar>

          <span class="text-body-2 font-weight-medium">{{ footerConfig.companyName }}</span>

          <span class="text-caption panel-muted d-none d-sm-inline">
            {{ footerConfig.tagline }}
          </span>

          <v-spacer />

          <v-btn
            v-for="social in footerConfig.socialLinks"
            :key="social.platform"
            :aria-label="social.label"
            icon
            variant="text"
            size="x-small"
            density="comfortable"
            @click="openLink(social.url)"
          >
            <v-icon :icon="social.icon" size="18" />
          </v-btn>

          <span class="text-caption panel-muted">
            {{ currentYear }} © {{ footerConfig.copyright }}
          </span>
        </div>
      </template>

      <!-- Full footer (landing/external layouts) -->
      <template v-else>
        <div class="pa-6">
          <v-row>
            <v-col cols="12" md="8">
              <div class="d-flex align-center ga-3 mb-2">
                <v-avatar color="primary" variant="tonal" rounded="lg" size="40">
                  <v-icon :icon="footerConfig.icon" size="22" />
                </v-avatar>
                <span class="text-subtitle-1 font-weight-bold">
                  {{ footerConfig.companyName }}
                </span>
              </div>
              <p class="text-body-2 panel-muted mb-0">{{ footerConfig.tagline }}</p>
            </v-col>

            <v-col cols="12" md="4">
              <p class="text-caption panel-label mb-3">Follow</p>
              <div class="d-flex flex-wrap ga-2">
                <v-btn
                  v-for="social in footerConfig.socialLinks"
                  :key="social.platform"
                  :aria-label="social.label"
                  icon
                  variant="tonal"
                  size="small"
                  @click="openLink(social.url)"
                >
                  <v-icon :icon="social.icon" size="18" />
                  <v-tooltip activator="parent" location="top">{{ social.label }}</v-tooltip>
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-5 panel-divider" />

          <div class="d-flex align-center justify-space-between flex-wrap ga-2">
            <span class="text-caption panel-muted">
              {{ currentYear }} © {{ footerConfig.copyright }}
            </span>
          </div>
        </div>
      </template>
    </v-sheet>
  </v-footer>
</template>

<style scoped>
/* Matches the floating sheet of InsideNavbar5 and the rail in Sidebar2. */
.panel {
  border: 1px solid rgba(var(--v-theme-outline), 0.35);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

.panel-label {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

/* currentColor is whatever `:color` resolved to, so dimming it survives a
   palette change instead of assuming a light or dark background. */
.panel-muted {
  opacity: 0.7;
}

.panel-divider {
  border-color: currentColor;
  opacity: 0.2;
}

.panel-chip {
  border-radius: 8px;
}
</style>
