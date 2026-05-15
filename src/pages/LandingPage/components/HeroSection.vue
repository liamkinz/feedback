<script setup lang="ts">
import { ref } from 'vue'
import backgroundImage from '@/assets/CSMRBackgroundPic.png'

interface Metric {
  label: string
  value: number
  suffix: string
}

const metrics = ref<Metric[]>([
  { label: 'Client Satisfaction', value: 94, suffix: '%' },
  { label: 'Projects Completed', value: 250, suffix: '+' },
  { label: 'Active Clients', value: 45, suffix: '+' },
])

function handleViewReport() {
  // TODO: implement
}

function handleDownloadPdf() {
  // TODO: implement
}
</script>

<template>
  <section
    class="hero-section"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    aria-label="Hero Section"
  >
    <v-container class="hero-container" fluid>
      <v-row align="center" justify="center" class="py-16 px-4">
        <!-- Left: Content -->
        <v-col cols="12" md="6" class="d-flex flex-column justify-center">
          <h1 class="text-h3 font-weight-bold text-primary mb-4">
            Client Satisfaction Measurement Report
          </h1>

          <p class="text-body-1 text-grey-darken-1 hero-description mb-6">
            Comprehensive insights into client satisfaction metrics, feedback analysis, and
            performance trends. Track satisfaction scores, identify improvement areas, and drive
            business growth through data-driven decisions.
          </p>

          <div class="d-flex flex-wrap hero-actions">
            <v-btn size="large" color="primary" @click="handleViewReport"> View Full Report </v-btn>
            <v-btn size="large" variant="outlined" color="primary" @click="handleDownloadPdf">
              Download PDF
            </v-btn>
          </div>
        </v-col>

        <!-- Right: Metrics -->
        <v-col cols="12" md="6">
          <v-row density="comfortable">
            <v-col v-for="metric in metrics" :key="metric.label" cols="12" sm="6">
              <v-card class="metric-card pa-6 text-center" elevation="2">
                <p class="text-h3 font-weight-bold text-primary mb-1">
                  {{ metric.value }}{{ metric.suffix }}
                </p>
                <p class="text-body-2 text-grey-darken-1">
                  {{ metric.label }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  min-height: 100%; /* fills whatever v-main gives it */
  width: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.hero-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
}

.hero-description {
  line-height: 1.7;
  max-width: 560px;
}

.hero-actions {
  gap: 12px; /* replaces the inline margin-left hack */
}

.metric-card {
  transition: box-shadow 0.3s ease-in-out;
}

.metric-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
