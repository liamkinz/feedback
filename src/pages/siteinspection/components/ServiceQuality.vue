<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import type { RatingQuestion, RatingOption } from '../types/siteinspections.type'

defineProps<{
  ratingQuestions: RatingQuestion[]
  ratingOptions: RatingOption[]
  selectedRatings: { [key: string]: string }
}>()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
</script>

<template>
  <div>
    <!-- Service Quality Dimensions Instructions -->
    <v-card class="modern-card info-card" :class="{ 'dark-info-card': isDark }" elevation="0">
      <v-card-text style="padding: 24px">
        <p class="instructions-title">📋 Instructions for Service Quality Dimensions</p>
        <p class="instructions-text">
          INSTRUCTIONS: Para sa SQD 0-8, palihug I-rate ang mosunod pinaagi sa pagpili I-click ang
          lingin (●) sa column nga tukma sa imung tubag.
        </p>
      </v-card-text>
    </v-card>

    <!-- Service Quality Dimensions Card -->
    <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
      <v-card-text style="padding: 24px">
        <h2 class="section-title mb-8">Service Quality Dimensions (SQD)</h2>

        <div v-for="(question, index) in ratingQuestions" :key="question.id" class="sqd-item">
          <div class="sqd-question">
            <span class="sqd-number">{{ index + 1 }}</span>
            <span class="sqd-text">{{ question.id }}: {{ question.text }}</span>
          </div>

          <v-select
            v-model="selectedRatings[question.id]"
            :items="ratingOptions"
            item-title="label"
            item-value="id"
            label="Select rating"
            class="modern-select"
            variant="outlined"
            hide-details
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
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

.info-card {
  background: linear-gradient(135deg, var(--blue-100) 0%, var(--blue-200) 100%) !important;
  border: 1px solid var(--blue-200) !important;
}

.dark-info-card {
  background: linear-gradient(135deg, #111111 0%, #1b1b1b 100%) !important;
  border: 1px solid var(--card-dark-border) !important;
}

.instructions-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--blue-900);
  margin-bottom: 12px;
}

.dark-info-card .instructions-title {
  color: var(--blue-0);
}

.instructions-text {
  font-size: 20px;
  line-height: 1.7;
  color: var(--ink-700);
  margin: 0;
}

.dark-info-card .instructions-text {
  color: #d6d6d6;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--ink-900);
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.dark-card .section-title {
  color: var(--blue-0);
}

.mb-8 {
  margin-bottom: 32px;
}

.sqd-item {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--blue-200);
}

.dark-card .sqd-item {
  border-bottom: 1px solid var(--card-dark-border);
}

.sqd-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.sqd-question {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.sqd-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  background: linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%);
  color: var(--blue-0);
  border-radius: 50%;
  font-weight: 600;
  font-size: 11px;
  flex-shrink: 0;
  font-family: 'Poppins', sans-serif;
}

.sqd-text {
  font-size: 16px;
  color: var(--ink-700);
  line-height: 1.6;
  font-weight: 500;
}

.dark-card .sqd-text {
  color: #d6d6d6;
}

.modern-select {
  margin-left: 32px;
  width: calc(100% - 32px);
}

.modern-select :deep(.v-label) {
  color: var(--ink-700) !important;
}

.modern-select :deep(.v-field__input) {
  color: var(--ink-700) !important;
}

.dark-card .modern-select :deep(.v-label),
.dark-card .modern-select :deep(.v-field__input) {
  color: #d6d6d6 !important;
}

/* Mobile Screens (below 768px) */
@media (max-width: 768px) {
  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .sqd-item {
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .sqd-question {
    gap: 8px;
    margin-bottom: 12px;
  }

  .sqd-number {
    min-width: 20px;
    height: 20px;
    font-size: 10px;
  }

  .sqd-text {
    font-size: 15px;
  }

  .rating-group {
    margin-left: 24px;
    gap: 8px;
  }

  .modern-select {
    margin-left: 24px;
    width: calc(100% - 24px);
  }

  .instructions-title {
    font-size: 14px;
  }

  .instructions-text {
    font-size: 14px;
  }
}
</style>
