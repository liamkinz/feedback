<script setup lang="ts">
import { computed } from 'vue'
import type { AdminUserData } from '@/stores/authStore'
import { formatDate } from '@/utils/dateFormats'
import { roleColor, roleTitle } from '@/utils/roles'
import { useUserRolesStore } from '@/stores/roles'

interface Props {
  modelValue: boolean
  user: AdminUserData | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rolesStore = useUserRolesStore()

const userRoleTitle = computed(() => roleTitle(props.user?.role_id, rolesStore.roles))

const closeDialog = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card v-if="user" class="pa-4">
      <v-card-title class="d-flex flex-column align-center text-center">
        <v-avatar color="primary" size="80" class="mb-4">
          <v-icon size="50">mdi-account-circle</v-icon>
        </v-avatar>
        <h2 class="text-h5 mb-1">{{ user.full_name || 'User' }}</h2>
        <p class="text-body-2 text-grey">{{ user.email }}</p>
      </v-card-title>

      <v-card-text class="mt-4">
        <v-list density="compact">
          <v-divider class="my-2" />

          <v-list-item prepend-icon="mdi-account-tie">
            <v-list-item-title>Role</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip :color="roleColor(user.role_id)" variant="tonal" size="small">
                {{ userRoleTitle }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item prepend-icon="mdi-calendar-clock">
            <v-list-item-title>Member Since</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(user.created_at) }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions class="mt-4">
        <v-spacer />
        <v-btn color="primary" variant="flat" block @click="closeDialog"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
