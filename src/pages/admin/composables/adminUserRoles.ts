import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserRolesStore, type RoleWithPages, type UpdateRoleData } from '@/stores/roles'
import { useUserPagesStore } from '@/stores/pages'
import { useAuthStore } from '@/stores/authStore'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { allNavigationItems } from '@/utils/navigation'
import { isProtectedRole } from '@/utils/roles'
import { useToast } from 'vue-toastification'

export function useAdminUserRoles() {
  const userRolesStore = useUserRolesStore()
  const userPagesStore = useUserPagesStore()
  const authStore = useAuthStore()
  const { confirmDialog } = useConfirmDialog()
  const toast = useToast()

  // storeToRefs keeps these reactive — reading them off the store directly
  // would hand the view a one-off copy that never updates.
  const { rolesWithPages, loading, error } = storeToRefs(userRolesStore)

  const searchQuery = ref('')
  const selectedRoleId = ref<number | null>(null)
  const draftTitle = ref('')
  const draftPages = ref<string[]>([])
  const savedPages = ref<string[]>([])
  const permissionsLoading = ref(false)
  const saving = ref(false)
  const isCreateOpen = ref(false)

  const totalPageCount = allNavigationItems().length

  const filteredRoles = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return rolesWithPages.value

    return rolesWithPages.value.filter((role) => role.title?.toLowerCase().includes(query))
  })

  const selectedRole = computed(
    () => rolesWithPages.value.find((role) => role.id === selectedRoleId.value) ?? null,
  )

  // The list shows the draft count for the role being edited, so the number
  // moves as you tick boxes instead of waiting for a save.
  function pageCountFor(role: RoleWithPages): number {
    if (role.id === selectedRoleId.value) return draftPages.value.length
    return role.role_pages?.length ?? 0
  }

  const isDirty = computed(() => {
    if (!selectedRole.value) return false
    if (draftTitle.value.trim() !== (selectedRole.value.title || '')) return true
    if (draftPages.value.length !== savedPages.value.length) return true

    return draftPages.value.some((page) => !savedPages.value.includes(page))
  })

  const canSave = computed(() => {
    if (!selectedRole.value || !isDirty.value || saving.value) return false
    // A system role's title is fixed, so an empty title box must not block
    // its page changes from being saved.
    if (isProtectedRole(selectedRole.value)) return true

    return draftTitle.value.trim().length > 0
  })

  async function selectRole(role: RoleWithPages) {
    selectedRoleId.value = role.id
    draftTitle.value = role.title || ''
    permissionsLoading.value = true

    try {
      const rolePages = await userPagesStore.fetchRolePagesByRoleId(role.id)
      if (selectedRoleId.value !== role.id) return
      const routes = rolePages.map((rolePage) => rolePage.pages).filter(Boolean) as string[]

      savedPages.value = routes
      draftPages.value = [...routes]
    } catch (err) {
      console.error('Failed to load role permissions:', err)
      if (selectedRoleId.value !== role.id) return
      savedPages.value = []
      draftPages.value = []
    } finally {
      if (selectedRoleId.value === role.id) permissionsLoading.value = false
    }
  }

  function clearSelection() {
    selectedRoleId.value = null
    draftTitle.value = ''
    draftPages.value = []
    savedPages.value = []
  }

  function togglePermission(route: string, selected: boolean) {
    const index = draftPages.value.indexOf(route)

    if (selected && index === -1) {
      draftPages.value.push(route)
    } else if (!selected && index > -1) {
      draftPages.value.splice(index, 1)
    }
  }

  function setPermissions(routes: string[], selected: boolean) {
    routes.forEach((route) => togglePermission(route, selected))
  }

  function resetDraft() {
    if (!selectedRole.value) return

    draftTitle.value = selectedRole.value.title || ''
    draftPages.value = [...savedPages.value]
  }

  // The RLS policies on roles/role_pages allow writes only to someone holding
  // /admin/user-roles, so a role that removes it from itself can never edit
  // roles again — the fix would need the Supabase SQL editor.
  function removesOwnRoleEditorAccess(): boolean {
    if (!selectedRole.value || selectedRole.value.id !== authStore.userRole) return false

    return !draftPages.value.includes('/admin/user-roles')
  }

  // Only the pages that actually changed are written. Deleting every row
  // first and re-inserting would leave the role with no pages at all if an
  // insert failed — and for a role-admin role that means losing the RLS
  // grant needed to fix it.
  async function saveRolePages(roleId: number): Promise<boolean> {
    const existingRolePages = await userPagesStore.fetchRolePagesByRoleId(roleId)

    const currentRoutes: string[] = []
    existingRolePages.forEach((rolePage) => {
      if (rolePage.pages) currentRoutes.push(rolePage.pages)
    })

    const routesToAdd = draftPages.value.filter((route) => !currentRoutes.includes(route))
    const routesToRemove = currentRoutes.filter((route) => !draftPages.value.includes(route))

    const removeResult = await userPagesStore.deleteRolePagesByRoutes(roleId, routesToRemove)
    if (removeResult.error) {
      toast.error('Failed to update permissions: ' + removeResult.error)
      return false
    }

    for (const route of routesToAdd) {
      const addResult = await userPagesStore.createRolePage({ role_id: roleId, pages: route }, true)
      if (addResult.error) {
        toast.error('Failed to update permissions: ' + addResult.error)
        return false
      }
    }

    return true
  }
  async function saveSelectedRole() {
    if (!selectedRole.value || !canSave.value) return

    if (removesOwnRoleEditorAccess()) {
      toast.error('You cannot remove User Roles access from your own role.')
      return
    }

    saving.value = true
    const roleId = selectedRole.value.id

    try {
      if (
        !isProtectedRole(selectedRole.value) &&
        draftTitle.value.trim() !== selectedRole.value.title
      ) {
        const updateData: UpdateRoleData = { title: draftTitle.value.trim() }
        const updated = await userRolesStore.updateRole(roleId, updateData, true)
        if (!updated) return
      }

      const saved = await saveRolePages(roleId)
      if (!saved) return

      savedPages.value = [...draftPages.value]
      await refreshRoles()
      toast.success('Role saved')
    } catch (err) {
      console.error('Failed to save role:', err)
      toast.error('Failed to save role')
    } finally {
      saving.value = false
    }
  }

  async function createRole(title: string) {
    const created = await userRolesStore.createRole({ title: title.trim() }, true)
    if (!created) return

    isCreateOpen.value = false
    toast.success('Role created — now choose the pages it can open')

    await refreshRoles()

    const fresh = rolesWithPages.value.find((role) => role.id === created.id)
    if (fresh) await selectRole(fresh)
  }

  async function deleteSelectedRole() {
    const role = selectedRole.value
    if (!role || isProtectedRole(role)) return

    const grantCount = role.role_pages?.length ?? 0
    const confirmed = await confirmDialog(
      `Delete the role "${role.title}"?\n\nThis also removes its ${grantCount} page grants. It cannot be undone.`,
      { title: 'Delete role', confirmText: 'Delete role' },
    )
    if (!confirmed) return

    const success = await userRolesStore.deleteRole(role.id)
    if (!success) return

    clearSelection()
    await refreshRoles()
  }

  async function refreshRoles() {
    await userRolesStore.fetchRolesWithPages()
  }

  onMounted(refreshRoles)

  return {
    rolesWithPages,
    loading,
    error,
    searchQuery,
    selectedRoleId,
    selectedRole,
    draftTitle,
    draftPermissions: draftPages,
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
    clearError: userRolesStore.clearError,
  }
}
