<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore, type AdminUserData } from '@/stores/authStore'
import { useUserRolesStore } from '@/stores/roles'
import { useDisplay } from 'vuetify'
import { useToast } from 'vue-toastification'
import DeleteUserDialog from '@/pages/admin/components/dialogs/DeleteUserDialog.vue'
import EditUserDialog from '@/pages/admin/components/dialogs/EditUserDialog.vue'
import UserDetailsDialog from '@/pages/admin/components/dialogs/UserDetailsDialog.vue'

import { getErrorMessage } from '@/utils/helpers'
import { formatDate } from '@/utils/dateFormats'
import { roleTitle, roleColor } from '@/utils/roles'

const authStore = useAuthStore()
const rolesStore = useUserRolesStore()
const { mobile } = useDisplay()
const toast = useToast()

const loading = ref(false)
const search = ref('')
const userDialog = ref(false)
const editDialog = ref(false)
const selectedUser = ref<AdminUserData | null>(null)
const editingUser = ref<AdminUserData | null>(null)
const deleteDialog = ref(false)
const userToDelete = ref<AdminUserData | null>(null)

const filteredUsers = computed(() => {
  if (!authStore.users) return []
  if (!search.value) return authStore.users

  const searchTerm = search.value.toLowerCase()
  return authStore.users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      roleTitle(user.role_id, rolesStore.roles).toLowerCase().includes(searchTerm),
  )
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const result = await authStore.getAllUsers()

    if (result.error) {
      toast.error('Failed to fetch users: ' + getErrorMessage(result.error))
      console.error('Error fetching users:', result.error)
    }
  } finally {
    loading.value = false
  }
}

const viewUser = (user: AdminUserData) => {
  selectedUser.value = user
  userDialog.value = true
}
const editUser = (user: AdminUserData) => {
  editingUser.value = user
  editDialog.value = true
}
const deleteUser = (user: AdminUserData) => {
  userToDelete.value = user
  deleteDialog.value = true
}

onMounted(async () => {
  await rolesStore.fetchRoles()
  await fetchUsers()
})

const userTableHeaders = [
  { title: 'User', key: 'full_name', sortable: true },
  { title: 'Role', key: 'role_id', sortable: true },
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<template>
  <v-container fluid :class="mobile ? 'pa-0' : 'pa-2'">
    <div class="d-flex align-center ga-4 mb-6">
      <v-avatar color="primary" variant="tonal" rounded="lg" :size="mobile ? 44 : 52">
        <v-icon icon="mdi-account-multiple-outline" :size="mobile ? 22 : 26" />
      </v-avatar>
      <div>
        <h1 class="font-weight-bold" :class="mobile ? 'text-h6' : 'text-h5'">User Management</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">Manage all system users</p>
      </div>
      <v-spacer v-if="!mobile" />
      <v-chip v-if="!mobile" variant="tonal" color="secondary" size="small">
        {{ filteredUsers.length }} {{ filteredUsers.length === 1 ? 'user' : 'users' }}
      </v-chip>
    </div>

    <v-card rounded="xl">
      <v-card-text :class="mobile ? 'pa-4' : 'pa-5'">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search users..."
          single-line
          clearable
          class="mb-4"
          :style="mobile ? '' : 'max-width: 360px'"
        />

        <div v-if="loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" size="48" width="3" />
          <p class="text-body-1 font-weight-medium mt-4">Loading users…</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="text-center pa-8">
          <v-avatar color="surface-container" rounded="lg" size="56" class="mb-3">
            <v-icon icon="mdi-account-off-outline" color="on-surface-variant" size="28" />
          </v-avatar>
          <p class="text-body-1 font-weight-medium">No users found</p>
          <p class="text-body-2 text-medium-emphasis">
            {{
              search
                ? 'No users match your search criteria.'
                : 'There are no users in the system yet.'
            }}
          </p>
        </div>

        <v-data-table
          v-if="!mobile && filteredUsers.length > 0"
          :headers="userTableHeaders"
          :items="filteredUsers"
          :search="search"
          item-value="id"
          hide-default-footer
          items-per-page="-1"
          loading-text="Loading users..."
          no-data-text="No users found."
        >
          <template v-slot:item.full_name="{ item }">
            <div class="d-flex align-center">
              <v-avatar :color="roleColor(item.role_id)" variant="tonal" size="36" class="me-3">
                <v-icon size="small">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">
                  {{ item.full_name || 'Unknown User' }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ item.email }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.role_id="{ item }">
            <v-chip :color="roleColor(item.role_id)" variant="tonal" size="small">
              {{ roleTitle(item.role_id, rolesStore.roles) }}
            </v-chip>
          </template>

          <template v-slot:item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon variant="text" size="small" title="View" @click="viewUser(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              title="Edit"
              @click="editUser(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="error"
              title="Delete"
              @click="deleteUser(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <div v-else-if="mobile && filteredUsers.length > 0">
          <v-card v-for="user in filteredUsers" :key="user.id" class="user-card mb-3" rounded="lg">
            <v-card-item>
              <template #prepend>
                <v-avatar :color="roleColor(user.role_id)" variant="tonal" size="40">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-card-title class="text-subtitle-1 text-truncate">
                {{ user.full_name || 'Unknown User' }}
              </v-card-title>
              <v-card-subtitle class="text-truncate">{{ user.email }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="pt-0">
              <v-chip :color="roleColor(user.role_id)" variant="tonal" size="small" class="mb-2">
                {{ roleTitle(user.role_id, rolesStore.roles) }}
              </v-chip>
              <div class="d-flex align-center">
                <v-icon size="16" color="on-surface-variant" class="me-2">mdi-calendar</v-icon>
                <span class="text-body-2 text-medium-emphasis">
                  Created {{ formatDate(user.created_at) }}
                </span>
              </div>
            </v-card-text>

            <v-card-actions class="pt-0">
              <v-btn variant="text" size="small" prepend-icon="mdi-eye" @click="viewUser(user)">
                View
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                color="primary"
                prepend-icon="mdi-pencil"
                @click="editUser(user)"
              >
                Edit
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                color="error"
                prepend-icon="mdi-delete"
                @click="deleteUser(user)"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>

      <UserDetailsDialog v-model="userDialog" :user="selectedUser" />
      <EditUserDialog v-model="editDialog" :user="editingUser" @user-updated="fetchUsers" />
      <DeleteUserDialog v-model="deleteDialog" :user="userToDelete" />
    </v-card>
  </v-container>
</template>

<style scoped>
.user-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-on-surface), 0.1) !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.v-table thead tr th) {
  background: rgb(var(--v-theme-surface-container)) !important;
  padding: 12px 16px !important;
  letter-spacing: 0.04em;
}
:deep(.v-table tbody tr td) {
  padding: 10px 7px !important;
  vertical-align: middle;
}
</style>
