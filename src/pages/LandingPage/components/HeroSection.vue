<script setup lang="ts">
import { ref } from 'vue'

interface MetricData {
  label: string
  value: number
  suffix: string
}

const metrics = ref<MetricData[]>([
  { label: 'Client Satisfaction', value: 94, suffix: '%' },
  { label: 'Projects Completed', value: 250, suffix: '+' },
  { label: 'Active Clients', value: 45, suffix: '+' },
])
</script>

<template>
  <div class="hero-section" style="width: 100%">
    <v-row class="align-center justify-center ga-8 py-16 px-4" style="width: 100%; margin: 0">
      <!-- Left Content -->
      <v-col cols="12" md="6" class="d-flex flex-column justify-center">
        <h1 class="text-h3 font-weight-bold mb-4 text-primary">
          Client Satisfaction Measurement Report
        </h1>

        <p class="text-body1 text-grey-darken-1 mb-6 line-height-lg">
          Comprehensive insights into client satisfaction metrics, feedback analysis, and
          performance trends. Track satisfaction scores, identify improvement areas, and drive
          business growth through data-driven decisions.
        </p>

        <!-- Action Buttons -->
        <div class="d-flex gap-4 flex-wrap">
          <v-btn size="large" color="primary" class="px-8" @click="() => {}">
            View Full Report
          </v-btn>
          <v-btn
            size="large"
            variant="outlined"
            color="primary"
            class="px-8"
            style="margin-left: 20px"
            @click="() => {}"
          >
            Download PDF
          </v-btn>
        </div>
      </v-col>

      <!-- Right Metrics -->
      <v-col cols="12" md="6">
        <v-row class="ga-4">
          <v-col v-for="(metric, index) in metrics" :key="index" cols="12" sm="6">
            <v-card class="pa-6 text-center elevation-2 hover-elevation-8 transition-all" elevated>
              <div class="text-h3 font-weight-bold text-primary mb-2">
                {{ metric.value }}{{ metric.suffix }}
              </div>
              <div class="text-body2 text-grey-darken-1">
                {{ metric.label }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  min-height: 500px;
  width: 100%;
  display: block;
}

.line-height-lg {
  line-height: 1.6;
}

.hover-elevation-8:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
