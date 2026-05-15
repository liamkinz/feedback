<script setup lang="ts">
import OuterNavbar from '@/components/OuterNavbar.vue'
import Footer from '@/components/FooterSection.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout-wrapper">
    <OuterNavbar />
    <v-main class="main-content">
      <div class="router-wrapper">
        <RouterView />
      </div>
    </v-main>
    <Footer />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
}

.main-content {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Force Vuetify's internal wrapper to also stretch */
.main-content :deep(.v-main__wrap) {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  height: 100%;
}

.router-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  height: 100%;
}
</style>
