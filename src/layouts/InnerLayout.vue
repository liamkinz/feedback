<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, RouterView } from 'vue-router'
import ToggleTheme from '../components/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.signOut()
  router.push('/')
}

type NavItem = {
  id: number
  label: string
  icon: string
  to: string
}

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
</script>

<template>
  <v-app>
    <v-layout class="layout-root">
      <!-- Sidebar Navigation -->
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

      <!-- Main Content -->
      <v-main class="main-content">
        <div class="main-glow" aria-hidden="true"></div>

        <!-- Header -->
        <v-app-bar flat class="header-bar" height="72">
          <div class="header-left">
            <v-app-bar-nav-icon
              v-if="!mdAndUp"
              aria-label="Toggle navigation"
              @click="drawer = !drawer"
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

        <!-- Page Content -->
        <div class="page-content">
          <RouterView />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.layout-root {
  --ink-900: #0b0f14;
  --ink-700: #303640;
  --ink-500: #6c737f;
  --line: #e6e9ee;
  --brand-600: #0a7c7b;
  --brand-500: #0ea5a4;
  --brand-200: #a6e8e7;
  --surface: #f7f8fb;
  font-family: 'Space Grotesk', 'Trebuchet MS', sans-serif;
}

.sidebar {
  position: relative;
  background: linear-gradient(160deg, #ffffff 0%, #f1f5f9 70%);
  border-right: 1px solid var(--line);
  box-shadow: 0 30px 80px rgba(18, 24, 38, 0.08);
  overflow: hidden;
}

.sidebar::after {
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(14, 165, 164, 0.18), transparent 70%);
  pointer-events: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.4rem 1.4rem 1rem;
}

.brand-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 0 6px rgba(79, 142, 247, 0.5));
  transition:
    filter var(--transition),
    transform var(--transition);
}

.logout-item {
  cursor: pointer;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: 0.04em;
}

.brand-subtitle {
  font-size: 0.8rem;
  color: var(--ink-500);
  font-weight: 500;
}

.sidebar-divider {
  margin: 0.2rem 1.4rem 1rem;
}

.nav-list {
  padding: 0 0.8rem 0.6rem;
}

.nav-item {
  border-radius: 12px;
  margin: 0.35rem 0.4rem;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(14, 165, 164, 0.08);
  transform: translateX(6px);
  box-shadow: 0 8px 18px rgba(14, 165, 164, 0.12);
}

.nav-item-active {
  background: linear-gradient(135deg, rgba(14, 165, 164, 0.18) 0%, rgba(14, 165, 164, 0.06) 100%);
  color: var(--brand-600);
  font-weight: 600;
}

.sidebar-footer {
  padding: 0 0.8rem 1.2rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1rem;
  margin: 0.8rem 0.4rem 0;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(14, 165, 164, 0.12);
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15);
}

.status-title {
  font-weight: 600;
  color: var(--ink-900);
  font-size: 0.85rem;
}

.status-subtitle {
  font-size: 0.75rem;
  color: var(--ink-500);
}

.main-content {
  position: relative;
  background: var(--surface);
}

.main-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 10%, rgba(14, 165, 164, 0.12), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(14, 165, 164, 0.08), transparent 45%);
  pointer-events: none;
}

.header-bar {
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-left: 0.6rem;
}

.header-titles {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.header-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink-900);
}

.header-subtitle {
  font-size: 0.82rem;
  color: var(--ink-500);
}

.search-field {
  max-width: 360px;
  min-width: 220px;
  margin-right: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-right: 1.2rem;
}

.icon-btn {
  color: var(--ink-700);
}

.avatar-badge {
  background: linear-gradient(135deg, #111827 0%, #334155 100%);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
}

.avatar-text {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
}

.page-content {
  position: relative;
  z-index: 1;
  padding: 1.4rem 1.6rem 2rem;
}

@media (max-width: 960px) {
  .search-field {
    max-width: 220px;
    margin-right: 0.4rem;
  }

  .header-subtitle {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-bar {
    padding-right: 0.4rem;
  }

  .search-field {
    display: none;
  }
}
</style>
