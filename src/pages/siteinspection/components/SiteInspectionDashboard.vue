<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
import { usePDFExport } from '@/composables/usePDFExport'
import { getAllLocalInspections } from '@/services/siteInspectionService'
import { getErrorMessage } from '@/utils/helpers'
import type { SiteInspectionFeedback } from '@/db/database'
import PublicLayout from '@/layouts/PublicLayout.vue'

const { sync, isSyncing, unsyncedCount } = useFeedback()
const { isExporting, exportingId, handleExport } =
  usePDFExport<SiteInspectionFeedback>('SiteInspection')

// ── State ──────────────────────────────────────────────────────
const inspections = ref<SiteInspectionFeedback[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)
const isOnline = ref(navigator.onLine)
const search = ref('')

// ── Date Range Filter ──────────────────────────────────────────
const dateMenu = ref(false)
const dateRange = ref<Date[]>([])

const dateRangeText = computed(() => {
  if (dateRange.value.length === 0) return 'All Dates'

  // ✅ Add fallback with ?? to satisfy TypeScript
  if (dateRange.value.length === 1) {
    return formatDate(dateRange.value[0]!) // ← non-null assertion
  }

  const sorted = [...dateRange.value].sort((a, b) => a.getTime() - b.getTime())

  // ✅ Destructure with fallback
  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  if (!first || !last) return 'All Dates'

  return `${formatDate(first)} — ${formatDate(last)}`
})

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function clearDateRange() {
  dateRange.value = []
  dateMenu.value = false
}

// ── Filtered Data ──────────────────────────────────────────────
const filteredInspections = computed(() => {
  if (dateRange.value.length < 2) return inspections.value

  // ← sort Date objects properly
  const sorted = [...dateRange.value].sort((a, b) => a.getTime() - b.getTime())
  const startDate = sorted[0]
  const lastDate = sorted[sorted.length - 1]

  if (!startDate || !lastDate) return inspections.value

  const endDate = new Date(lastDate)
  endDate.setHours(23, 59, 59, 999)

  return inspections.value.filter((item) => {
    if (!item.respondentInfo?.date) return false
    const d = new Date(item.respondentInfo.date)
    return d >= startDate && d <= endDate
  })
})

// ── Headers ────────────────────────────────────────────────────
const headers = [
  { title: 'ID', key: 'id', width: '55px' },
  { title: 'Date', key: 'respondentInfo.date', width: '100px' },
  { title: 'Client Type', key: 'respondentInfo.clientType', width: '110px' },
  { title: 'Sex', key: 'respondentInfo.sex', width: '65px' },
  { title: 'Age', key: 'respondentInfo.age', width: '60px' },
  { title: 'Contact', key: 'respondentInfo.contactNumber', width: '110px' },
  { title: 'Site', key: 'respondentInfo.siteInspections', width: '100px' },
  { title: 'CC1', key: 'selectedAnswers.CC1', width: '55px' },
  { title: 'CC2', key: 'selectedAnswers.CC2', width: '55px' },
  { title: 'CC3', key: 'selectedAnswers.CC3', width: '55px' },
  { title: 'SQD0', key: 'selectedRatings.SQD0', width: '65px' },
  { title: 'SQD1', key: 'selectedRatings.SQD1', width: '65px' },
  { title: 'SQD2', key: 'selectedRatings.SQD2', width: '65px' },
  { title: 'SQD3', key: 'selectedRatings.SQD3', width: '65px' },
  { title: 'SQD4', key: 'selectedRatings.SQD4', width: '65px' },
  { title: 'SQD5', key: 'selectedRatings.SQD5', width: '65px' },
  { title: 'SQD6', key: 'selectedRatings.SQD6', width: '65px' },
  { title: 'SQD7', key: 'selectedRatings.SQD7', width: '65px' },
  { title: 'SQD8', key: 'selectedRatings.SQD8', width: '65px' },
  { title: 'Comments', key: 'comments', width: '160px' },
  { title: 'Synced', key: 'synced', width: '85px' },
  { title: 'Export', key: 'actions', width: '85px', sortable: false },
] as const

// ── Summary ────────────────────────────────────────────────────
const syncedCount = computed(() => inspections.value.filter((i) => i.synced === 1).length)
const totalCount = computed(() => inspections.value.length)

// ── Fetch ──────────────────────────────────────────────────────
const fetchInspections = async () => {
  loading.value = true
  loadError.value = null

  try {
    inspections.value = await getAllLocalInspections()
  } catch (error) {
    // Swallowing this would leave the table on its empty state, reporting
    // "No inspections found" — which reads as "there is no data" rather than
    // "the data could not be read". Catching here also keeps the rejection
    // from escaping onMounted before the online/offline listeners register.
    loadError.value = getErrorMessage(error)
    inspections.value = []
  } finally {
    loading.value = false
  }
}

const handleSync = async () => {
  await sync()
  await fetchInspections()
}

onMounted(async () => {
  await fetchInspections()
  window.addEventListener('online', () => {
    isOnline.value = true
  })
  window.addEventListener('offline', () => {
    isOnline.value = false
  })
})
</script>

<template>
  <PublicLayout>
    <template #content>
      <v-container fluid class="d-flex flex-column align-center">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between w-100 mb-4" style="max-width: 1400px">
          <h1>Site Inspections Dashboard</h1>
          <div class="d-flex align-center ga-3">
            <v-chip :color="isOnline ? 'success' : 'error'" size="small">
              {{ isOnline ? '🟢 Online' : '🔴 Offline' }}
            </v-chip>
            <v-btn
              color="primary"
              :loading="isSyncing"
              :disabled="unsyncedCount === 0"
              prepend-icon="$cloudUpload"
              @click="handleSync"
            >
              {{ isSyncing ? 'Syncing...' : `Sync (${unsyncedCount} pending)` }}
            </v-btn>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="d-flex ga-4 mb-4 w-100" style="max-width: 1400px">
          <v-card rounded="lg" class="flex-1-1 pa-4 text-center summary-card">
            <div class="text-h4 font-weight-bold text-primary">{{ totalCount }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Records</div>
          </v-card>
          <v-card rounded="lg" class="flex-1-1 pa-4 text-center summary-card">
            <div class="text-h4 font-weight-bold text-success">{{ syncedCount }}</div>
            <div class="text-body-2 text-medium-emphasis">Synced</div>
          </v-card>
          <v-card rounded="lg" class="flex-1-1 pa-4 text-center summary-card">
            <div class="text-h4 font-weight-bold text-warning">{{ unsyncedCount }}</div>
            <div class="text-body-2 text-medium-emphasis">Pending Sync</div>
          </v-card>
        </div>

        <!-- Table Card -->
        <v-card class="w-100 dashboard-card" style="max-width: 1400px; margin-top: 16px">
          <!-- Toolbar -->
          <v-card-title class="pa-4">
            <div class="d-flex align-center ga-3 flex-wrap">
              <v-text-field
                v-model="search"
                placeholder="Search inspections..."
                prepend-inner-icon="$magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                style="max-width: 280px"
              />

              <!-- Date Range -->
              <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom start">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="outlined"
                    :color="dateRange.length ? 'primary' : 'default'"
                    prepend-icon="$calendarRange"
                  >
                    {{ dateRangeText }}
                  </v-btn>
                </template>
                <v-card min-width="360" rounded="lg" elevation="4">
                  <v-card-title class="pa-4 pb-0 text-body-1 font-weight-medium"
                    >Select Date Range</v-card-title
                  >
                  <v-card-subtitle class="px-4 pb-2 text-caption">
                    {{
                      dateRange.length === 0
                        ? 'Pick a start date'
                        : dateRange.length === 1
                          ? 'Now pick an end date'
                          : dateRangeText
                    }}
                  </v-card-subtitle>
                  <v-date-picker
                    v-model="dateRange"
                    multiple="range"
                    hide-header
                    show-adjacent-months
                    color="primary"
                    class="elevation-0"
                  />
                  <v-card-actions class="pa-4 pt-0">
                    <v-btn variant="text" color="error" @click="clearDateRange">Clear</v-btn>
                    <v-spacer />
                    <v-btn
                      variant="tonal"
                      color="primary"
                      :disabled="dateRange.length < 2"
                      @click="dateMenu = false"
                      >Apply</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-menu>

              <v-chip
                v-if="dateRange.length >= 2"
                color="primary"
                closable
                @click:close="clearDateRange"
              >
                {{ dateRangeText }}
              </v-chip>
            </div>
          </v-card-title>

          <!-- Data Table -->
          <v-data-table
            :headers="headers"
            :items="filteredInspections"
            :loading="loading"
            :search="search"
            hover
            class="elevation-0 w-100"
            items-per-page="10"
          >
            <!-- Synced chip -->
            <template #[`item.synced`]="{ item }">
              <v-chip
                :color="item.synced === 1 ? 'success' : 'warning'"
                size="small"
                variant="tonal"
              >
                {{ item.synced === 1 ? '✅ Yes' : '⏳ Pending' }}
              </v-chip>
            </template>

            <!-- Comments truncated -->
            <template #[`item.comments`]="{ item }">
              <div class="text-truncate" style="max-width: 160px">
                {{ item.comments || '—' }}
              </div>
            </template>

            <!-- ↓ Export button per row -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex">
                <!-- PDF Lib Version -->
                <v-btn
                  size="small"
                  color="primary"
                  variant="tonal"
                  :loading="isExporting && exportingId === item.id"
                  prepend-icon="$filePdfBox"
                  @click="handleExport(item)"
                >
                  PDF
                </v-btn>
              </div>
            </template>

            <!-- Failed load and genuinely-empty are different states and must
                 not share a message. -->
            <template #no-data>
              <div v-if="loadError" class="text-center py-8">
                <v-icon size="48" color="error">mdi-alert-circle-outline</v-icon>
                <p class="text-body-1 font-weight-medium mt-2 mb-1">Couldn't load inspections</p>
                <p class="text-body-2 text-medium-emphasis mb-3">{{ loadError }}</p>
                <v-btn color="primary" variant="tonal" :loading="loading" @click="fetchInspections">
                  Try again
                </v-btn>
              </div>

              <div v-else class="text-center py-8">
                <v-icon size="48" color="grey-lighten-1">$calendarSearch</v-icon>
                <p class="text-medium-emphasis mt-2">
                  {{
                    dateRange.length >= 2 ? 'No records in selected range' : 'No inspections found'
                  }}
                </p>
                <v-btn
                  v-if="dateRange.length >= 2"
                  variant="text"
                  color="primary"
                  class="mt-2"
                  @click="clearDateRange"
                >
                  Clear date filter
                </v-btn>
              </div>
            </template>

            <template #loading>
              <v-skeleton-loader type="table-row@5" />
            </template>
          </v-data-table>
        </v-card>
      </v-container>

      <!-- Generating PDF overlay -->
      <v-overlay v-model="isExporting" class="align-center justify-center" persistent>
        <v-card class="pa-6 text-center" rounded="xl" min-width="260">
          <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
          <div class="text-body-1 font-weight-medium">Generating PDF...</div>
          <div class="text-body-2 text-medium-emphasis mt-1">Please wait</div>
        </v-card>
      </v-overlay>
    </template>
  </PublicLayout>
</template>

<style scoped>
.dashboard-card {
  background: var(--blue-500) !important;
  border: 1px solid var(--blue-200) !important;
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
}
.summary-card {
  border: 1px solid rgba(0, 86, 210, 0.12);
  box-shadow: 0 2px 8px rgba(0, 86, 210, 0.08) !important;
}
</style>
