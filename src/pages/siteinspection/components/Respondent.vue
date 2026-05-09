<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import type { RespondentInfo } from '../types/siteinspection.type'

const props = defineProps<{
  respondentInfo: RespondentInfo
}>()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
</script>

<template>
  <div>
    <!-- Client Satisfaction Measurement Card -->
    <v-card class="modern-card csm-card" :class="{ 'dark-card': isDark }" elevation="0">
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

    <!-- Number of Site Inspections -->
    <v-card class="modern-card" :class="{ 'dark-card': isDark }" elevation="0">
      <v-card-text style="padding: 24px">
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
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

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
  background: #2c3947 !important;
  border: 1px solid #2c3947 !important;
}

.csm-card {
  background: linear-gradient(135deg, var(--blue-100) 0%, var(--blue-200) 100%) !important;
  border: 1px solid var(--blue-200) !important;
}

.csm-card.dark-card {
  background: #000000 !important;
  border: 1px solid #000000 !important;
}

.modern-card:hover {
  box-shadow: 0 10px 28px rgba(0, 86, 210, 0.2) !important;
  transform: translateY(-2px);
}

.description-text {
  font-size: 20px;
  line-height: 1.8;
  color: var(--ink-700);
  margin: 0;
}

.dark-card .description-text {
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

.field-label {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-700);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-card .field-label {
  color: #a7a7a7;
}

.modern-input {
  font-size: 14px;
}

.modern-input :deep(.v-field__input) {
  font-size: 14px;
}

.modern-checkbox :deep(.v-label) {
  font-size: 15px !important;
  color: var(--ink-700) !important;
}

.dark-card .modern-checkbox :deep(.v-label) {
  color: #d6d6d6 !important;
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
  .responsive-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Mobile Screens (below 768px) */
@media (max-width: 768px) {
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

  .modern-checkbox :deep(.v-label) {
    font-size: 13px !important;
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
</style>
