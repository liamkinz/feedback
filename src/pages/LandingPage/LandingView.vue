<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <template #content>
      <HeroSection />
    </template>
  </PublicLayout>
</template>
