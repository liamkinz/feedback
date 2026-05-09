<script setup lang="ts">
import { useSiteInspection } from './composables/useSiteInspection'
import { useFeedback } from '@/composables/useFeedback'
import Respondent from './components/Respondent.vue'
import CitizenCharter from './components/CitizenCharter.vue'
import ServiceQuality from './components/ServiceQuality.vue'
import Comments from './components/Comments.vue'
import './Styles/SiteInspectionStyles.css'

const {
  isDark,
  questions,
  ratingQuestions,
  ratingOptions,
  selectedAnswers,
  selectedRatings,
  respondentInfo,
  comments,
  resetForm,
} = useSiteInspection()

const { submitSiteInspection, sync, isSyncing, unsyncedCount, toast } = useFeedback()

const handleSubmit = async () => {
  await submitSiteInspection({
    selectedAnswers: selectedAnswers.value,
    selectedRatings: selectedRatings.value,
    respondentInfo: respondentInfo.value,
    comments: comments.value,
  })
  resetForm()
}
</script>

<template>
  <div :class="['survey-container', { 'survey-container-dark': isDark }]">
    <div class="survey-wrapper">
      <!-- Header -->
      <div class="survey-header">
        <h1 class="survey-title">Customer Satisfaction Survey</h1>
        <p class="survey-subtitle">We value your feedback</p>
      </div>

      <!-- Respondent Component -->
      <Respondent :respondent-info="respondentInfo" />

      <!-- Citizen Charter Component -->
      <CitizenCharter :questions="questions" :selected-answers="selectedAnswers" />

      <!-- Service Quality Component -->
      <ServiceQuality
        :rating-questions="ratingQuestions"
        :rating-options="ratingOptions"
        :selected-ratings="selectedRatings"
      />

      <!-- Comments Component -->
      <Comments v-model:comments="comments" />

      <!-- Submit + Sync Buttons -->
      <div class="submit-container">
        <v-btn color="primary" size="large" class="submit-btn" @click="handleSubmit">
          Submit Feedback
        </v-btn>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <v-snackbar
    v-model="toast.show"
    :color="toast.color"
    :timeout="3000"
    location="top right"
    rounded="lg"
    elevation="4"
  >
    {{ toast.message }}
    <template #actions>
      <v-btn variant="text" @click="toast.show = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.survey-title {
  color: #0f1b2d;
  font-size: 2rem;
  font-weight: 600;
}

.survey-subtitle {
  color: #0f1b2d;
  font-size: 1.125rem;
  margin-top: 4px;
}
</style>
