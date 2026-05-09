<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import type { Question } from '../types/siteinspection.type'

defineProps<{
  questions: Question[]
  selectedAnswers: { [key: string]: string }
}>()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
</script>

<template>
  <div>
    <!-- CC Instructions Card -->
    <v-card class="modern-card info-card" :class="{ 'dark-info-card': isDark }" elevation="0">
      <v-card-text style="padding: 24px">
        <p class="instructions-title">📋 Instructions for Citizen's Charter (CC) Section</p>
        <p class="instructions-text">
          MGA INSTRUKSYON: I-click ang lingin (●) sa imong napili na tubag sa mga pangutana nga naa
          sa Citizen's Charter (CC). Ang Citizen's Charter usa ka opisyal na dokumento nga nagpakita
          sa mga serbisyo sa usa ka ahensya/opisina sa gobyerno lakip ang mga kinahanglanon,
          bayronon, ug oras sa pagproseso niini ug uban pa.
        </p>
      </v-card-text>
    </v-card>

    <!-- CC Questions Card -->
    <v-card
      v-for="question in questions"
      :key="question.id"
      class="modern-card question-card"
      :class="{ 'dark-card': isDark }"
      elevation="0"
    >
      <v-card-text style="padding: 24px">
        <div class="question-number">{{ question.id }}</div>
        <h3 class="question-text">{{ question.text }}</h3>

        <v-radio-group v-model="selectedAnswers[question.id]" :name="`question-${question.id}`">
          <v-radio
            v-for="option in question.options"
            :key="option.id"
            :value="option.id"
            :label="option.label"
            class="modern-radio"
            style="margin-bottom: 16px"
          />
        </v-radio-group>
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

.question-card {
  border-left: 4px solid var(--blue-900) !important;
}

.question-number {
  display: inline-block;
  background: linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%);
  color: var(--blue-0);
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
}

.question-text {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-900);
  margin-bottom: 16px;
  line-height: 1.6;
}

.dark-card .question-text {
  color: var(--blue-0);
}

.modern-radio {
  margin-bottom: 8px !important;
}

.modern-radio :deep(.v-label) {
  font-size: 15px !important;
  color: var(--ink-700) !important;
}

.dark-card .modern-radio :deep(.v-label) {
  color: #d6d6d6 !important;
}

/* Mobile Screens (below 768px) */
@media (max-width: 768px) {
  .question-card {
    border-left: 3px solid var(--blue-900) !important;
  }

  .question-number {
    padding: 3px 8px;
    font-size: 10px;
    margin-bottom: 8px;
  }

  .question-text {
    font-size: 14px;
    margin-bottom: 12px;
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
