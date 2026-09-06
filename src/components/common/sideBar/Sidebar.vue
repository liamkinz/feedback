<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doLogout } from '@/stores/authStore'
import { useUserPermissions } from '@/composables/useUserPermissions'
import { useSidebarState } from '@/composables/useSidebarState'
import { flattenNavigationItems } from '@/utils/navigation'
import type { NavigationItem } from '@/utils/navigation'
import type { UIConfig } from '@/stores/appConfig'
import SlugName from '../insideNavbar/SlugName.vue'

const props = defineProps<{
  version?: string
  config?: UIConfig | null
}>()

const router = useRouter()
const route = useRoute()

const { getFilteredNavigationGroups, isLoading } = useUserPermissions()
const { isCollapsed, sidebarWidth, isSidebarVisible, toggleCollapsed } = useSidebarState()

const sidebarTitle = computed(() => props.config?.sidebar?.title || 'Menu')
const sidebarSubtitle = computed(() => props.config?.sidebar?.subtitle || '')
const brandIcon = computed(() => props.config?.navbar?.icon || 'mdi-cube-outline')

const versionText = computed(() => {
  const version = props.version?.trim()
  return version ? `v${version}` : ''
})

const sections = computed(() =>
  getFilteredNavigationGroups().map((group) => ({
    title: group.title,
    icon: group.icon,
    items: flattenNavigationItems(group.children),
  })),
)

function isItemActive(item: NavigationItem) {
  return route.path === item.route || (item.activeRoutes?.includes(route.path) ?? false)
}

function navigateTo(path: string) {
  router.push(path)
}

async function handleLogout() {
  await doLogout()
}
</script>

<template>
  <v-navigation-drawer
    v-if="isSidebarVisible"
    :width="sidebarWidth"
    permanent
    app
    fixed
    class="rail-drawer"
    color="surface"
    border="e"
  >
    <div class="d-flex align-center pa-3" :class="isCollapsed ? 'justify-center' : 'ga-3'">
      <v-avatar color="primary" rounded="lg" size="40">
        <v-icon :icon="brandIcon" size="22" />
      </v-avatar>

      <div v-if="!isCollapsed" class="overflow-hidden flex-grow-1">
        <div class="text-subtitle-2 font-weight-bold text-truncate">{{ sidebarTitle }}</div>
        <div v-if="sidebarSubtitle" class="text-caption text-medium-emphasis text-truncate">
          {{ sidebarSubtitle }}
        </div>
      </div>

      <v-btn
        v-if="!isCollapsed"
        icon
        size="x-small"
        variant="text"
        density="comfortable"
        @click="toggleCollapsed"
      >
        <v-icon icon="mdi-chevron-double-left" size="18" />
        <v-tooltip activator="parent" location="right">Collapse</v-tooltip>
      </v-btn>
    </div>

    <div v-if="isCollapsed" class="d-flex justify-center pb-2">
      <v-btn icon size="x-small" variant="text" density="comfortable" @click="toggleCollapsed">
        <v-icon icon="mdi-chevron-double-right" size="18" />
        <v-tooltip activator="parent" location="right">Expand</v-tooltip>
      </v-btn>
    </div>

    <v-divider />

    <div class="px-2 py-3">
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="24" width="3" />
      </div>

      <div v-else-if="sections.length === 0" class="text-center py-8 px-2">
        <v-icon icon="mdi-lock-outline" color="on-surface-variant" size="28" class="mb-2" />
        <template v-if="!isCollapsed">
          <p class="text-body-2 font-weight-medium mb-0">No accessible pages</p>
          <p class="text-caption text-medium-emphasis mb-0">Contact your administrator</p>
        </template>
      </div>

      <template v-else>
        <div v-for="section in sections" :key="section.title" class="mb-4">
          <p
            v-if="!isCollapsed"
            class="text-caption text-medium-emphasis font-weight-medium px-3 mb-1 section-label"
          >
            {{ section.title }}
          </p>
          <v-divider v-else class="mx-3 mb-2" />

          <button
            v-for="item in section.items"
            :key="item.route"
            type="button"
            class="nav-pill d-flex align-center rounded-lg"
            :class="[
              { 'nav-pill--active': isItemActive(item) },
              isCollapsed ? 'justify-center' : 'ga-3',
            ]"
            @click="navigateTo(item.route)"
          >
            <v-icon :icon="item.icon" size="20" />
            <span v-if="!isCollapsed" class="text-body-2 text-truncate">{{ item.title }}</span>
            <v-tooltip v-if="isCollapsed" activator="parent" location="right">
              {{ item.title }}
            </v-tooltip>
          </button>
        </div>
      </template>
    </div>

    <template #append>
      <v-divider />

      <div class="pa-2">
        <SlugName v-if="!isCollapsed" :show-inline-logout="true" />

        <v-btn v-else icon variant="text" color="error" block @click="handleLogout">
          <v-icon icon="mdi-logout" size="20" />
          <v-tooltip activator="parent" location="right">Log out</v-tooltip>
        </v-btn>

        <p
          v-if="!isCollapsed && versionText"
          class="text-caption text-medium-emphasis text-center mt-2 mb-1"
        >
          {{ versionText }}
        </p>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.rail-drawer {
  z-index: 1000 !important;
  height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
  position: fixed !important;
  transition: width 0.2s ease;
}

.section-label {
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-pill {
  width: 100%;
  padding: 9px 12px;
  margin-bottom: 2px;
  border: 0;
  background: transparent;
  color: rgb(var(--v-theme-on-surface-variant));
  cursor: pointer;
  position: relative;
  text-align: start;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.nav-pill:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
}

.nav-pill--active {
  background-color: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.nav-pill--active::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background-color: rgb(var(--v-theme-primary));
}
</style>
