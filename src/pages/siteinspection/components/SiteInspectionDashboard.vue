<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFeedback } from '../../../db/composables/useFeedback'
import type { SiteInspectionFeedback } from '../../../db/database'

const { getSiteInspections } = useFeedback()
const inspections = ref<SiteInspectionFeedback[]>([])

// Define the columns for the Vuetify data table
const headers = [
  { title: 'ID', align: 'start', key: 'id' },
  { title: 'Date', key: 'respondentInfo.date' },
  { title: 'Client Type', key: 'respondentInfo.clientType' },
  { title: 'Sex', key: 'respondentInfo.sex' },
  { title: 'Age', key: 'respondentInfo.age' },
  { title: 'Contact', key: 'respondentInfo.contactNumber' },
  { title: 'siteInspections', key: 'respondentInfo.siteInspections' },
  { title: 'CC1', key: 'selectedAnswers.CC1' },
  { title: 'CC2', key: 'selectedAnswers.CC2' },
  { title: 'CC3', key: 'selectedAnswers.CC3' },
  { title: 'SQ0', key: 'selectedRatings.SQD0' },
  { title: 'SQ1', key: 'selectedRatings.SQD1' },
  { title: 'SQ2', key: 'selectedRatings.SQD2' },
  { title: 'SQ3', key: 'selectedRatings.SQD3' },
  { title: 'SQ4', key: 'selectedRatings.SQD4' },
  { title: 'SQ5', key: 'selectedRatings.SQD5' },
  { title: 'SQ6', key: 'selectedRatings.SQD6' },
  { title: 'SQ7', key: 'selectedRatings.SQD7' },
  { title: 'SQ8', key: 'selectedRatings.SQD8' },
  { title: 'Comments', key: 'comments' },
  { title: 'Synced', key: 'synced' },
] as const

const loading = ref(true)

onMounted(async () => {
  try {
    inspections.value = await getSiteInspections()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <v-container fluid class="d-flex flex-column align-center">
    <h1 class="mb-4">Site Inspections Dashboard</h1>

    <v-card class="mx-auto w-100 dashboard-card" style="max-width: 1400px">
      <v-data-table
        :headers="headers"
        :items="inspections"
        :loading="loading"
        hover
        class="elevation-1 w-100"
      >
        <!-- Custom formatting for the Synced column -->
        <template v-slot:item.synced="{ item }">
          <v-chip :color="item.synced ? 'success' : 'warning'" size="small">
            {{ item.synced ? 'Yes' : 'No' }}
          </v-chip>
        </template>

        <!-- Custom formatting for the Comments column so it doesn't break layout -->
        <template v-slot:item.comments="{ item }">
          <div class="text-truncate" style="max-width: 200px">
            {{ item.comments || 'No comments' }}
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.dashboard-card {
  background: var(--blue-0) !important;
  border: 1px solid var(--blue-200) !important;
  box-shadow: 0 6px 18px rgba(0, 86, 210, 0.12) !important;
  border-radius: 16px !important;
}
</style>
