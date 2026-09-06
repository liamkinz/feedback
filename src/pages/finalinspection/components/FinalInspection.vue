<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/useTheme'
import { useFinalInspection } from '../composables/useFinalInspection'
import { useFeedback } from '@/composables/useFeedback'
import FormLayout from '@/layouts/FormLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'

const { isDark } = storeToRefs(useTheme())

const {
  questions,
  ratingQuestions,
  ratingOptions,
  respondentInfo,
  selectedAnswers,
  selectedRatings,
  comments,
  resetForm,
} = useFinalInspection()

const { submitFinalInspection } = useFeedback()

const handleSubmit = async () => {
  await submitFinalInspection({
    selectedAnswers: selectedAnswers.value,
    selectedRatings: selectedRatings.value,
    respondentInfo: respondentInfo.value,
    comments: comments.value,
  })
  resetForm()
}
</script>

<template>
  <PublicLayout>
    <template #content>
      <FormLayout>
        <div class="csmr-inspection-form">
          <!-- Header -->
          <v-card class="modern-card header-card" :class="{ 'dark-card': isDark }" elevation="0">
            <v-card-text style="padding: 32px">
              <h1 class="form-title">Final Inspection Feedback Form</h1>
              <p class="form-subtitle">
                Salamat sa inyong pagbisita. Ang inyong feedback ay mahalaga sa amin upang mapabuti
                pa ang aming serbisyo.
              </p>
            </v-card-text>
          </v-card>

          <!-- SECTION 1: RESPONDENT INFORMATION -->
          <div class="form-section">
            <!-- Client Satisfaction Measurement Card -->
            <v-card class="modern-card csm-card" :class="{ 'dark-card': isDark }" elevation="0">
              <v-card-text style="padding: 32px">
                <p class="description-text">
                  Ang Client Satisfaction Measurement (CSM) nagsubay sa kasinatian sa customer sa
                  mga opisina sa gobyerno. Ang imong feedback sa bag-o lang nahuman na transaksyon
                  sa opisina makatabang kini nga makahatag og mas maayong serbisyo. Ang personal na
                  impormasyon na gipaambit itago na kompidensyal ug kanunay kang adunay kapilian
                  kung dili nimu buot tubagon ang pangutana.
                </p>
              </v-card-text>
            </v-card>

            <!-- Respondent Information Card -->
            <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
              <v-card-text style="padding: 24px">
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

            <!-- Number of Final Inspections -->
            <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
              <v-card-text style="padding: 24px">
                <h3 class="section-title">Number of Final Inspections</h3>
                <v-text-field
                  v-model="respondentInfo.finalInspection"
                  label="Number of Final Inspections"
                  type="number"
                  hide-details
                  class="modern-input"
                  variant="outlined"
                />
              </v-card-text>
            </v-card>
          </div>

          <!-- SECTION 2: CITIZEN'S CHARTER -->
          <div class="form-section">
            <!-- CC Instructions Card -->
            <v-card
              class="modern-card info-card"
              :class="{ 'dark-info-card': isDark }"
              elevation="0"
            >
              <v-card-text style="padding: 24px">
                <p class="instructions-title">📋 Instructions for Citizen's Charter (CC) Section</p>
                <p class="instructions-text">
                  MGA INSTRUKSYON: I-click ang lingin (●) sa imong napili na tubag sa mga pangutana
                  nga naa sa Citizen's Charter (CC). Ang Citizen's Charter usa ka opisyal na
                  dokumento nga nagpakita sa mga serbisyo sa usa ka ahensya/opisina sa gobyerno
                  lakip ang mga kinahanglanon, bayronon, ug oras sa pagproseso niini ug uban pa.
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

                <v-radio-group
                  v-model="selectedAnswers[question.id]"
                  :name="`question-${question.id}`"
                >
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

          <!-- SECTION 3: SERVICE QUALITY DIMENSIONS -->
          <div class="form-section">
            <!-- Service Quality Dimensions Instructions -->
            <v-card
              class="modern-card info-card"
              :class="{ 'dark-info-card': isDark }"
              elevation="0"
            >
              <v-card-text style="padding: 24px">
                <p class="instructions-title">📋 Instructions for Service Quality Dimensions</p>
                <p class="instructions-text">
                  INSTRUCTIONS: Para sa SQD 0-8, palihug I-rate ang mosunod pinaagi sa pagpili
                  I-click ang lingin (●) sa column nga tukma sa imung tubag.
                </p>
              </v-card-text>
            </v-card>

            <!-- Service Quality Dimensions Card -->
            <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
              <v-card-text style="padding: 24px">
                <h2 class="section-title mb-8">Service Quality Dimensions (SQD)</h2>

                <div
                  v-for="(question, index) in ratingQuestions"
                  :key="question.id"
                  class="sqd-item"
                >
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

          <!-- SECTION 4: COMMENTS -->
          <div class="form-section">
            <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
              <v-card-text style="padding: 24px">
                <p class="section-title">Additional Comments</p>
                <p class="comments-description">
                  Palihog ihatag ang inyong mga komento, suhestiyon, o obserbasyon bahin sa inyong
                  kasinatian ug transaksyon sa among opisina. Ang inyong feedback makatabang sa
                  pagpaayo sa among serbisyo. (Opsyonal)
                </p>
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
          </div>

          <!-- Submit Button -->
          <div class="form-section submit-section">
            <v-btn
              @click="handleSubmit"
              size="large"
              class="submit-button"
              color="primary"
              rounded="lg"
            >
              Submit Feedback
            </v-btn>
          </div>

          <!-- Toast Notification -->
          <!-- <v-snackbar
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
      </v-snackbar> -->
        </div>
      </FormLayout>
    </template>
  </PublicLayout>
</template>
