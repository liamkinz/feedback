<script setup lang="ts">
import OuterNavbar from '@/components/OuterNavbar.vue'
import Footer from '@/components/FooterSection.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout-wrapper">
    <OuterNavbar />
    <v-main class="main-content">
      <RouterView />
    </v-main>
    <Footer />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1 1 auto;
  width: 100%;
}
</style>
