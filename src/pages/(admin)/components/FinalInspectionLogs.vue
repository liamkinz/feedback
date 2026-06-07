<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInspectionLogsStore } from '@/stores/inspectionLogsStore'

const finalInspectionLogsStore = useInspectionLogsStore()
const search = ref('')

// Define columns mapping directly to your database keys

const headers = ref([
  { title: 'No.', key: 'id' },
  { title: 'Date', key: 'date' },
  { title: 'Client Type', key: 'clientType' },
  { title: 'Contact Number', key: 'contactNumber' },
  { title: 'Sex', key: 'sex' },
  { title: 'Age', key: 'age' },
  { title: 'Final Inspection', key: 'finalInspection' },
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
  { title: 'Submitted Date', key: 'created_at' },
])

onMounted(async () => {
  // Fetch data rows from Supabase when view mounts
  await finalInspectionLogsStore.fetchFinalInspections()
})
</script>

<template>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <h2>Final Inspection Logs</h2>
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

    <v-alert v-if="finalInspectionLogsStore.msgError" type="error" dismissible>
      {{ finalInspectionLogsStore.msgError }}
    </v-alert>

    <v-data-table
      :headers="headers"
      :header-props="{ class: 'text-no-wrap' }"
      :items="finalInspectionLogsStore.finalInspect"
      :search="search"
      :loading="finalInspectionLogsStore.isLoading"
      :sort-by="[{ key: 'id', order: 'asc' }]"
      loading-text="Loading inspection logs..."
      class="elevation-1"
    >
      <template #item.date="{ item }">
        {{ new Date(item.date).toLocaleDateString() }}
      </template>
      <template #item.created_at="{ item }">
        {{ new Date(item.created_at).toLocaleDateString() }}
      </template>
    </v-data-table>
  </v-container>
</template>
