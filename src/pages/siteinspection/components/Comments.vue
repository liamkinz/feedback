<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps<{
  comments: string
}>()

const emit = defineEmits<{
  'update:comments': [value: string]
}>()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const handleCommentsUpdate = (value: string) => {
  emit('update:comments', value)
}
</script>

<template>
  <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
    <v-card-text style="padding: 24px">
      <p class="section-title">
        Palihog ihatag ang inyong mga komento, suhestiyon, o obserbasyon bahin sa inyong kasinati-an
        ug transaksyon sa among opisina. Ang inyong feedback makatabang sa pagpaayo sa among
        serbisyo. (Opsyonal)
      </p>
      <v-textarea
        :model-value="comments"
        @update:model-value="handleCommentsUpdate"
        label="Palihug ibahagi ang inyong dagdag na feedback o komento (Opsyonal)"
        placeholder="I-type ang inyong mga komento dito..."
        hide-details
        rows="5"
        class="modern-input"
        variant="outlined"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.modern-card {
  background: white !important;
  border-radius: 16px !important;
  margin-bottom: 24px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.dark-card {
  background: #2d2d44 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.modern-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
}

.section-title {
  font-size: 20px;
  line-height: 1;
  color: #555;
  margin: 0;
}

.dark-card .section-title {
  color: #ffffff;
}

.modern-input {
  margin-top: 12px;
}

.modern-input :deep(.v-field__input) {
  font-size: 12px;
  color: #555;
  font-family: 'Inter', sans-serif;
}

.dark-card .modern-input :deep(.v-field__input) {
  color: #d0d0d0;
}

.modern-input :deep(.v-label) {
  font-size: 14px !important;
  color: #888 !important;
}

.dark-card .modern-input :deep(.v-label) {
  color: #b0b0b0 !important;
}

.modern-input :deep(.v-field__outline__start),
.modern-input :deep(.v-field__outline__notch),
.modern-input :deep(.v-field__outline__end) {
  border-color: #ddd !important;
}

.dark-card .modern-input :deep(.v-field__outline__start),
.dark-card .modern-input :deep(.v-field__outline__notch),
.dark-card .modern-input :deep(.v-field__outline__end) {
  border-color: #505070 !important;
}

.dark-card .modern-input :deep(.v-field) {
  background-color: #1e1e2e !important;
}

.dark-card .modern-input :deep(.v-field__control) {
  color: #d0d0d0 !important;
}

.dark-card .modern-input :deep(.v-textarea__slot) {
  color: #d0d0d0 !important;
}

.dark-card .modern-input :deep(.v-field__outline) {
  color: #505070 !important;
}

/* Mobile Screens (below 768px) */
@media (max-width: 768px) {
  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .modern-input :deep(.v-field__input) {
    font-size: 14px;
  }
}
</style>
