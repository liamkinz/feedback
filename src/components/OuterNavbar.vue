<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const theme = useTheme()

const isDrawerOpen = ref(false)

const isDark = computed(() => theme.global.current.value.dark)

const navLinks = [
  { title: 'Home', path: '/', icon: '$homeOutline' },
  { title: 'Internal', path: '/internal', icon: '$officeBuildingOutline' },
  { title: 'Site Inspection', path: '/site-inspection', icon: '$mapMarkerOutline' },
  { title: 'Final Inspection', path: '/final-inspection', icon: '$clipboardCheckOutline' },
  { title: 'Annual Inspection', path: '/annual-inspection', icon: '$calendarCheckOutline' },
  { title: 'Contact', path: '/contact', icon: '$emailOutline' },
]

const isActive = (path: string) => route.path === path

const navigateTo = (path: string) => {
  router.push(path)
  isDrawerOpen.value = false
}

const handleGetStarted = () => {
  router.push('/auth')
  isDrawerOpen.value = false
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>

<template>
  <!-- Desktop & Mobile App Bar -->
  <v-app-bar
    flat
    height="64"
    :class="['outer-navbar', isDark ? 'outer-navbar--dark' : 'outer-navbar--light']"
  >
    <!-- Mobile Hamburger -->
    <template #prepend>
      <v-btn icon class="hamburger-btn hidden-md-and-up" @click.stop="toggleDrawer">
        <v-icon>{{ isDrawerOpen ? '$close' : '$menu' }}</v-icon>
      </v-btn>
    </template>

    <!-- Brand -->
    <div class="nav-brand" @click="navigateTo('/')">
      <img src="../assets/CSMRLogo.png" alt="CSMR Logo" class="brand-logo" />
      <span class="brand-text">CSMR</span>
    </div>

    <v-spacer />

    <!-- Desktop Links -->
    <nav class="desktop-nav hidden-sm-and-down">
      <button
        v-for="link in navLinks"
        :key="link.title"
        class="nav-link"
        :class="{ 'nav-link--active': isActive(link.path) }"
        @click="navigateTo(link.path)"
      >
        {{ link.title }}
        <span class="nav-link-indicator" />
      </button>
    </nav>

    <v-spacer class="hidden-sm-and-down" />

    <!-- Right Actions -->
    <div class="nav-actions">
      <ThemeToggle />
      <button class="cta-btn hidden-sm-and-down" @click="handleGetStarted">
        Get Started
        <v-icon size="16" class="ml-1">$arrowRight</v-icon>
      </button>
    </div>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer
    v-model="isDrawerOpen"
    temporary
    location="left"
    width="280"
    :class="['mobile-drawer', isDark ? 'mobile-drawer--dark' : 'mobile-drawer--light']"
  >
    <!-- Drawer Header -->
    <div class="drawer-header">
      <div class="nav-brand">
        <img src="../assets/CSMRLogo.png" alt="CSMR Logo" class="brand-logo" />
        <span class="brand-text">CSMR</span>
      </div>
    </div>

    <v-divider class="drawer-divider" />

    <!-- Drawer Links -->
    <nav class="drawer-nav">
      <button
        v-for="link in navLinks"
        :key="link.title"
        class="drawer-link"
        :class="{ 'drawer-link--active': isActive(link.path) }"
        @click="navigateTo(link.path)"
      >
        <v-icon size="18" class="drawer-link-icon">{{ link.icon }}</v-icon>
        <span>{{ link.title }}</span>
        <v-icon size="16" class="drawer-link-arrow">$chevronRight</v-icon>
      </button>
    </nav>

    <!-- Drawer Footer CTA -->
    <template #append>
      <div class="drawer-footer">
        <button variant="outlined" class="drawer-cta-btn" @click="handleGetStarted">
          <v-icon size="18" class="mr-2">$rocketLaunchOutline</v-icon>
          Get Started
        </button>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
/* ── CSS Variables ── */
:root {
  --nav-accent: #4f8ef7;
  --nav-text: rgba(255, 255, 255, 0.85);
  --nav-text-hover: #ffffff;
  --nav-cta-bg: #4f8ef7;
  --nav-cta-mobile-bg: #3ceb99;
  --nav-cta-hover: #3a7ce8;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── App Bar ── */
.outer-navbar {
  transition:
    background 0.35s ease,
    border-color 0.35s ease !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Light mode — vivid cyan-to-blue gradient */
.outer-navbar--light {
  background: linear-gradient(90deg, #21a0d8 0%, #15598e 100%) !important;
  border-bottom: 1px solid rgba(79, 142, 247, 0.2) !important;
}

/* Dark mode — deep navy gradient */
.outer-navbar--dark {
  background: linear-gradient(90deg, #0d1b2a 0%, #21a0d8 100%) !important;
  border-bottom: 1px solid rgba(79, 142, 247, 0.15) !important;
}

/* ── Brand ── */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  transition: background var(--transition);
  text-decoration: none;
}

.nav-brand:hover {
  background: rgba(255, 255, 255, 0.08);
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

.nav-brand:hover .brand-logo {
  filter: drop-shadow(0 0 10px rgba(79, 142, 247, 0.8));
  transform: scale(1.05);
}

.brand-text {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

/* ── Desktop Nav ── */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  position: relative;
  background: none;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff !important;
  cursor: pointer;
  letter-spacing: 0.2px;
  transition:
    color var(--transition),
    background var(--transition);
  white-space: nowrap;
}

.nav-link:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.08);
}

.nav-link--active {
  color: #fff;
  background: rgba(79, 142, 247, 0.18);
}

.nav-link-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: var(--nav-accent);
  border-radius: 2px;
  transition: transform var(--transition);
}

.nav-link--active .nav-link-indicator,
.nav-link:hover .nav-link-indicator {
  transform: translateX(-50%) scaleX(1);
}

/* ── Nav Actions ── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 8px;
}

/* ── CTA Button ── */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--nav-cta-bg);
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.2px;
  transition:
    background var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
  box-shadow: 0 2px 8px rgba(79, 142, 247, 0.35);
}

.cta-btn:hover {
  background: var(--nav-cta-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(79, 142, 247, 0.45);
}

.cta-btn:active {
  transform: translateY(0);
}

/* ── Hamburger ── */
.hamburger-btn {
  color: #fff !important;
}

/* ── Mobile Drawer ── */
.mobile-drawer {
  transition: background 0.35s ease !important;
  border-right: 1px solid rgba(79, 142, 247, 0.15) !important;
}

/* Light mode drawer — matches navbar tone */
.mobile-drawer--light {
  background: linear-gradient(160deg, #5b8b97 0%, #1976d2 100%) !important;
}

/* Dark mode drawer — deep navy */
.mobile-drawer--dark {
  background: linear-gradient(160deg, #0d1b2a 0%, #1a2e5a 100%) !important;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
}

.drawer-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
  margin: 0 16px 8px !important;
}

/* ── Drawer Links ── */
.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 2px;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition:
    background var(--transition),
    color var(--transition);
}

.drawer-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.drawer-link--active {
  background: rgba(79, 142, 247, 0.2);
  color: #fff;
}

.drawer-link-icon {
  color: var(--nav-accent) !important;
  flex-shrink: 0;
}

.drawer-link--active .drawer-link-icon {
  color: #7eb8ff !important;
}

.drawer-link span {
  flex: 1;
}

.drawer-link-arrow {
  color: rgba(255, 255, 255, 0.3) !important;
  transition:
    transform var(--transition),
    color var(--transition) !important;
}

.drawer-link:hover .drawer-link-arrow,
.drawer-link--active .drawer-link-arrow {
  transform: translateX(3px);
  color: rgba(255, 255, 255, 0.7) !important;
}

/* ── Drawer Footer ── */
.drawer-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(21, 224, 129, 0.58);
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition:
    background var(--transition),
    transform var(--transition);
  box-shadow: 0 2px 10px rgba(4, 255, 87, 0.3);
}

.drawer-cta-btn:hover {
  background: rgba(21, 224, 129, 0.75);
  transform: translateY(-1px);
}
</style>
