<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAdminUserRoles } from './composables/adminUserRoles'
import AppShellLayout from '@/layouts/AppShellLayout.vue'
import RolePermissionPanel from './components/RolePermissionPanel.vue'
import CreateRoleDialog from './dialogs/CreateRoleDialog.vue'
import { isProtectedRole } from '@/utils/roles'

const {
  loading,
  error,
  searchQuery,
  selectedRole,
  selectedRoleId,
  draftTitle,
  draftPermissions,
  permissionsLoading,
  saving,
  isCreateOpen,
  filteredRoles,
  isDirty,
  canSave,
  totalPageCount,
  pageCountFor,
  selectRole,
  clearSelection,
  togglePermission,
  setPermissions,
  resetDraft,
  saveSelectedRole,
  createRole,
  deleteSelectedRole,
  refreshRoles,
  clearError,
} = useAdminUserRoles()

const { mobile } = useDisplay()

const isDetailOnMobile = computed(() => mobile.value && selectedRole.value !== null)
const showList = computed(() => !isDetailOnMobile.value)
const showDetail = computed(() => !mobile.value || isDetailOnMobile.value)
</script>

<template>
  <AppShellLayout>
    <template #content>
      <v-container fluid :class="mobile ? 'pa-3' : 'pa-6'">
        <div
          class="d-flex mb-6 ga-4"
          :class="mobile ? 'flex-column' : 'align-center justify-space-between'"
        >
          <div class="d-flex align-center ga-4">
            <v-avatar color="primary" variant="tonal" rounded="lg" :size="mobile ? 44 : 52">
              <v-icon icon="mdi-account-key-outline" :size="mobile ? 22 : 26" />
            </v-avatar>
            <div>
              <h1 class="font-weight-bold" :class="mobile ? 'text-h6' : 'text-h5'">User Roles</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Pick a role to see and change the pages it can open
              </p>
            </div>
          </div>

          <div class="d-flex ga-2" :class="mobile ? 'flex-column' : ''">
            <v-btn
              variant="text"
              prepend-icon="mdi-refresh"
              :block="mobile"
              :loading="loading"
              @click="refreshRoles"
            >
              Refresh
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              :block="mobile"
              @click="isCreateOpen = true"
            >
              New role
            </v-btn>
          </div>
        </div>

        <v-alert v-if="error" type="error" closable class="mb-4" @click:close="clearError">
          {{ error }}
        </v-alert>

        <v-row>
          <v-col v-if="showList" cols="12" md="4" lg="3">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search roles"
              variant="outlined"
              density="comfortable"
              clearable
              single-line
              hide-details
              class="mb-3"
            />

            <div v-if="loading && filteredRoles.length === 0" class="py-8 text-center">
              <v-progress-circular indeterminate color="primary" size="32" width="3" />
            </div>

            <div
              v-else-if="filteredRoles.length === 0 && searchQuery"
              class="py-8 text-center text-medium-emphasis"
            >
              <v-icon icon="mdi-magnify" size="32" class="mb-2" />
              <p class="text-body-2 mb-3">No role matches “{{ searchQuery }}”</p>
              <v-btn size="small" variant="text" @click="searchQuery = ''">Clear search</v-btn>
            </div>

            <div v-else-if="filteredRoles.length === 0" class="py-8 text-center">
              <v-icon icon="mdi-account-key-outline" size="32" class="mb-2 text-medium-emphasis" />
              <p class="text-body-2 text-medium-emphasis mb-3">No roles yet</p>
              <v-btn size="small" color="primary" variant="tonal" @click="isCreateOpen = true">
                Create the first role
              </v-btn>
            </div>

            <v-list v-else class="pa-0 bg-transparent" nav>
              <v-list-item
                v-for="role in filteredRoles"
                :key="role.id"
                class="role-row mb-2 rounded-lg"
                :class="{ 'role-row--active': role.id === selectedRoleId }"
                :active="role.id === selectedRoleId"
                @click="selectRole(role)"
              >
                <div class="d-flex align-center ga-2">
                  <span class="text-body-2 font-weight-medium text-truncate flex-grow-1">
                    {{ role.title || 'Untitled role' }}
                  </span>
                  <v-icon
                    v-if="isProtectedRole(role)"
                    icon="mdi-shield-lock-outline"
                    size="14"
                    color="warning"
                  />
                </div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-progress-linear
                    :model-value="
                      totalPageCount === 0 ? 0 : (pageCountFor(role) / totalPageCount) * 100
                    "
                    color="primary"
                    height="3"
                    rounded
                    class="flex-grow-1"
                  />
                  <span class="text-caption text-medium-emphasis">
                    {{ pageCountFor(role) }}/{{ totalPageCount }}
                  </span>
                </div>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col v-if="showDetail" cols="12" md="8" lg="9">
            <v-card v-if="selectedRole" rounded="lg" variant="outlined">
              <v-card-text :class="mobile ? 'pa-4' : 'pa-6'">
                <RolePermissionPanel
                  :role="selectedRole"
                  :title="draftTitle"
                  :permissions="draftPermissions"
                  :total-pages="totalPageCount"
                  :permissions-loading="permissionsLoading"
                  :saving="saving"
                  :dirty="isDirty"
                  :can-save="canSave"
                  @update:title="(value) => (draftTitle = value)"
                  @toggle="togglePermission"
                  @toggle-many="setPermissions"
                  @save="saveSelectedRole"
                  @reset="resetDraft"
                  @delete="deleteSelectedRole"
                  @back="clearSelection"
                />
              </v-card-text>
            </v-card>

            <div
              v-else
              class="empty-detail d-flex flex-column align-center justify-center rounded-lg"
            >
              <v-avatar color="surface-container" rounded="lg" size="64" class="mb-4">
                <v-icon icon="mdi-gesture-tap-button" color="on-surface-variant" size="32" />
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-1">No role selected</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Choose a role on the left to review its page access.
              </p>
            </div>
          </v-col>
        </v-row>

        <CreateRoleDialog v-model="isCreateOpen" :saving="loading" @create="createRole" />
      </v-container>
    </template>
  </AppShellLayout>
</template>

<style scoped>
.role-row {
  border: 1px solid rgba(var(--v-theme-outline), 0.35);
  border-left: 3px solid transparent;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.role-row:hover {
  border-left-color: rgba(var(--v-theme-primary), 0.4);
}

.role-row--active {
  border-left-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.07);
}

.empty-detail {
  min-height: 320px;
  border: 1px dashed rgba(var(--v-theme-outline), 0.5);
  text-align: center;
  padding: 24px;
}
</style>
