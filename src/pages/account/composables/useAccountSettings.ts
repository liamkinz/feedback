import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import {
  getCurrentUser,
  updateProfile,
  changePassword as changePasswordRequest,
} from '@/services/authService'
import { getEmailInitials, getErrorMessage } from '@/utils/helpers'
import { passwordChecks, passwordRule } from '@/utils/formRules'
import { useToast } from 'vue-toastification'

interface ProfileFields {
  fullName: string
  phone: string
}

export const avatarMaxBytes = 2 * 1024 * 1024

export function useAccountSettings() {
  const authStore = useAuthStore()
  const toast = useToast()

  const profile = ref<ProfileFields>({ fullName: '', phone: '' })
  const savedProfile = ref<ProfileFields>({ fullName: '', phone: '' })
  const email = ref('')

  const passwordForm = ref({ newPassword: '', confirmPassword: '' })

  const loading = ref(false)
  const savingProfile = ref(false)
  const changingPassword = ref(false)

  // Kept in state rather than only toasted. A toast disappears and leaves the
  // form sitting there empty with no explanation and no way to try again.
  const loadError = ref<string | null>(null)

  // The avatar is preview-only: the chosen file becomes an object URL and
  // never leaves the browser. To make it real, upload it to a Supabase
  // Storage bucket here and save the public URL on user_metadata.avatar_url.
  const avatarPreview = ref<string | null>(null)
  const avatarFileName = ref<string | null>(null)

  const userEmail = computed(() => authStore.user?.email || email.value)
  const initials = computed(() => getEmailInitials(userEmail.value))

  const displayName = computed(
    () => profile.value.fullName.trim() || authStore.userName || userEmail.value || 'User',
  )

  const isProfileDirty = computed(
    () =>
      profile.value.fullName !== savedProfile.value.fullName ||
      profile.value.phone !== savedProfile.value.phone,
  )

  // Saving is blocked until the profile has actually loaded. Otherwise an
  // in-flight load can land after a save and show stale values as saved, and a
  // failed load would let an empty form overwrite the real profile.
  const canSaveProfile = computed(
    () =>
      isProfileDirty.value &&
      profile.value.fullName.trim().length > 0 &&
      !savingProfile.value &&
      !loading.value &&
      loadError.value === null,
  )

  // Shares passwordChecks() with passwordRule, so the checklist and the field
  // validator can never disagree about what counts as a valid password.
  const requirements = computed(() => passwordChecks(passwordForm.value.newPassword))

  const passwordsMatch = computed(
    () =>
      passwordForm.value.newPassword.length > 0 &&
      passwordForm.value.newPassword === passwordForm.value.confirmPassword,
  )

  const canChangePassword = computed(
    () =>
      passwordsMatch.value &&
      passwordRule(passwordForm.value.newPassword) === true &&
      !changingPassword.value,
  )

  async function loadProfile() {
    loading.value = true
    loadError.value = null

    try {
      const result = await getCurrentUser()

      if (!result.ok) {
        loadError.value = result.error
        return
      }

      savedProfile.value = {
        fullName: result.data.name,
        phone: result.data.phone,
      }
      profile.value = { ...savedProfile.value }
      email.value = result.data.email
    } finally {
      loading.value = false
    }
  }

  function resetProfile() {
    profile.value = { ...savedProfile.value }
  }

  async function saveProfile() {
    if (!canSaveProfile.value) return

    savingProfile.value = true
    try {
      const result = await updateProfile({
        name: profile.value.fullName.trim(),
        phone: profile.value.phone.trim(),
      })

      if (!result.ok) {
        toast.error('Failed to update profile: ' + getErrorMessage(result.error))
        return
      }

      if (authStore.user) authStore.user.name = profile.value.fullName.trim()
      savedProfile.value = { ...profile.value }
      toast.success('Profile updated')
    } finally {
      savingProfile.value = false
    }
  }

  async function changePassword() {
    if (!canChangePassword.value) return

    changingPassword.value = true
    try {
      const result = await changePasswordRequest(passwordForm.value.newPassword)

      if (!result.ok) {
        toast.error('Failed to change password: ' + getErrorMessage(result.error))
        return
      }

      passwordForm.value = { newPassword: '', confirmPassword: '' }
      toast.success('Password changed')
    } finally {
      changingPassword.value = false
    }
  }

  function releasePreview() {
    if (avatarPreview.value) {
      URL.revokeObjectURL(avatarPreview.value)
      avatarPreview.value = null
    }
  }

  function selectAvatar(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file')
      return
    }

    if (file.size > avatarMaxBytes) {
      toast.error('Image must be smaller than 2 MB')
      return
    }

    releasePreview()
    avatarPreview.value = URL.createObjectURL(file)
    avatarFileName.value = file.name
  }

  function clearAvatar() {
    releasePreview()
    avatarFileName.value = null
  }

  onMounted(loadProfile)

  // Object URLs stay in memory until revoked, so drop the preview with the page.
  onUnmounted(releasePreview)

  return {
    profile,
    email: userEmail,
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
  }
}
