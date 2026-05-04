<script setup lang="ts">
import { useSiteInspection } from './composables/useSiteInspection'

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
</script>
</script>

<template>
  <div :class="['survey-container', { 'survey-container-dark': isDark }]">
    <div class="survey-wrapper">
      <!-- Header -->
      <div class="survey-header">
        <h1 class="survey-title">Customer Satisfaction Survey</h1>
        <p class="survey-subtitle">We value your feedback</p>
      </div>

      <!-- Client Satisfaction Measurement Card -->
      <v-card class="modern-card" elevation="0">
        <v-card-text style="padding: 32px">
          <p class="description-text">
            Ang Client Satisfaction Measurement (CSM) nagsubay sa kasinatian sa customer sa mga
            opisina sa gobyerno. Ang imong feedback sa bag-o lang nahuman nga transaksyon sa opisina
            makatabang kini nga makahatag og mas maayong serbisyo. Ang personal nga impormasyon nga
            gipaambit itago nga kompidensyal ug kanunay kang adunay kapilian kung dili nimu buot
            tubagon ang pangutana.
          </p>
        </v-card-text>
      </v-card>

      <!-- Respondent Information Card -->
      <v-card class="modern-card" elevation="0">
        <v-card-text style="padding: 24px; padding-md: 32px">
          <h2 class="section-title">Respondent Information</h2>

          <!-- Client Type -->
          <div style="margin-bottom: 28px">
            <p class="field-label">Client Type</p>
            <div class="flex-wrap-responsive">
              <v-checkbox
                v-model="respondentInfo.clientType"
                value="Citizen"
                label="Citizen"
                hide-details
                class="modern-checkbox"
              />
              <v-checkbox
                v-model="respondentInfo.clientType"
                value="Business"
                label="Business"
                hide-details
                class="modern-checkbox"
              />
              <v-checkbox
                v-model="respondentInfo.clientType"
                value="Government"
                label="Government (Employee or another agency)"
                hide-details
                class="modern-checkbox"
              />
            </div>
          </div>

          <!-- Date, Sex, Age, Contact -->
          <div class="responsive-grid">
            <v-text-field
              v-model="respondentInfo.date"
              label="Date (Petsa)"
              type="date"
              hide-details
              class="modern-input"
              variant="outlined"
            />
            <div>
              <p class="field-label">Sex</p>
              <div class="flex-wrap-responsive">
                <v-checkbox
                  v-model="respondentInfo.sex"
                  value="Male"
                  label="Male"
                  hide-details
                  class="modern-checkbox"
                />
                <v-checkbox
                  v-model="respondentInfo.sex"
                  value="Female"
                  label="Female"
                  hide-details
                  class="modern-checkbox"
                />
              </div>
            </div>
          </div>

          <!-- Age and Contact -->
          <div class="responsive-grid" style="margin-top: 16px">
            <v-text-field
              v-model="respondentInfo.age"
              label="Age (Edad)"
              type="number"
              hide-details
              class="modern-input"
              variant="outlined"
            />
            <v-text-field
              v-model="respondentInfo.contactNumber"
              label="Contact Number (Optional)"
              hide-details
              class="modern-input"
              variant="outlined"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- Number of Site Inspections -->
      <v-card class="modern-card" elevation="0">
        <v-card-text style="padding: 24px; padding-md: 32px">
          <h3 class="section-title">Number of Site Inspections</h3>
          <v-text-field
            v-model="respondentInfo.siteInspections"
            label="Number of Site Inspections"
            type="number"
            hide-details
            class="modern-input"
            variant="outlined"
          />
        </v-card-text>
      </v-card>

      <!-- CC Instructions Card -->
      <v-card class="modern-card info-card" elevation="0">
        <v-card-text style="padding: 24px; padding-md: 32px">
          <p class="instructions-title">📋 Instructions for Citizen's Charter (CC) Section</p>
          <p class="instructions-text">
            MGA INSTRUKSYON: I-click ang lingin (●) sa imong napili na tubag sa mga pangutana nga
            naa sa Citizen's Charter (CC). Ang Citizen's Charter usa ka opisyal na dokumento nga
            nagpakita sa mga serbisyo sa usa ka ahensya/opisina sa gobyerno lakip ang mga
            kinahanglanon, bayronon, ug oras sa pagproseso niini ug uban pa.
          </p>
        </v-card-text>
      </v-card>

      <!-- CC Questions Card -->
      <v-card
        v-for="question in questions"
        :key="question.id"
        class="modern-card question-card"
        elevation="0"
      >
        <v-card-text style="padding: 24px; padding-md: 32px">
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

      <!-- Service Quality Dimensions Instructions -->
      <v-card class="modern-card info-card" elevation="0">
        <v-card-text style="padding: 24px; padding-md: 32px">
          <p class="instructions-title">📋 Instructions for Service Quality Dimensions</p>
          <p class="instructions-text">
            INSTRUCTIONS: Para sa SQD 0-8, palihug I-rate ang mosunod pinaagi sa pagpili I-click ang
            lingin (●) sa column nga tukma sa imung tubag.
          </p>
        </v-card-text>
      </v-card>

      <!-- Service Quality Dimensions Card -->
      <v-card class="modern-card" elevation="0">
        <v-card-text style="padding: 24px; padding-md: 32px">
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

      <!-- Comments Card -->
      <v-card class="modern-card" elevation="0">
        <v-card-text style="padding: 24px; padding-md: 32px">
          <h3 class="section-title">
            Palihog ihatag ang inyong mga komento, suhestiyon, o obserbasyon bahin sa inyong
            kasinati-an ug transaksyon sa among opisina. Ang inyong feedback makatabang sa pagpaayo
            sa among serbisyo.
          </h3>
          <v-textarea
            v-model="comments"
            label="Palihug ibahagi ang inyong dagdag na feedback o komento (Opsyonal)"
            placeholder="I-type ang inyong mga komento dito..."
            hide-details
            rows="5"
            class="modern-input"
            variant="outlined"
          />
        </v-card-text>
      </v-card>

      <!-- Submit Button -->
      <div class="submit-container">
        <v-btn color="primary" size="large" class="submit-btn"> Submit Feedback </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.survey-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 24px 12px;
  font-family: 'Inter', sans-serif;
  transition: background 0.3s ease;
}

.survey-container-dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.survey-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.survey-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.survey-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.survey-subtitle {
  font-size: 14px;
  font-weight: 300;
  opacity: 0.95;
}

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

.survey-container-dark .modern-card {
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

.survey-container-dark .info-card {
  background: linear-gradient(135deg, #3a3a5c 0%, #393a5c 100%) !important;
  border: 1px solid rgba(102, 126, 234, 0.2) !important;
}

.description-text {
  font-size: 20px;
  line-height: 1.8;
  color: #444;
  margin: 0;
}

.survey-container-dark .description-text {
  color: #e0e0e0;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.survey-container-dark .section-title {
  color: #ffffff;
}

.mb-8 {
  margin-bottom: 32px;
}

.field-label {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.survey-container-dark .field-label {
  color: #b0b0b0;
}

.instructions-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 12px;
}

.survey-container-dark .instructions-title {
  color: #90caf9;
}

.instructions-text {
  font-size: 20px;
  line-height: 1.7;
  color: #555;
  margin: 0;
}

.survey-container-dark .instructions-text {
  color: #d0d0d0;
}

.question-card {
  border-left: 4px solid #667eea !important;
}

.question-number {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  color: #1a1a1a;
  margin-bottom: 16px;
  line-height: 1.6;
}

.survey-container-dark .question-text {
  color: #ffffff;
}

.modern-radio {
  margin-bottom: 8px !important;
}

.modern-radio :deep(.v-label) {
  font-size: 15px !important;
  color: #555 !important;
}

.survey-container-dark .modern-radio :deep(.v-label) {
  color: #d0d0d0 !important;
}

.modern-input {
  font-size: 14px;
}

.modern-input :deep(.v-field__input) {
  font-size: 14px;
}

.modern-checkbox :deep(.v-label) {
  font-size: 15px !important;
  color: #555 !important;
}

.survey-container-dark .modern-checkbox :deep(.v-label) {
  color: #d0d0d0 !important;
}

.sqd-item {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.survey-container-dark .sqd-item {
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

.survey-container-dark .sqd-text {
  color: #d0d0d0;
}

.rating-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 32px;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.submit-btn {
  font-family: 'Poppins', sans-serif !important;
  font-weight: 600 !important;
  padding: 12px 40px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-size: 15px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5) !important;
}

.flex-wrap-responsive {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.responsive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* Tablet Screens (768px - 1024px) */
@media (max-width: 1024px) {
  .survey-container {
    padding: 20px 10px;
  }

  .survey-title {
    font-size: 32px;
  }

  .survey-subtitle {
    font-size: 16px;
  }

  .responsive-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .rating-group {
    margin-left: 28px;
  }
}

/* Mobile Screens (below 768px) */
@media (max-width: 768px) {
  .survey-container {
    padding: 16px 8px;
  }

  .survey-wrapper {
    padding: 0 4px;
  }

  .survey-header {
    margin-bottom: 24px;
  }

  .survey-title {
    font-size: 24px;
    margin-bottom: 6px;
  }

  .survey-subtitle {
    font-size: 13px;
  }

  .modern-card {
    border-radius: 12px !important;
    margin-bottom: 16px !important;
  }

  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .field-label {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .instructions-title {
    font-size: 14px;
  }

  .instructions-text {
    font-size: 14px;
  }

  .question-card {
    border-left: 3px solid #667eea !important;
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

  .modern-checkbox :deep(.v-label) {
    font-size: 13px !important;
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

  .submit-container {
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .submit-btn {
    padding: 10px 32px !important;
    font-size: 14px !important;
  }

  .flex-wrap-responsive {
    gap: 12px;
  }

  .responsive-grid {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 16px;
  }
}

/* Extra Small Screens (below 480px) */
@media (max-width: 480px) {
  .survey-title {
    font-size: 20px;
  }

  .modern-card {
    margin-bottom: 12px !important;
  }

  .survey-header {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 15px;
  }

  .submit-btn {
    padding: 8px 24px !important;
    font-size: 13px !important;
  }
}
</style>
