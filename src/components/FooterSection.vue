<script setup lang="ts">
// const links: string[] = ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us']
</script>

<template>
  <v-footer
    class="d-flex align-center justify-center ga-2 flex-wrap"
    color="#2FA8E0"
    style="padding: 12px; flex: 0 0 auto"
  >
    <!-- <v-btn v-for="link in links" :key="link" :text="link" variant="text" rounded></v-btn> -->

    <div class="flex-1-0-100 text-center mt-2">
      {{ new Date().getFullYear() }} — <strong>CSMR</strong>
    </div>
  </v-footer>
</template>
