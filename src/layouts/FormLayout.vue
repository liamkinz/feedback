<script setup lang="ts">
import backgroundImage from '@/assets/CSMRBackgroundPic.png'
</script>

<template>
  <section class="form-background" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="form-content">
      <slot />
    </div>
  </section>
</template>
