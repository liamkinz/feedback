<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { passwordMinLength, passwordSymbols, type PasswordChecks } from '@/utils/formRules'

interface Props {
  newPassword: string
  confirmPassword: string
  requirements: PasswordChecks
  passwordsMatch: boolean
  changing: boolean
  canChange: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:newPassword', value: string): void
  (e: 'update:confirmPassword', value: string): void
  (e: 'submit'): void
  (e: 'clear'): void
}>()

const { mobile } = useDisplay()

const showPassword = ref(false)

const newPasswordModel = computed({
  get: () => props.newPassword,
  set: (value: string) => emit('update:newPassword', value),
})

const confirmPasswordModel = computed({
  get: () => props.confirmPassword,
  set: (value: string) => emit('update:confirmPassword', value),
})

const checklist = computed(() => [
  {
    key: 'length',
    label: `At least ${passwordMinLength} characters`,
    met: props.requirements.length,
  },
  { key: 'lowercase', label: 'A lowercase letter', met: props.requirements.lowercase },
  { key: 'uppercase', label: 'An uppercase letter', met: props.requirements.uppercase },
  { key: 'number', label: 'A number', met: props.requirements.number },
  { key: 'symbol', label: `A symbol (${passwordSymbols})`, met: props.requirements.symbol },
])

const metCount = computed(() => checklist.value.filter((item) => item.met).length)

const strength = computed(() => (metCount.value / checklist.value.length) * 100)

const strengthColor = computed(() => {
  if (metCount.value <= 2) return 'error'
  if (metCount.value < checklist.value.length) return 'warning'
  return 'success'
})

const confirmError = computed(() => {
  if (!props.confirmPassword) return []
  return props.passwordsMatch ? [] : ['Passwords do not match']
})
</script>

<template>
  <v-card rounded="lg" variant="outlined">
    <div class="d-flex align-center ga-3 px-5 py-4 section-strip">
      <v-icon icon="mdi-lock-outline" size="20" color="primary" />
      <div>
        <h2 class="text-subtitle-1 font-weight-bold">Password</h2>
        <p class="text-caption text-medium-emphasis mb-0">Choose a new password for signing in</p>
      </div>
    </div>

    <v-card-text :class="mobile ? 'pa-4' : 'pa-5'">
      <v-form @submit.prevent="emit('submit')">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="newPasswordModel"
              label="New password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-plus-outline"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              autocomplete="new-password"
              :disabled="changing"
              @click:append-inner="showPassword = !showPassword"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="confirmPasswordModel"
              label="Confirm new password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-check-outline"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :error-messages="confirmError"
              :disabled="changing"
            />
          </v-col>
        </v-row>

        <div class="mt-2">
          <div class="d-flex align-center ga-3 mb-3">
            <v-progress-linear
              :model-value="strength"
              :color="strengthColor"
              height="4"
              rounded
              class="flex-grow-1"
            />
            <span class="text-caption text-medium-emphasis">
              {{ metCount }}/{{ checklist.length }}
            </span>
          </div>

          <v-row dense>
            <v-col v-for="item in checklist" :key="item.key" cols="12" sm="6">
              <div class="d-flex align-center ga-2">
                <v-icon
                  :icon="item.met ? 'mdi-check-circle' : 'mdi-circle-small'"
                  :color="item.met ? 'success' : 'medium-emphasis'"
                  size="18"
                />
                <span
                  class="text-caption"
                  :class="item.met ? 'text-high-emphasis' : 'text-medium-emphasis'"
                >
                  {{ item.label }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-5 py-3">
      <v-spacer />
      <v-btn
        variant="text"
        size="small"
        :disabled="changing || (!newPassword && !confirmPassword)"
        @click="emit('clear')"
      >
        Clear
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        :loading="changing"
        :disabled="!canChange"
        @click="emit('submit')"
      >
        Update password
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.section-strip {
  background-color: rgb(var(--v-theme-surface-container));
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.35);
}
</style>
