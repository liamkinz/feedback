<script setup lang="ts">
import OuterNavbar from '@/components/OuterNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <!-- Left: Form Panel -->
    <div class="auth-left">
      <RouterView />
    </div>

    <!-- Right: Image Panel -->
    <div class="auth-right">
      <img src="@/assets/CSMRBackgroundPic.png" alt="Background" class="auth-bg-image" />
      <div class="auth-right-overlay" />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.auth-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45%;
  min-height: 100vh;
  padding: 2rem;
}

.dark-auth-left {
  background: linear-gradient(160deg, #5b8b97 0%, #1976d2 100%) !important;
}

.auth-right {
  position: relative;
  width: 55%;
  min-height: 100vh;
  overflow: hidden;
}

.auth-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.auth-right-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(28, 28, 30, 0.4) 0%, transparent 60%);
}

@media (max-width: 768px) {
  .auth-layout {
    flex-direction: column;
  }
  .auth-left {
    width: 100%;
    min-height: 100vh;
  }
  .auth-right {
    display: none;
  }
}
</style>
