<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useAuthStore, type AdminUserData } from '@/stores/authStore'
import { useUserRolesStore } from '@/stores/roles'
import { useToast } from 'vue-toastification'
import { getErrorMessage } from '@/utils/helpers'
import { superAdminRoleId, adminRoleId } from '@/utils/roles'

interface Props {
  user: AdminUserData | null
}

interface Emits {
  (e: 'user-updated', user: AdminUserData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = defineModel<boolean>()

const authStore = useAuthStore()
const rolesStore = useUserRolesStore()
const toast = useToast()

const updating = ref(false)
const form = ref()

const formData = reactive({
  email: '',
  full_name: '',
  role_id: null as number | null,
})

const rules = computed(() => ({
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  ],
  full_name: [
    (v: string) => !!v || 'Full name is required',
    (v: string) => v.length >= 2 || 'Full name must be at least 2 characters',
  ],
  role_id: isCurrentUserAdmin.value ? [(v: number | null) => v !== null || 'Role is required'] : [],
}))

// Only Super Admin may hand out the Super Admin role itself.
const roleOptions = computed(() => {
  return rolesStore.roles
    .filter((role) => role.id !== superAdminRoleId || authStore.userRole === superAdminRoleId)
    .map((role) => ({ title: role.title, value: role.id }))
})

const isCurrentUserAdmin = computed(
  () => authStore.userRole === superAdminRoleId || authStore.userRole === adminRoleId,
)

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.email = newUser.email || ''
      formData.full_name = newUser.full_name || ''
      formData.role_id = newUser.role_id ?? null
    }
  },
  { immediate: true },
)

watch(model, (isOpen) => {
  if (!isOpen) resetForm()
})

function resetForm() {
  form.value?.reset()
  formData.email = ''
  formData.full_name = ''
  formData.role_id = null
}

async function handleSubmit() {
  if (!props.user) return

  const { valid } = await form.value.validate()
  if (!valid) return

  updating.value = true
  try {
    const userMetadata: Record<string, any> = {
      ...props.user.user_metadata,
      full_name: formData.full_name,
    }

    if (isCurrentUserAdmin.value) {
      userMetadata.role = formData.role_id
    }

    const result = await authStore.updateUser(props.user.id, {
      email: formData.email,
      user_metadata: userMetadata,
    })

    if (result.error) {
      toast.error('Failed to update user: ' + getErrorMessage(result.error))
      return
    }

    if (result.user) {
      toast.success('User updated successfully')
      emit('user-updated', result.user)
      model.value = false
    }
  } finally {
    updating.value = false
  }
}

function handleClose() {
  model.value = false
}
</script>

<template>
  <v-dialog v-model="model" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-account-edit</v-icon>
        <span>Edit User</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.email"
                  label="Email Address"
                  prepend-inner-icon="mdi-email"
                  :rules="rules.email"
                  variant="outlined"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.full_name"
                  label="Full Name"
                  prepend-inner-icon="mdi-account"
                  :rules="rules.full_name"
                  variant="outlined"
                  required
                />
              </v-col>

              <v-col v-if="isCurrentUserAdmin" cols="12">
                <v-select
                  v-model="formData.role_id"
                  label="Role"
                  prepend-inner-icon="mdi-shield-account"
                  :items="roleOptions"
                  :rules="rules.role_id"
                  variant="outlined"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-alert v-if="user" type="info" variant="tonal" class="mt-4">
          <div class="font-weight-medium">Current User ID:</div>
          <div class="text-caption">{{ user.id }}</div>
        </v-alert>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn color="grey" variant="text" :disabled="updating" @click="handleClose">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="flat" :loading="updating" @click="handleSubmit">
          Update User
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>
