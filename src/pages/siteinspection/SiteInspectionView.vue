<script setup lang="ts">
import { useSiteInspection } from './composables/useSiteInspection'
import Respondent from './components/Respondent.vue'
import CitizenCharter from './components/CitizenCharter.vue'
import ServiceQuality from './components/ServiceQuality.vue'
import Comments from './components/Comments.vue'
import './Styles/SiteInspectionStyles.css'
import { useFeedback } from '../../db/composables/useFeedback'

const {
  isDark,
  questions,
  ratingQuestions,
  ratingOptions,
  selectedAnswers,
  selectedRatings,
  respondentInfo,
  comments,
} = useSiteInspection()

const { submitSiteInspection } = useFeedback()

const handleSubmit = async () => {
  try {
    await submitSiteInspection({
      selectedAnswers: selectedAnswers.value,
      selectedRatings: selectedRatings.value,
      respondentInfo: respondentInfo.value,
      comments: comments.value,
    })
    alert('Feedback submitted successfully!')

    // Optional: Reset form fields here if needed
    // selectedAnswers.value = {}
    // selectedRatings.value = {}
    // respondentInfo.value = { clientType: '', date: '', sex: '', age: '', contactNumber: '', siteInspections: '' }
    // comments.value = ''
  } catch (error) {
    alert('Failed to submit feedback. Check console for details.')
  }
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

      <!-- Submit Button -->
      <div class="submit-container">
        <v-btn color="primary" size="large" class="submit-btn" @click="handleSubmit">
          Submit Feedback
        </v-btn>
      </div>
    </div>
  </div>
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
