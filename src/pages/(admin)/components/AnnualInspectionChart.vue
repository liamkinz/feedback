<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import { fetchAnnualInspectionChartData } from '@/services/chartService'
import { useThemeToggle } from '@/components/composables/useThemeToggle'

Chart.register(...registerables)

const { isDark } = useThemeToggle()

// ─── State ────────────────────────────────────────────────────
const loading = ref(false)
const error = ref(null)
const rawData = ref([])
const chartCanvas = ref(null)
let chartInstance = null

const filterMode = ref('month')
const dateMenu = ref(false)

const now = new Date()
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

const today = new Date()
const thirtyAgo = new Date()
thirtyAgo.setDate(today.getDate() - 30)
const startDate = ref(thirtyAgo.toISOString().split('T')[0])
const endDate = ref(today.toISOString().split('T')[0])

const monthOptions = computed(() =>
  Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    return { value, label }
  }),
)

// ─── Theme-aware colour tokens ─────────────────────────────────
const theme = computed(() =>
  isDark.value
    ? {
        card: '#0b1628',
        cardBorder: 'rgba(14,165,233,0.12)',
        headerBorder: 'rgba(255,255,255,0.05)',
        eyebrow: '#0ea5e9',
        title: '#f1f5f9',
        chipBg: 'rgba(14,165,233,0.07)',
        chipBorder: 'rgba(14,165,233,0.15)',
        chipHiBg: 'rgba(14,165,233,0.15)',
        chipHiBorder: 'rgba(14,165,233,0.4)',
        chipVal: '#e0f2fe',
        chipLbl: '#475569',
        emptyBorder: 'rgba(14,165,233,0.15)',
        bar: 'rgba(14,165,233,0.80)',
        barHover: 'rgba(14,165,233,1)',
        tooltipBg: '#0c1a2e',
        tooltipTitle: '#7dd3fc',
        tooltipBody: '#cbd5e1',
        tickColor: '#64748b',
        gridColor: 'rgba(148,163,184,0.10)',
      }
    : {
        card: '#ffffff',
        cardBorder: 'rgba(14,165,233,0.18)',
        headerBorder: 'rgba(0,0,0,0.07)',
        eyebrow: '#0284c7',
        title: '#0f172a',
        chipBg: 'rgba(14,165,233,0.06)',
        chipBorder: 'rgba(14,165,233,0.2)',
        chipHiBg: 'rgba(14,165,233,0.12)',
        chipHiBorder: 'rgba(14,165,233,0.45)',
        chipVal: '#0c4a6e',
        chipLbl: '#94a3b8',
        emptyBorder: 'rgba(14,165,233,0.2)',
        bar: 'rgba(14,165,233,0.70)',
        barHover: 'rgba(2,132,199,1)',
        tooltipBg: '#0f172a',
        tooltipTitle: '#38bdf8',
        tooltipBody: '#e2e8f0',
        tickColor: '#94a3b8',
        gridColor: 'rgba(100,116,139,0.12)',
      },
)

// ─── Computed ─────────────────────────────────────────────────
const dateRangeLabel = computed(() => {
  const fmt = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(startDate.value)} – ${fmt(endDate.value)}`
})

const chartData = computed(() => {
  if (!rawData.value.length) return { labels: [], values: [] }
  const sorted = [...rawData.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  return {
    labels: sorted.map((r) =>
      new Date(r.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    ),
    values: sorted.map((r) => Number(r.count) || 0),
  }
})

const totalInspections = computed(() => chartData.value.values.reduce((s, v) => s + v, 0))
const avgInspections = computed(() => {
  const n = chartData.value.values.length
  return n ? Math.round(totalInspections.value / n) : 0
})
const maxInspections = computed(() =>
  chartData.value.values.length ? Math.max(...chartData.value.values) : 0,
)

// ─── Fetch ────────────────────────────────────────────────────
async function fetchData() {
  loading.value = true
  error.value = null
  try {
    let start, end
    if (filterMode.value === 'month') {
      const [y, m] = selectedMonth.value.split('-').map(Number)
      start = `${selectedMonth.value}-01`
      end = `${selectedMonth.value}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`
    } else {
      start = startDate.value
      end = endDate.value
    }
    rawData.value = await fetchAnnualInspectionChartData({ startDate: start, endDate: end })
  } catch (err) {
    error.value = err.message || 'Failed to fetch data'
    rawData.value = []
  } finally {
    loading.value = false
  }
}

function applyFilter() {
  dateMenu.value = false
  fetchData()
}

// ─── Chart.js ─────────────────────────────────────────────────
function buildChart() {
  if (!chartCanvas.value || !chartData.value.labels.length) return
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const t = theme.value
  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: 'Annual Inspections',
          data: chartData.value.values,
          backgroundColor: t.bar,
          hoverBackgroundColor: t.barHover,
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutCubic' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: t.tooltipBg,
          titleColor: t.tooltipTitle,
          bodyColor: t.tooltipBody,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (item) => `  ${item.parsed.y.toLocaleString()} inspections`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: t.tickColor,
            font: { size: 11 },
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit: 14,
          },
        },
        y: {
          beginAtZero: true,
          border: { display: false, dash: [4, 4] },
          grid: { color: t.gridColor },
          ticks: { color: t.tickColor, font: { size: 11 }, precision: 0 },
        },
      },
    },
  })
}

// Rebuild chart whenever data OR theme changes
watch(chartData, async () => {
  await nextTick()
  buildChart()
})
watch(isDark, async () => {
  await nextTick()
  buildChart()
})

onMounted(async () => {
  await fetchData()
  await nextTick()
  buildChart()
})
onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <v-card
    class="ic-card"
    elevation="0"
    rounded="xl"
    :style="{
      background: theme.card,
      borderColor: theme.cardBorder,
    }"
  >
    <!-- ── Header ─────────────────────────────────────────── -->
    <div class="ic-header" :style="{ borderBottomColor: theme.headerBorder }">
      <div>
        <p class="ic-eyebrow" :style="{ color: theme.eyebrow }">Annual Inspections</p>
        <p class="ic-title" :style="{ color: theme.title }">Daily Annual Inspection Overview</p>
      </div>

      <div class="d-flex align-center gap-2 flex-wrap">
        <!-- Mode toggle -->
        <v-btn-toggle
          v-model="filterMode"
          mandatory
          density="compact"
          rounded="lg"
          color="primary"
          variant="outlined"
        >
          <v-btn prepend-icon="$calendar" value="month" size="small"> Month </v-btn>
          <v-btn prepend-icon="$calendarRange" value="range" size="small"> Range </v-btn>
        </v-btn-toggle>

        <!-- Month selector -->
        <v-select
          v-if="filterMode === 'month'"
          v-model="selectedMonth"
          :items="monthOptions"
          item-title="label"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 170px"
          @update:model-value="fetchData"
        />

        <!-- Range picker -->
        <template v-else>
          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="outlined" size="small" class="range-btn">
                {{ dateRangeLabel }}
              </v-btn>
            </template>
            <v-card class="pa-4" min-width="280" rounded="xl">
              <p class="text-subtitle-2 font-weight-bold mb-3">Select Date Range</p>
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
                class="mb-2"
              />
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="compact"
                class="mb-3"
              />
              <v-btn block color="primary" variant="flat" rounded="lg" @click="applyFilter"
                >Apply</v-btn
              >
            </v-card>
          </v-menu>
        </template>

        <!-- Refresh -->
        <v-btn icon size="small" variant="text" :loading="loading" @click="fetchData">
          <v-icon>$refresh</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- ── Stat chips ──────────────────────────────────────── -->
    <div class="ic-stats">
      <div
        v-for="chip in [
          { val: totalInspections.toLocaleString(), lbl: 'Total', hi: false },
          { val: avgInspections, lbl: 'Daily Avg', hi: false },
          { val: maxInspections, lbl: 'Peak Day', hi: true },
        ]"
        :key="chip.lbl"
        class="ic-chip"
        :style="{
          background: chip.hi ? theme.chipHiBg : theme.chipBg,
          borderColor: chip.hi ? theme.chipHiBorder : theme.chipBorder,
        }"
      >
        <span class="ic-chip-val" :style="{ color: theme.chipVal }">{{ chip.val }}</span>
        <span class="ic-chip-lbl" :style="{ color: theme.chipLbl }">{{ chip.lbl }}</span>
      </div>
    </div>

    <!-- ── Chart body ─────────────────────────────────────── -->
    <v-card-text class="pa-5 pt-2">
      <div v-if="loading" class="ic-empty" :style="{ borderColor: theme.emptyBorder }">
        <v-progress-circular indeterminate color="primary" size="40" />
      </div>

      <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg" density="compact">
        {{ error }}
        <template #append>
          <v-btn size="small" variant="text" @click="fetchData">Retry</v-btn>
        </template>
      </v-alert>

      <div
        v-else-if="!chartData.labels.length"
        class="ic-empty"
        :style="{ borderColor: theme.emptyBorder }"
      >
        <v-icon size="40" color="grey">$chartBar</v-icon>
        <span class="mt-2" :style="{ color: theme.tickColor }">No data for selected period</span>
      </div>

      <div v-else class="ic-chart-wrap">
        <canvas ref="chartCanvas" />
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.ic-card {
  border-width: 1px;
  border-style: solid;
  transition:
    background 0.4s ease,
    border-color 0.4s ease;
}
.ic-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 20px 12px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  transition: border-color 0.4s ease;
}
.ic-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 2px;
  transition: color 0.4s ease;
}
.ic-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  transition: color 0.4s ease;
}
.ic-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 20px 0;
}
.ic-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7px 16px;
  border-width: 1px;
  border-style: solid;
  border-radius: 10px;
  min-width: 72px;
  transition:
    background 0.4s ease,
    border-color 0.4s ease;
}
.ic-chip-val {
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  transition: color 0.4s ease;
}
.ic-chip-lbl {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 3px;
  transition: color 0.4s ease;
}
.ic-chart-wrap {
  position: relative;
  height: 240px;
}
.ic-empty {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border-width: 1px;
  border-style: dashed;
  transition: border-color 0.4s ease;
}
.range-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}
</style>
