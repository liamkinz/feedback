<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInspectionLogsStore, type AnnualInspectionLog } from '@/stores/inspectionLogsStore'
import { usePDFExport } from '@/composables/usePDFExport'
import type { SiteInspectionFeedback } from '@/db/database'
import AppShellLayout from '@/layouts/AppShellLayout.vue'

const annualInspectionLogsStore = useInspectionLogsStore()
const search = ref('')
const { isExporting, exportingId, handleExport } =
  usePDFExport<SiteInspectionFeedback>('FinalInspection')

function ratingToString(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  return String(value)
}

function logToFeedback(log: AnnualInspectionLog): SiteInspectionFeedback {
  return {
    id: log.id,
    respondentInfo: {
      clientType: log.clientType ?? '',
      date: log.date ?? '',
      sex: log.sex ?? '',
      age: log.age ?? '',
      contactNumber: log.contactNumber ?? '',
      siteInspections: log.finalInspection ?? '',
    },
    selectedAnswers: {
      CC1: log.CC1 ?? '',
      CC2: log.CC2 ?? '',
      CC3: log.CC3 ?? '',
    },
    selectedRatings: {
      SQD0: ratingToString(log.SQD0),
      SQD1: ratingToString(log.SQD1),
      SQD2: ratingToString(log.SQD2),
      SQD3: ratingToString(log.SQD3),
      SQD4: ratingToString(log.SQD4),
      SQD5: ratingToString(log.SQD5),
      SQD6: ratingToString(log.SQD6),
      SQD7: ratingToString(log.SQD7),
      SQD8: ratingToString(log.SQD8),
    },
    comments: log.comments ?? '',
    synced: 1,
    createdAt: String(log.created_at ?? ''),
  }
}

function exportLog(log: AnnualInspectionLog) {
  return handleExport(logToFeedback(log))
}

// Define columns mapping directly to your database keys

const headers = ref([
  { title: 'No.', key: 'id' },
  { title: 'Date', key: 'date' },
  { title: 'Client Type', key: 'clientType' },
  { title: 'Contact Number', key: 'contactNumber' },
  { title: 'Sex', key: 'sex' },
  { title: 'Age', key: 'age' },
  { title: 'Annual Inspection', key: 'annualInspection' },
  { title: 'CC1', key: 'CC1' },
  { title: 'CC2', key: 'CC2' },
  { title: 'CC3', key: 'CC3' },
  { title: 'SQD0', key: 'SQD0' },
  { title: 'SQD1', key: 'SQD1' },
  { title: 'SQD2', key: 'SQD2' },
  { title: 'SQD3', key: 'SQD3' },
  { title: 'SQD4', key: 'SQD4' },
  { title: 'SQD5', key: 'SQD5' },
  { title: 'SQD6', key: 'SQD6' },
  { title: 'SQD7', key: 'SQD7' },
  { title: 'SQD8', key: 'SQD8' },
  { title: 'Comments', key: 'comments' },
])
onMounted(async () => {
  // Fetch data rows from Supabase when view mounts
  await annualInspectionLogsStore.fetchAnnualInspections()
})
</script>

<template>
  <AppShellLayout>
    <template #content>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <h2>Annual Inspection Logs</h2>
      </v-col>
      <v-col cols="12" md="6" class="text-end">
        <v-text-field
          v-model="search"
          label="Search logs..."
          variant="outlined"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <!--Error Alert Banner-->
    <v-alert v-if="annualInspectionLogsStore.msgError" type="error" dismissible>
      {{ annualInspectionLogsStore.msgError }}
    </v-alert>

    <v-data-table
      :headers="headers"
      :header-props="{ class: 'text-no-wrap' }"
      :items="annualInspectionLogsStore.annualInspect"
      :search="search"
      :loading="annualInspectionLogsStore.isLoading"
      :sort-by="[{ key: 'id', order: 'desc' }]"
      loading-text="Loading inspection logs..."
      class="elevation-1"
    >
      <template #item.date="{ item }">
        {{ new Date(item.date).toLocaleDateString() }}
      </template>
      <template #item.created_at="{ item }">
        {{ new Date(item.created_at).toLocaleDateString() }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          size="small"
          color="primary"
          variant="tonal"
          :loading="isExporting && exportingId === item.id"
          prepend-icon="$filePdfBox"
          @click="exportLog(item)"
        >
          PDF
        </v-btn>
      </template>
    </v-data-table>
  </v-container>

  <v-overlay v-model="isExporting" class="align-center justify-center" persistent>
    <v-card class="pa-6 text-center" rounded="xl" min-width="260">
      <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
      <div class="text-body-1 font-weight-medium">Generating PDF...</div>
      <div class="text-body-2 text-medium-emphasis mt-1">Please wait</div>
    </v-card>
  </v-overlay>
    </template>
  </AppShellLayout>
</template>
