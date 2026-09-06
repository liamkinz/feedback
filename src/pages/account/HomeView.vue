<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useUserPermissions } from '@/composables/useUserPermissions'
import { flattenNavigationItems, type NavigationGroup } from '@/utils/navigation'
import AppShellLayout from '@/layouts/AppShellLayout.vue'
import { defaultRoleId } from '@/utils/roles'

const authStore = useAuthStore()
const { userName, userRole } = storeToRefs(authStore)
const { getFilteredNavigationGroups } = useUserPermissions()

const { mobile } = useDisplay()

function pageCount(group: NavigationGroup) {
  return flattenNavigationItems(group.children).length
}

const greeting = (() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})()
</script>

<template>
  <AppShellLayout>
    <template #content>
      <v-container fluid :class="mobile ? 'pa-3' : 'pa-6'">
        <div class="d-flex align-center ga-4 mb-6">
          <v-avatar color="primary" variant="tonal" rounded="lg" :size="mobile ? 44 : 56">
            <v-icon icon="mdi-hand-wave-outline" :size="mobile ? 22 : 28" />
          </v-avatar>
          <div>
            <h1 class="font-weight-bold" :class="mobile ? 'text-h6' : 'text-h5'">
              {{ greeting }}{{ userName ? `, ${userName}` : '' }}
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">Here's what you have access to.</p>
          </div>
        </div>

        <v-alert v-if="userRole === defaultRoleId" type="info" border="start" class="mb-6">
          <div class="text-body-2">
            Your account has the default role. Ask an administrator to grant you access to the
            modules you need.
          </div>
        </v-alert>

        <p class="text-overline-soft mb-3">Your modules</p>

        <v-row>
          <v-col
            v-for="group in getFilteredNavigationGroups()"
            :key="group.title"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="h-100 hover-lift" rounded="xl">
              <v-card-item>
                <div class="d-flex align-center justify-space-between mb-2">
                  <v-avatar color="primary" variant="tonal" rounded="lg" size="44">
                    <v-icon :icon="group.icon" size="24" />
                  </v-avatar>
                  <v-chip size="small" variant="tonal" color="secondary">
                    {{ pageCount(group) }} {{ pageCount(group) === 1 ? 'page' : 'pages' }}
                  </v-chip>
                </div>
                <v-card-title class="px-0">{{ group.title }}</v-card-title>
              </v-card-item>
              <v-card-text class="pt-0">
                <v-list density="compact" bg-color="transparent" class="pa-0">
                  <v-list-item
                    v-for="child in group.children"
                    :key="child.title"
                    :prepend-icon="child.icon"
                    :title="child.title"
                    :to="child.route"
                    rounded="lg"
                    class="px-2"
                  />
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppShellLayout>
</template>
