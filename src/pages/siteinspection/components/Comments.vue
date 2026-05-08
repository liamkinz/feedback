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
  background: var(--blue-0) !important;
  border-radius: 16px !important;
  margin-bottom: 24px !important;
  box-shadow: 0 6px 18px rgba(0, 86, 210, 0.12) !important;
  border: 1px solid var(--blue-200) !important;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.dark-card {
  background: var(--card-dark) !important;
  border: 1px solid var(--card-dark-border) !important;
}

.modern-card:hover {
  box-shadow: 0 10px 28px rgba(0, 86, 210, 0.2) !important;
  transform: translateY(-2px);
}

.section-title {
  font-size: 20px;
  line-height: 1;
  color: var(--ink-700);
  margin: 0;
}

.dark-card .section-title {
  color: var(--blue-0);
}

.modern-input {
  margin-top: 12px;
}

.modern-input :deep(.v-field__input) {
  font-size: 12px;
  color: var(--ink-700);
  font-family: 'Inter', sans-serif;
}

.dark-card .modern-input :deep(.v-field__input) {
  color: #634646;
}

.modern-input :deep(.v-label) {
  font-size: 14px !important;
  color: var(--ink-700) !important;
}

.dark-card .modern-input :deep(.v-label) {
  color: #ffffff !important;
}

.modern-input :deep(.v-field__outline__start),
.modern-input :deep(.v-field__outline__notch),
.modern-input :deep(.v-field__outline__end) {
  border-color: #a8f1ff !important;
}

.modern-input :deep(.v-field__outline) {
  color: #67bfd0 !important;
}

.modern-input :deep(.v-field) {
  background-color: #b9dae6 !important;
}

.dark-card .modern-input :deep(.v-field__outline__start),
.dark-card .modern-input :deep(.v-field__outline__notch),
.dark-card .modern-input :deep(.v-field__outline__end) {
  border-color: #a8f1ff !important;
}

.dark-card .modern-input :deep(.v-field) {
  background-color: #2d2e30 !important;
}

.dark-card .modern-input :deep(.v-field__control) {
  color: #d6d6d6 !important;
}

.dark-card .modern-input :deep(.v-textarea__slot) {
  color: #d6d6d6 !important;
}

.dark-card .modern-input :deep(.v-field__outline) {
  color: #a8f1ff !important;
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
