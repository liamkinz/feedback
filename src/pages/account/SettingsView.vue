<script setup lang="ts">
import { useDisplay } from 'vuetify'
import AppShellLayout from '@/layouts/AppShellLayout.vue'
import ProfileSettingsCard from './components/ProfileSettingsCard.vue'
import SecuritySettingsCard from './components/SecuritySettingsCard.vue'
import { useAccountSettings } from './composables/useAccountSettings'

const {
  profile,
  email,
  passwordForm,
  loading,
  loadError,
  savingProfile,
  changingPassword,
  avatarPreview,
  avatarFileName,
  initials,
  displayName,
  isProfileDirty,
  canSaveProfile,
  requirements,
  passwordsMatch,
  canChangePassword,
  loadProfile,
  resetProfile,
  saveProfile,
  changePassword,
  selectAvatar,
  clearAvatar,
} = useAccountSettings()

const { mobile } = useDisplay()

function clearPasswordForm() {
  passwordForm.value = { newPassword: '', confirmPassword: '' }
}
</script>

<template>
  <AppShellLayout>
    <template #content>
      <v-container :class="mobile ? 'pa-3' : 'pa-6'" class="settings-column">
        <div class="mb-6">
          <p class="text-overline text-medium-emphasis mb-0">Your account</p>
          <h1 class="font-weight-bold" :class="mobile ? 'text-h6' : 'text-h5'">Settings</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">Signed in as {{ displayName }}</p>
        </div>

        <div class="d-flex flex-column ga-5">
          <!-- The profile card is withheld on a load failure rather than shown
               empty: an empty form here would look like a profile with no name,
               and saving it would overwrite the real one. -->
          <v-alert
            v-if="loadError"
            type="error"
            variant="tonal"
            rounded="lg"
            title="Couldn't load your profile"
          >
            <p class="text-body-2 mb-3">{{ loadError }}</p>
            <v-btn
              color="error"
              variant="flat"
              size="small"
              :loading="loading"
              @click="loadProfile"
            >
              Try again
            </v-btn>
          </v-alert>

          <ProfileSettingsCard
            v-else
            :profile="profile"
            :email="email"
            :initials="initials"
            :avatar-preview="avatarPreview"
            :avatar-file-name="avatarFileName"
            :loading="loading"
            :saving="savingProfile"
            :dirty="isProfileDirty"
            :can-save="canSaveProfile"
            @save="saveProfile"
            @reset="resetProfile"
            @select-avatar="selectAvatar"
            @clear-avatar="clearAvatar"
          />

          <SecuritySettingsCard
            v-model:new-password="passwordForm.newPassword"
            v-model:confirm-password="passwordForm.confirmPassword"
            :requirements="requirements"
            :passwords-match="passwordsMatch"
            :changing="changingPassword"
            :can-change="canChangePassword"
            @submit="changePassword"
            @clear="clearPasswordForm"
          />
        </div>
      </v-container>
    </template>
  </AppShellLayout>
</template>

<style scoped>
.settings-column {
  max-width: 880px;
}
</style>
