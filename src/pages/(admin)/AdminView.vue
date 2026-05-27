<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.signOut()
  router.push('/')
}
</script>

<template>
  <button class="btn" @click="handleLogout">Sign Out</button>
</template>
