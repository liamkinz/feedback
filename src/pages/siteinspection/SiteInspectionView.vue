<script setup lang="ts">
import { ref } from 'vue'

interface Question {
  id: string
  text: string
  options: {
    id: string
    label: string
  }[]
}

interface RatingQuestion {
  id: string
  text: string
}

const questions = ref<Question[]>([
  {
    id: 'CC1',
    text: 'Asa sa musunod ang labing mayo nga naghulagway sa imong kahibalo sa usa ka CC?',
    options: [
      { id: '1', label: '1. Nahibalo ko kung unsa ang CC ug nakita nako ang CC nini nga opisina.' },
      { id: '2', label: '2. Kabalo ko unsa ang CC pero WALA ko kakita sa CC ani nga opisina.' },
      {
        id: '3',
        label: '3. Nakat-unan lang nako ang CC dihang nakita nako ang CC nini nga opisina.',
      },
      {
        id: '4',
        label:
          "4. Wala ko kahibalo kung unsa ang CC ug wala koy nakita nili nga opisina. (Answer 'N/A' on CC2 and CC3)",
      },
    ],
  },
  {
    id: 'CC2',
    text: 'Kung nahibal-an nimo ang CC (glubag ang 1-3 sa CC1), makaingon ka banga ang CC nini nga opisina mao ang...?',
    options: [
      { id: '1', label: '1. Sayon nga makita' },
      { id: '2', label: '2. Medyodali nga makita' },
      { id: '3', label: '3. Lisud nga makita' },
      { id: '4', label: '4. Dili gyud makita' },
      { id: '5', label: '5. N/A' },
    ],
  },
  {
    id: 'CC3',
    text: 'Kung kahibalo ka sa CC (glubag ang mga code 1-3 sa CC1), sa unsang paagi nakatabang sa imu ang CC sa imung transaksyon?',
    options: [
      { id: '1', label: '1. Nakatbang kayo' },
      { id: '2', label: '2. Medyo nakatbang' },
      { id: '3', label: '3. Wala nakatbang' },
      { id: '4', label: '4. N/A' },
    ],
  },
])

const ratingQuestions = ref<RatingQuestion[]>([
  {
    id: 'SQD0',
    text: 'Kontento ko sa serbisyo nga akong na-avail.',
  },
  {
    id: 'SQD1',
    text: 'Gigahinan nako og igo nga oras alang sa alang transaksyon.',
  },
  {
    id: 'SQD2',
    text: 'Gigunod sa opisina ang mga requirements ug lakang sa transaksyon base sa gihatag nga impormasyon.',
  },
  {
    id: 'SQD3',
    text: 'Ang magalakang (lakip ang pagbayad) nga kinahanglan nako buhaton alang sa transaksyon sayon ug simple.',
  },
  {
    id: 'SQD4',
    text: 'Dali ranakaratita ang impormasyon kabahin sa alang transaksyon gikan sa opisina o sa ilang website.',
  },
  {
    id: 'SQD5',
    text: 'Nagbayad ko og makalarungannon mga kantidad sa mga bayronon alang sa alang transaksyon.',
  },
  {
    id: 'SQD6',
    text: 'Nabati nako nga opisina patas sa tanan o "walang palakasan" alang sa alang transaksyon.',
  },
  {
    id: 'SQD7',
    text: 'Gitratar ako nga matinahron sa mga staff, ug (kung nangayo ko og tabang) matinabangon sab ang aming staff.',
  },
  {
    id: 'SQD8',
    text: 'Nakunua nako at alang gikinhanglan gikan sa opisina sa pabungalow, o (kongibalibaran) ang pagdumlil sa iba hanyo igo nga gipasabutkanako.',
  },
])

const ratingOptions = [
  { id: '5', label: '5. Strongly Agree', value: 5 },
  { id: '4', label: '4. Agree', value: 4 },
  { id: '3', label: '3. Neither Agree nor Disagree', value: 3 },
  { id: '2', label: '2. Disagree', value: 2 },
  { id: '1', label: '1. Strongly Disagree', value: 1 },
]

const selectedAnswers = ref<{ [key: string]: string }>({
  CC1: '',
  CC2: '',
  CC3: '',
})

const selectedRatings = ref<{ [key: string]: string }>({})

const respondentInfo = ref({
  clientType: '',
  date: '',
  sex: '',
  age: '',
  contactNumber: '',
  siteInspections: '',
})
</script>

<template>
  <div class="d-flex justify-center align-center min-h-screen pa-4">
    <div class="pa-6" style="max-width: 800px; width: 100%">
      <!-- Client Satisfaction Measurement Card -->
      <v-card elevation="2" style="margin-bottom: 32px">
        <v-card-text style="padding: 24px">
          <p style="margin-bottom: 16px; line-height: 1.6">
            Ang Client Satisfaction Measurement (CSM) nagsubay sa kasinatian sa customer sa mga
            opisina sa gobyerno. Ang imong feedback sa bag-o lang nahuman nga transaksyon sa opisina
            makatabang kini nga makahatag og mas maayong serbisyo. Ang personal nga impormasyon nga
            gipaambit itago nga kompidensyal ug kanunay kang adunay kapilian kung dili nimu buot
            tubagon ang pangutana.
          </p>

          <!-- Client Information Form -->
          <div style="margin-top: 24px">
            <!-- Client Type -->
            <div style="margin-bottom: 20px">
              <label class="font-weight-bold" style="display: block; margin-bottom: 8px">
                Client Type:
              </label>
              <div style="display: flex; gap: 16px">
                <v-checkbox
                  v-model="respondentInfo.clientType"
                  value="Citizen"
                  label="Citizen"
                  hide-details
                />
                <v-checkbox
                  v-model="respondentInfo.clientType"
                  value="Business"
                  label="Business"
                  hide-details
                />
                <v-checkbox
                  v-model="respondentInfo.clientType"
                  value="Government"
                  label="Government (Employee or another agency)"
                  hide-details
                />
              </div>
            </div>

            <!-- Date, Sex, Age, Contact -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
              <v-text-field
                v-model="respondentInfo.date"
                label="Petsa (Date)"
                type="date"
                hide-details
              />
              <div>
                <label class="font-weight-bold" style="display: block; margin-bottom: 8px">
                  Sex:
                </label>
                <div style="display: flex; gap: 16px">
                  <v-checkbox v-model="respondentInfo.sex" value="Male" label="Male" hide-details />
                  <v-checkbox
                    v-model="respondentInfo.sex"
                    value="Female"
                    label="Female"
                    hide-details
                  />
                </div>
              </div>
            </div>

            <!-- Age and Contact -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px">
              <v-text-field
                v-model="respondentInfo.age"
                label="Edad (Age)"
                type="number"
                hide-details
              />
              <v-text-field
                v-model="respondentInfo.contactNumber"
                label="Contact Number (Optional)"
                hide-details
              />
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card elevation="2" style="margin-bottom: 32px">
        <!-- Number of Site Inspections -->
        <v-card-text style="padding: 24px">
          <h3 class="font-weight-bold text-base" style="margin-bottom: 16px">
            Number of Site Inspections
          </h3>
          <v-text-field
            v-model="respondentInfo.siteInspections"
            label="Number of Site Inspections"
            type="number"
            hide-details
          />
        </v-card-text>
      </v-card>

      <h1 class="mb-12 text-center">Customer Care (CC) Survey</h1>

      <!-- CC Instructions Card -->
      <v-card elevation="2" style="margin-bottom: 32px">
        <v-card-title
          class="text-lg font-weight-bold"
          style="
            white-space: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.5;
          "
        >
          MGA INSTRUKSYON: I-click ang lingin (●) sa imong napili na tubag sa mga pangutana nga naa
          sa Citizen's Charter (CC). Ang Citizen's Charter usa ka opisyal na dokumento nga nagpakita
          sa mga serbisyo sa usa ka ahensya/opisina sa gobyerno lakip ang mga kinahanglanon,
          bayronon, ug oras sa pagproseso niini ug uban pa.
        </v-card-title>
      </v-card>

      <!-- CC Questions Card -->
      <v-card
        v-for="question in questions"
        :key="question.id"
        elevation="2"
        style="margin-bottom: 32px"
      >
        <v-card-text>
          <div style="margin-bottom: 16px">
            <h3 class="font-weight-bold text-base" style="margin-bottom: 24px">
              {{ question.id }}: {{ question.text }}
            </h3>

            <v-radio-group v-model="selectedAnswers[question.id]" :name="`question-${question.id}`">
              <v-radio
                v-for="option in question.options"
                :key="option.id"
                :value="option.id"
                :label="option.label"
                style="margin-bottom: 12px"
              />
            </v-radio-group>
          </div>
        </v-card-text>
      </v-card>

      <!-- Service Quality Dimensions Card -->
      <v-card elevation="2" style="margin-bottom: 32px">
        <v-card-title
          class="text-lg font-weight-bold"
          style="
            white-space: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.5;
          "
        >
          INSTRUCTIONS: Para sa SQD 0-8, palihug I-rate ang mosunod pinaagi sa pagpili I-click ang
          lingin (●) sa column nga tukma sa imung tubag.
        </v-card-title>
        <v-divider />
        <v-card-text style="padding-top: 24px">
          <div v-for="question in ratingQuestions" :key="question.id" style="margin-bottom: 40px">
            <h4 class="font-weight-bold text-sm" style="margin-bottom: 16px">
              {{ question.id }}: {{ question.text }}
            </h4>

            <v-radio-group v-model="selectedRatings[question.id]" :name="`rating-${question.id}`">
              <v-radio
                v-for="option in ratingOptions"
                :key="option.id"
                :value="option.id"
                :label="option.label"
                style="margin-bottom: 12px"
              />
            </v-radio-group>
          </div>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-center" style="margin-top: 32px">
        <v-btn color="primary" style="margin-top: 16px">Submit Answers</v-btn>
      </div>
    </div>
  </div>
</template>
