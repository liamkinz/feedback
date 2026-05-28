<script setup lang="ts">
import SiteInspectionChart from '@/pages/(admin)/components/SiteInspectionChart.vue'
import FinalInspectChart from '@/pages/(admin)/components/FinalInspectChart.vue'
import AnnualInspectionChart from '@/pages/(admin)/components/AnnualInspectionChart.vue'
</script>

<template>
  <div class="d-flex flex-column">
    <SiteInspectionChart class="mb-8" />
    <FinalInspectChart class="mb-8" />
    <AnnualInspectionChart class="mb-8" />
  </div>
</template>
