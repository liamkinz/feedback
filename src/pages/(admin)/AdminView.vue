<script setup lang="ts">
import SiteInspectionChart from '@/pages/(admin)/components/SiteInspectionChart.vue'
import FinalInspectChart from '@/pages/(admin)/components/FinalInspectChart.vue'
import AnnualInspectionChart from '@/pages/(admin)/components/AnnualInspectionChart.vue'
import AppShellLayout from '@/layouts/AppShellLayout.vue'
</script>

<template>
  <AppShellLayout>
    <template #content>
      <div class="d-flex flex-column pa-6">
        <SiteInspectionChart class="mb-8" />
        <FinalInspectChart class="mb-8" />
        <AnnualInspectionChart class="mb-8" />
      </div>
    </template>
  </AppShellLayout>
</template>
