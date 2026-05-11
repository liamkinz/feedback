<script setup lang="ts">
import { ref } from 'vue'

const isDrawerOpen = ref(false)

const navLinks = [
  { title: 'Home', href: '/' },
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Internal', href: '/internal' },
  { title: 'Final Inspection', href: '/final-inspection' },
  { title: 'Site Inspection', href: '/site-inspection' },
  { title: 'Annual Inspection', href: '/annual-inspection' },
  { title: 'Contact', href: '#' },
]

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <v-app-bar elevation="1" class="navbar">
    <!-- Mobile Menu Icon -->
    <template #prepend>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="toggleDrawer" />
    </template>

    <!-- Logo/Brand -->
    <div class="navbar-brand">📊 Feedback</div>

    <!-- Desktop Navigation Links -->
    <div class="navbar-links hidden-sm-and-down">
      <v-btn
        v-for="link in navLinks"
        :key="link.title"
        variant="text"
        :href="link.href"
        class="text-none text-white"
      >
        {{ link.title }}
      </v-btn>

      <ThemeToggle />

      <v-btn class="desktop-cta-btn" style="margin-left: 100px" @click="() => {}"
        >Get Started</v-btn
      >
    </div>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer
    v-model="isDrawerOpen"
    temporary
    location="left"
    width="250"
    class="mobile-drawer"
  >
    <v-list class="pa-0">
      <v-list-item
        v-for="link in navLinks"
        :key="link.title"
        :title="link.title"
        :href="link.href"
      />
    </v-list>

    <v-divider class="my-4" />

    <div class="px-4">
      <v-btn block class="drawer-cta-btn" @click="toggleDrawer"> Get Started </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.navbar {
  background: rgb(51, 96, 185) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
}

.navbar-brand {
  font-size: 1.3rem;
  font-weight: 700;
  min-width: 150px;
  margin-left: 100px;
  color: white;
}

.navbar-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex: 1;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.mobile-drawer {
  background: rgb(51, 96, 185) !important;
}

.mobile-drawer :deep(.v-list-item__title) {
  color: white !important;
}

.drawer-cta-btn {
  color: #35b84b !important;
}

.desktop-cta-btn {
  color: white !important;
  border: 2px solid white;
  font-weight: 600;
}

.desktop-cta-btn:hover {
  background-color: rgba(29, 150, 166, 0.1) !important;
}
</style>
