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

          <v-radio-group
            v-model="selectedRatings[question.id]"
            :name="`rating-${question.id}`"
            class="rating-group"
          >
            <v-radio
              v-for="option in ratingOptions"
              :key="option.id"
              :value="option.id"
              :label="option.label"
              class="modern-radio"
            />
          </v-radio-group>
        </div>
      </v-card-text>
    </v-card>
  </div>
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

.info-card {
  background: linear-gradient(135deg, #f5f7ff 0%, #f8f5ff 100%) !important;
  border: 1px solid #e8e5f5 !important;
}

.dark-info-card {
  background: linear-gradient(135deg, #3a3a5c 0%, #393a5c 100%) !important;
  border: 1px solid rgba(102, 126, 234, 0.2) !important;
}

.instructions-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 12px;
}

.dark-info-card .instructions-title {
  color: #90caf9;
}

.instructions-text {
  font-size: 20px;
  line-height: 1.7;
  color: #555;
  margin: 0;
}

.dark-info-card .instructions-text {
  color: #d0d0d0;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.dark-card .section-title {
  color: #ffffff;
}

.mb-8 {
  margin-bottom: 32px;
}

.sqd-item {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.dark-card .sqd-item {
  border-bottom: 1px solid #404050;
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
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 11px;
  flex-shrink: 0;
  font-family: 'Poppins', sans-serif;
}

.sqd-text {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  font-weight: 500;
}

.dark-card .sqd-text {
  color: #d0d0d0;
}

.rating-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 32px;
}

.modern-radio {
  margin-bottom: 8px !important;
}

.modern-radio :deep(.v-label) {
  font-size: 15px !important;
  color: #555 !important;
}

.dark-card .modern-radio :deep(.v-label) {
  color: #d0d0d0 !important;
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

  .modern-radio :deep(.v-label) {
    font-size: 13px !important;
  }

  .instructions-title {
    font-size: 14px;
  }

  .instructions-text {
    font-size: 14px;
  }
}
</style>
