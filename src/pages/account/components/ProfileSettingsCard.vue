<script setup lang="ts">
import { useDisplay } from 'vuetify'
import AvatarUploader from './AvatarUploader.vue'
import { requiredRule } from '@/utils/formRules'

interface ProfileFields {
  fullName: string
  phone: string
}

interface Props {
  profile: ProfileFields
  email: string
  initials: string
  avatarPreview: string | null
  avatarFileName: string | null
  loading: boolean
  saving: boolean
  dirty: boolean
  canSave: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'reset'): void
  (e: 'select-avatar', file: File): void
  (e: 'clear-avatar'): void
}>()

const { mobile } = useDisplay()
</script>

<template>
  <v-card rounded="lg" variant="outlined">
    <div class="d-flex align-center ga-3 px-5 py-4 section-strip">
      <v-icon icon="mdi-account-circle-outline" size="20" color="primary" />
      <div>
        <h2 class="text-subtitle-1 font-weight-bold">Profile</h2>
        <p class="text-caption text-medium-emphasis mb-0">
          How your name and photo appear across the app
        </p>
      </div>
    </div>

    <v-card-text :class="mobile ? 'pa-4' : 'pa-5'">
      <AvatarUploader
        :initials="initials"
        :preview-url="avatarPreview"
        :file-name="avatarFileName"
        :disabled="saving || loading"
        @select="(file) => emit('select-avatar', file)"
        @clear="emit('clear-avatar')"
      />

      <v-divider class="my-5" />

      <v-form @submit.prevent="emit('save')">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profile.fullName"
              label="Full name"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-outline"
              :rules="[requiredRule]"
              :loading="loading"
              :disabled="saving || loading"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="profile.phone"
              label="Phone number"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-phone-outline"
              placeholder="Optional"
              :loading="loading"
              :disabled="saving || loading"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              :model-value="email"
              label="Email address"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              append-inner-icon="mdi-lock-outline"
              readonly
              disabled
              hint="Email is tied to your sign-in and cannot be changed here"
              persistent-hint
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-5 py-3">
      <span class="text-caption text-medium-emphasis">
        {{ dirty ? 'Unsaved changes' : 'All changes saved' }}
      </span>
      <v-spacer />
      <v-btn
        variant="text"
        size="small"
        :disabled="!dirty || saving || loading"
        @click="emit('reset')"
      >
        Discard
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        :loading="saving"
        :disabled="!canSave"
        @click="emit('save')"
      >
        Save profile
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
