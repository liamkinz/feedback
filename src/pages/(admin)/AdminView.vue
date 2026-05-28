<script setup lang="ts">
import SiteInspectionChart from '@/pages/(admin)/components/SiteInspectionChart.vue'
import FinalInspectionChart from '@/pages/(admin)/components/FinalInspectionChart.vue'
import AnnualInspectionChart from '@/pages/(admin)/components/AnnualInspectionChart.vue'
</script>

<template>
  <div class="d-flex flex-column">
    <SiteInspectionChart class="mb-8" />
    <FinalInspectionChart class="mb-8" />
    <AnnualInspectionChart class="mb-8" />
  </div>
</template>
