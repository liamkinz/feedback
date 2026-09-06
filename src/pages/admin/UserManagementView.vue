<script setup lang="ts">
import { useDisplay } from 'vuetify'
import AppShellLayout from '@/layouts/AppShellLayout.vue'
import UserManagementTable from './components/UserManagementTable.vue'

const { mobile } = useDisplay()
</script>
<template>
  <AppShellLayout>
    <template #content>
      <v-container fluid :class="mobile ? 'pa-3' : 'pa-6'">
        <UserManagementTable />
      </v-container>
    </template>
  </AppShellLayout>
</template>
