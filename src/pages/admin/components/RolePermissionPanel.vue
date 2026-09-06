<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { RoleWithPages } from '@/stores/roles'
import { isProtectedRole } from '@/utils/roles'
import { formatDate } from '@/utils/dateFormats'
import {
  getNavigationWithSelection,
  isSelectableNavigationItem,
  selectableLeaves,
  permissionKeyOf,
  type SelectableNavigationChild,
  type SelectableNavigationGroup,
} from '../composables/rolePermissionTree'

interface Props {
  role: RoleWithPages
  title: string
  permissions: string[]
  totalPages: number
  permissionsLoading: boolean
  saving: boolean
  dirty: boolean
  canSave: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'toggle', permission: string, selected: boolean): void
  (e: 'toggle-many', permissions: string[], selected: boolean): void
  (e: 'save'): void
  (e: 'reset'): void
  (e: 'delete'): void
  (e: 'back'): void
}>()

const { mobile } = useDisplay()

const titleModel = computed({
  get: () => props.title,
  set: (value: string) => emit('update:title', value),
})

const isSystemRole = computed(() => isProtectedRole(props.role))

const groups = computed(() => getNavigationWithSelection(props.permissions))

const grantedCount = computed(() => props.permissions.length)

const coverage = computed(() =>
  props.totalPages === 0 ? 0 : Math.round((grantedCount.value / props.totalPages) * 100),
)

function leavesOf(group: SelectableNavigationGroup) {
  return selectableLeaves(group.children)
}

function selectedCountOf(group: SelectableNavigationGroup) {
  return leavesOf(group).filter((leaf) => leaf.selected).length
}

function isGroupFull(group: SelectableNavigationGroup) {
  const leaves = leavesOf(group)
  return leaves.length > 0 && leaves.every((leaf) => leaf.selected)
}

function isGroupPartial(group: SelectableNavigationGroup) {
  const count = selectedCountOf(group)
  return count > 0 && count < leavesOf(group).length
}

function toggleGroup(group: SelectableNavigationGroup, selected: boolean) {
  emit(
    'toggle-many',
    leavesOf(group).map((leaf) => permissionKeyOf(leaf)),
    selected,
  )
}

function toggleSubGroup(child: SelectableNavigationChild, selected: boolean) {
  if (isSelectableNavigationItem(child)) return
  emit(
    'toggle-many',
    selectableLeaves(child.children).map((leaf) => permissionKeyOf(leaf)),
    selected,
  )
}

function subGroupLeaves(child: SelectableNavigationChild) {
  return isSelectableNavigationItem(child) ? [] : selectableLeaves(child.children)
}

function isSubGroupFull(child: SelectableNavigationChild) {
  const leaves = subGroupLeaves(child)
  return leaves.length > 0 && leaves.every((leaf) => leaf.selected)
}

function isSubGroupPartial(child: SelectableNavigationChild) {
  const leaves = subGroupLeaves(child)
  const count = leaves.filter((leaf) => leaf.selected).length
  return count > 0 && count < leaves.length
}
</script>

<template>
  <div>
    <div class="d-flex align-start ga-3 mb-1">
      <v-btn
        v-if="mobile"
        icon="mdi-arrow-left"
        variant="text"
        density="comfortable"
        @click="emit('back')"
      />
      <div class="flex-grow-1 min-width-0">
        <div class="d-flex align-center ga-2 flex-wrap">
          <h2 class="text-h5 font-weight-bold text-truncate">
            {{ role.title || 'Untitled role' }}
          </h2>
          <v-chip
            v-if="isSystemRole"
            size="small"
            color="warning"
            variant="tonal"
            prepend-icon="mdi-shield-lock-outline"
          >
            System
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ grantedCount }} of {{ totalPages }} pages · created
          {{ formatDate(role.created_at) }}
        </p>
      </div>

      <v-btn
        v-if="!isSystemRole"
        icon
        variant="text"
        color="error"
        density="comfortable"
        :disabled="saving"
        @click="emit('delete')"
      >
        <v-icon icon="mdi-trash-can-outline" />
        <v-tooltip activator="parent" location="bottom">Delete this role</v-tooltip>
      </v-btn>
    </div>

    <v-progress-linear :model-value="coverage" color="primary" height="4" rounded class="mb-6" />

    <v-text-field
      v-if="!isSystemRole"
      v-model="titleModel"
      label="Role title"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-tag-outline"
      :disabled="saving"
      class="mb-6"
      :style="mobile ? '' : 'max-width: 420px'"
    />
    <v-alert
      v-else
      type="info"
      variant="tonal"
      density="compact"
      icon="mdi-shield-lock-outline"
      class="mb-6"
    >
      System role titles are fixed, but their page access can still be changed.
    </v-alert>

    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-subtitle-1 font-weight-bold">Page access</h3>
      <span class="text-caption text-medium-emphasis">
        Grants apply the next time this role signs in
      </span>
    </div>

    <div v-if="permissionsLoading" class="py-10 text-center">
      <v-progress-circular indeterminate color="primary" size="32" width="3" />
      <p class="text-body-2 text-medium-emphasis mt-3 mb-0">Loading page access…</p>
    </div>

    <div v-else class="d-flex flex-column ga-3">
      <v-sheet v-for="group in groups" :key="group.title" rounded="lg" class="group-sheet">
        <div class="d-flex align-center ga-3 px-4 py-3 group-strip">
          <v-checkbox
            :model-value="isGroupFull(group)"
            :indeterminate="isGroupPartial(group)"
            :disabled="saving"
            hide-details
            density="compact"
            @update:model-value="(value) => toggleGroup(group, !!value)"
          />
          <v-icon :icon="group.icon" size="20" />
          <span class="text-body-2 font-weight-bold flex-grow-1">{{ group.title }}</span>
          <span class="text-caption text-medium-emphasis">
            {{ selectedCountOf(group) }}/{{ leavesOf(group).length }}
          </span>
        </div>

        <div class="px-2 pb-2">
          <template v-for="child in group.children" :key="child.title">
            <label
              v-if="isSelectableNavigationItem(child)"
              class="d-flex align-center ga-3 px-2 py-2 rounded permission-row"
              :class="{ 'permission-row--on': child.selected }"
            >
              <v-checkbox
                :model-value="child.selected"
                :disabled="saving"
                hide-details
                density="compact"
                @update:model-value="(value) => emit('toggle', permissionKeyOf(child), !!value)"
              />
              <v-icon :icon="child.icon" size="18" class="text-medium-emphasis" />
              <span class="text-body-2 flex-grow-1">{{ child.title }}</span>
              <code class="text-caption text-medium-emphasis d-none d-sm-block">
                {{ child.route }}
              </code>
            </label>

            <label
              v-else
              class="d-flex align-center ga-3 px-2 py-2 rounded permission-row"
              :class="{ 'permission-row--on': isSubGroupFull(child) }"
            >
              <v-checkbox
                :model-value="isSubGroupFull(child)"
                :indeterminate="isSubGroupPartial(child)"
                :disabled="saving"
                hide-details
                density="compact"
                @update:model-value="(value) => toggleSubGroup(child, !!value)"
              />
              <v-icon :icon="child.icon" size="18" class="text-medium-emphasis" />
              <span class="text-body-2 font-weight-medium flex-grow-1">{{ child.title }}</span>
              <span class="text-caption text-medium-emphasis">
                {{ subGroupLeaves(child).length }} pages
              </span>
            </label>
          </template>
        </div>
      </v-sheet>
    </div>

    <v-divider class="my-6" />

    <div class="d-flex align-center ga-3" :class="mobile ? 'flex-column-reverse' : ''">
      <span v-if="!mobile" class="text-caption text-medium-emphasis">
        {{ dirty ? 'Unsaved changes' : 'All changes saved' }}
      </span>
      <v-spacer v-if="!mobile" />
      <v-btn variant="text" :block="mobile" :disabled="!dirty || saving" @click="emit('reset')">
        Discard
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        :block="mobile"
        :loading="saving"
        :disabled="!canSave"
        @click="emit('save')"
      >
        Save changes
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.min-width-0 {
  min-width: 0;
}

.group-sheet {
  border: 1px solid rgba(var(--v-theme-outline), 0.4);
  overflow: hidden;
}

.group-strip {
  background-color: rgb(var(--v-theme-surface-container));
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.4);
}

.permission-row {
  cursor: pointer;
  border-left: 3px solid transparent;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.permission-row:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.permission-row--on {
  border-left-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>
