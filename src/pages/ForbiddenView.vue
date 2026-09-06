<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToDashboard = () => {
  router.push('/account/home')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-container class="mx-auto text-center" elevation="8" rounded="lg">
          <v-card-text class="py-8">
            <v-icon size="120" color="error" class="mb-4"> mdi-lock-outline </v-icon>

            <div class="text-h1 font-weight-bold text-error mb-2">403</div>
            <div class="text-h4 font-weight-light mb-4 text-error">Access Forbidden</div>

            <div class="text-body-1 text-medium-emphasis mb-6">
              You don't have permission to access this resource. This might be because your
              account's role doesn't include access to this page.
            </div>

            <v-alert
              type="warning"
              variant="tonal"
              class="mb-6 text-left"
              icon="mdi-information-outline"
            >
              <v-alert-title class="text-h6">What you can do:</v-alert-title>
              <ul class="mt-2">
                <li>Contact your administrator to request access</li>
                <li>Check if you're logged in with the correct account</li>
                <li>Go back to the previous page</li>
              </ul>
            </v-alert>

            <v-row no-gutters justify="center" class="mb-4">
              <v-col cols="auto" class="mx-2">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  prepend-icon="mdi-view-dashboard"
                  @click="navigateToDashboard"
                >
                  Dashboard
                </v-btn>
              </v-col>
              <v-col cols="auto" class="mx-2">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-arrow-left"
                  @click="goBack"
                >
                  Go Back
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
