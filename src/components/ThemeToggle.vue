<template>
  <v-btn
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    :color="color"
    :variant="variant"
    :size="size"
    @click="toggleTheme"
  >
    <span class="toggle-emoji" :class="{ 'spin-icon': isToggling }">{{ icon }}</span>
  </v-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useThemeToggle } from '@/components/composables/useThemeToggle'

interface Props {
  color?: string
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}

withDefaults(defineProps<Props>(), {
  color: 'default',
  variant: 'text',
  size: 'default',
})

const { isDark, toggleTheme: originalToggleTheme } = useThemeToggle()
const isToggling = ref(false)

const icon = computed<string>(() => (isDark.value ? '☀️' : '🌙'))

const toggleTheme = async () => {
  isToggling.value = true
  originalToggleTheme()

  setTimeout(() => {
    isToggling.value = false
  }, 600)
}
</script>

<style scoped>
.spin-icon {
  animation: spin-rotate 0.6s ease-in-out;
  display: inline-block;
}

.toggle-emoji {
  font-size: 18px;
  line-height: 1;
}

@keyframes spin-rotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.9);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
</style>
