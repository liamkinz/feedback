<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  initials: string
  previewUrl: string | null
  fileName: string | null
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', file: File): void
  (e: 'clear'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function openPicker() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) emit('select', file)
  input.value = ''
}
</script>

<template>
  <div class="d-flex align-center ga-5 flex-wrap">
    <div class="avatar-frame" @click="openPicker">
      <v-avatar size="88" color="primary" variant="tonal">
        <v-img v-if="previewUrl" :src="previewUrl" alt="Avatar preview" cover />
        <span v-else class="text-h5 font-weight-bold">{{ initials }}</span>
      </v-avatar>
      <div class="avatar-overlay">
        <v-icon icon="mdi-camera-outline" size="20" color="white" />
      </div>
    </div>

    <div class="flex-grow-1">
      <div class="d-flex ga-2 flex-wrap mb-2">
        <v-btn
          size="small"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-tray-arrow-up"
          :disabled="disabled"
          @click="openPicker"
        >
          Upload photo
        </v-btn>
        <v-btn
          v-if="previewUrl"
          size="small"
          variant="text"
          :disabled="disabled"
          @click="emit('clear')"
        >
          Remove
        </v-btn>
      </div>

      <p class="text-caption text-medium-emphasis mb-0">
        <template v-if="fileName"> {{ fileName }} — preview only, not uploaded yet. </template>
        <template v-else> PNG or JPG, up to 2 MB. </template>
      </p>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
  </div>
</template>

<style scoped>
.avatar-frame {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  line-height: 0;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.avatar-frame:hover .avatar-overlay,
.avatar-frame:focus-visible .avatar-overlay {
  opacity: 1;
}
</style>
