<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { isOpen, title, message, confirmText, cancelText, resolve } = useConfirmDialog()

// Responsiveness comes from useDisplay(): on a phone the dialog goes near
// full-width and the buttons stack so they stay easy to tap.
const { mobile } = useDisplay()
</script>

<template>
  <v-dialog v-model="isOpen" :max-width="mobile ? 340 : 440" persistent>
    <v-card rounded="xl" class="pa-2">
      <v-card-item class="pt-5">
        <div class="d-flex align-center ga-3">
          <v-avatar color="warning" variant="tonal" rounded="lg" size="44">
            <v-icon icon="mdi-help-circle-outline" size="24" />
          </v-avatar>
          <span class="text-h6 font-weight-bold">{{ title }}</span>
        </div>
      </v-card-item>

      <v-card-text class="text-body-2 text-medium-emphasis" style="white-space: pre-line">
        {{ message }}
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <div class="d-flex ga-2 w-100" :class="mobile ? 'flex-column-reverse' : 'justify-end'">
          <v-btn variant="text" :block="mobile" @click="resolve(false)">
            {{ cancelText }}
          </v-btn>
          <v-btn color="primary" :block="mobile" @click="resolve(true)">
            {{ confirmText }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
