<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateHome = () => {
  router.push('/')
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
            <v-icon size="120" color="primary" class="mb-4"> mdi-file-question-outline </v-icon>

            <div class="text-h1 font-weight-bold text-primary mb-2">404</div>
            <div class="text-h4 font-weight-light mb-4 text-primary">Page Not Found</div>

            <div class="text-body-1 text-medium-emphasis mb-6">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted,
              or you entered the wrong URL.
            </div>

            <v-alert type="info" variant="tonal" class="mb-6 text-left" icon="mdi-lightbulb-outline">
              <v-alert-title class="text-h6">What you can do:</v-alert-title>
              <ul class="mt-2">
                <li>Check the URL for any typos</li>
                <li>Go back to the previous page</li>
                <li>Visit our homepage to start fresh</li>
              </ul>
            </v-alert>

            <v-row no-gutters justify="center" class="mb-4">
              <v-col cols="auto" class="mx-2">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  prepend-icon="mdi-home"
                  @click="navigateHome"
                >
                  Go Home
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
