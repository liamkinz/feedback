<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ToggleTheme from '@/components/ThemeToggle.vue'

type NavItem = {
  id: number
  label: string
  icon: string
  to: string
}

const authStore = useAuthStore()
const router = useRouter()

const { mdAndUp } = useDisplay()
const drawer = ref(true)

watch(
  mdAndUp,
  (isDesktop) => {
    drawer.value = isDesktop
  },
  { immediate: true },
)

const navItems: NavItem[] = [
  { id: 1, label: 'Overview', icon: '$home', to: '/' },
  { id: 2, label: 'Analytics', icon: '$chartBar', to: '/analytics' },
  { id: 3, label: 'Reports', icon: '$fileDocument', to: '/reports' },
]

const initials = computed(() => {
  const name = authStore.userName || authStore.user?.email?.split('@')[0] || ''

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) {
    return (parts[0] ?? '').slice(0, 2).toUpperCase() || 'U'
  }

  const first = (parts[0] ?? '').slice(0, 1)
  const last = (parts[parts.length - 1] ?? '').slice(0, 1)
  return `${first}${last}`.toUpperCase() || 'U'
})

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/')
}

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

defineExpose({ toggleDrawer })
</script>

<template>
  <v-app>
    <v-layout class="layout-root">
      <v-navigation-drawer
        v-model="drawer"
        :permanent="mdAndUp"
        :temporary="!mdAndUp"
        :width="280"
        class="sidebar"
        elevation="0"
      >
        <div class="sidebar-header">
          <img src="../assets/CSMRLogo.png" alt="CSMR Logo" class="brand-logo" />
          <div class="brand-text">
            <div class="brand-title">CSMR</div>
            <div class="brand-subtitle">Feedback Console</div>
          </div>
        </div>

        <v-divider class="sidebar-divider"></v-divider>

        <v-list class="nav-list" density="compact">
          <v-list-item
            v-for="item in navItems"
            :key="item.id"
            :to="item.to"
            class="nav-item"
            active-class="nav-item-active"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" size="20"></v-icon>
            </template>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="sidebar-footer">
            <v-divider class="sidebar-divider"></v-divider>
            <v-list density="compact">
              <v-list-item class="nav-item">
                <template v-slot:prepend>
                  <v-icon icon="$settings" size="20"></v-icon>
                </template>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-list-item class="nav-item logout-item" @click="handleLogout">
                <template #prepend>
                  <v-icon icon="$logout" size="20"></v-icon>
                </template>
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item>
            </v-list>

            <div class="status-card">
              <div class="status-dot"></div>
              <div class="status-text">
                <div class="status-title">System Online</div>
                <div class="status-subtitle">All services stable</div>
              </div>
            </div>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main class="main-content">
        <div class="main-glow" aria-hidden="true"></div>

        <v-app-bar flat class="header-bar" height="72">
          <div class="header-left">
            <v-app-bar-nav-icon
              class="d-md-none"
              aria-label="Toggle navigation"
              @click="toggleDrawer"
            ></v-app-bar-nav-icon>
            <div class="header-titles">
              <div class="header-title">Dashboard</div>
              <div class="header-subtitle">Welcome back</div>
            </div>
          </div>

          <v-spacer></v-spacer>

          <div class="header-actions">
            <v-btn icon class="icon-btn" aria-label="Notifications">
              <v-icon icon="$bell"></v-icon>
            </v-btn>
            <ToggleTheme />
            <v-avatar class="avatar-badge" size="40">
              <span class="avatar-text">{{ initials }}</span>
            </v-avatar>
          </div>
        </v-app-bar>

        <div class="page-content">
          <slot />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>
