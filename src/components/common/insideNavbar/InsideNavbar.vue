<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import type { UIConfig } from '@/stores/appConfig'
import { useTheme } from '@/stores/useTheme'
import { useUserPermissions } from '@/composables/useUserPermissions'
import { useSidebarState } from '@/composables/useSidebarState'
import { navigationConfig, flattenNavigationItems } from '@/utils/navigation'
import SlugName from './SlugName.vue'

interface Props {
  config?: UIConfig | null
}

const props = defineProps<Props>()

const { mobile } = useDisplay()
const route = useRoute()

const { getFilteredNavigationGroups, isLoading } = useUserPermissions()
const { contentOffset } = useSidebarState()
const { toggleTheme: applyThemeToggle, getCurrentTheme, isLoadingTheme } = useTheme()

const mobileDrawer = ref(false)
const searchOpen = ref(false)

const navbarConfig = computed(() => props.config?.navbar)
const appBarConfig = computed(() => props.config?.appBar)
const showSearch = computed(() => appBarConfig.value?.showSearch ?? false)
const searchPlaceholder = computed(() => appBarConfig.value?.searchPlaceholder || 'Search…')

const gap = 12

// One branch instead of two: contentOffset is already 0 on mobile and while
// the sidebar is hidden, so the bar tracks the drawer in every case.
const barStyle = computed(() => ({
  left: `${contentOffset.value + gap}px`,
  width: `calc(100% - ${contentOffset.value + gap * 2}px)`,
}))

const navigationGroups = computed(() => getFilteredNavigationGroups())

const trail = computed(() => {
  for (const group of navigationConfig) {
    const match = flattenNavigationItems(group.children).find(
      (item) => item.route === route.path || item.activeRoutes?.includes(route.path),
    )

    if (match) return { group: group.title, page: match.title, icon: match.icon }
  }

  return null
})

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
</script>

<template>
  <v-navigation-drawer
    v-if="mobile && config?.showNavbar && navbarConfig"
    v-model="mobileDrawer"
    temporary
    location="start"
    color="surface"
    width="280"
    :elevation="0"
  >
    <div class="d-flex align-center ga-3 pa-4">
      <v-avatar color="primary" rounded="lg" size="40">
        <v-icon :icon="navbarConfig?.icon" size="22" />
      </v-avatar>
      <span class="text-subtitle-1 font-weight-bold">{{ navbarConfig?.title }}</span>
    </div>

    <v-divider />

    <v-list nav class="pa-3">
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="28" width="3" />
      </div>

      <div v-else-if="navigationGroups.length === 0" class="text-center py-8">
        <v-icon icon="mdi-lock-outline" color="on-surface-variant" size="28" class="mb-2" />
        <p class="text-body-2 font-weight-medium mb-0">No accessible pages</p>
      </div>

      <template v-else>
        <div v-for="group in navigationGroups" :key="group.title" class="mb-3">
          <p class="text-caption text-medium-emphasis px-3 mb-1 group-label">
            {{ group.title }}
          </p>
          <v-list-item
            v-for="item in flattenNavigationItems(group.children)"
            :key="item.route"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.route"
            rounded="lg"
            @click="mobileDrawer = false"
          />
        </div>
      </template>

      <v-divider class="my-3" />

      <v-list-item
        :title="themeTooltip"
        :prepend-icon="themeIcon"
        rounded="lg"
        @click="toggleTheme"
      />
    </v-list>

    <template #append>
      <v-divider />
      <div class="pa-3">
        <SlugName :show-inline-logout="true" />
      </div>
    </template>
  </v-navigation-drawer>

  <div v-if="config?.showNavbar && navbarConfig" class="command-bar" :style="barStyle">
    <v-sheet rounded="xl" color="surface" class="command-bar__sheet d-flex align-center ga-2 px-3">
      <v-btn v-if="mobile" icon variant="text" size="small" @click="mobileDrawer = !mobileDrawer">
        <v-icon icon="mdi-menu" />
      </v-btn>

      <div v-if="mobile" class="d-flex align-center ga-2 flex-grow-1 overflow-hidden">
        <v-avatar color="primary" rounded="lg" size="28">
          <v-icon :icon="navbarConfig?.icon" size="16" />
        </v-avatar>
        <span class="text-subtitle-2 font-weight-bold text-truncate">
          {{ trail?.page || navbarConfig?.title }}
        </span>
      </div>

      <div v-else class="d-flex align-center ga-2 flex-grow-1 overflow-hidden">
        <template v-if="trail">
          <span class="text-body-2 text-medium-emphasis">{{ trail.group }}</span>
          <v-icon icon="mdi-chevron-right" size="16" class="text-medium-emphasis" />
          <v-icon :icon="trail.icon" size="18" color="primary" />
          <span class="text-body-2 font-weight-bold text-truncate">{{ trail.page }}</span>
        </template>
        <span v-else class="text-body-2 font-weight-bold text-truncate">
          {{ navbarConfig?.title }}
        </span>
      </div>

      <v-btn
        v-if="showSearch && !searchOpen && !mobile"
        variant="tonal"
        size="small"
        rounded="lg"
        class="command-bar__trigger"
        @click="searchOpen = true"
      >
        <v-icon icon="mdi-magnify" size="18" start />
        <span class="text-caption">{{ searchPlaceholder }}</span>
      </v-btn>

      <v-btn :loading="isLoadingTheme" icon variant="text" size="small" @click="toggleTheme">
        <v-icon :icon="themeIcon" size="20" />
        <v-tooltip activator="parent" location="bottom">{{ themeTooltip }}</v-tooltip>
      </v-btn>

      <SlugName />
    </v-sheet>
  </div>
</template>

<style scoped>
.command-bar {
  position: fixed !important;
  top: 12px;
  z-index: 1001;
}

.command-bar__sheet {
  height: 56px;
  border: 1px solid rgba(var(--v-theme-outline), 0.35);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.command-bar__search {
  max-width: 260px;
}

.command-bar__trigger {
  text-transform: none;
  opacity: 0.75;
}

.group-label {
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
