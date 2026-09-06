import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserPagesStore } from '@/stores/pages'
import {
  navigationConfig,
  isNavigationItem,
  type NavigationGroup,
  type NavigationChild,
} from '@/utils/navigation'

// Shared by every caller (sidebar, navbar, router guard) so they all see the
// same fetch instead of each querying role_pages separately.
const userAccessiblePages = ref<string[]>([])
const isLoading = ref(false)
let loadedForRoleId: number | null = null
let inFlightRequest: Promise<void> | null = null
// The role the in-flight request was started for. Without it, a request that
// began under a previous role could be handed back to a caller asking about
// the new one, and would then write the old role's pages into shared state.
let inFlightRoleId: number | null = null

export function useUserPermissions() {
  const authStore = useAuthStore()
  const pagesStore = useUserPagesStore()

  const userRoleId = computed(() => authStore.userRole)

  async function loadPages(roleId: number) {
    isLoading.value = true

    try {
      const rolePages = await pagesStore.fetchRolePagesByRoleId(roleId)

      // The role can change while this request is in flight. Discarding the
      // result is the safe outcome — a newer request for the current role is
      // already running, and writing these pages would grant or deny access
      // based on the role the user no longer has.
      if (roleId !== userRoleId.value) return

      userAccessiblePages.value = rolePages.map((rp) => rp.pages).filter((p): p is string => !!p)
      loadedForRoleId = roleId
    } finally {
      // Only the request still being tracked may clear the shared markers, or
      // a superseded request would wipe the newer one's state on its way out.
      if (inFlightRoleId === roleId) {
        isLoading.value = false
        inFlightRequest = null
        inFlightRoleId = null
      }
    }
  }

  function fetchUserAccessiblePages() {
    const roleId = userRoleId.value

    if (!roleId) {
      userAccessiblePages.value = []
      loadedForRoleId = null
      inFlightRequest = null
      inFlightRoleId = null
      isLoading.value = false
      return
    }

    if (loadedForRoleId === roleId) return

    // Reuse an in-flight request only when it is for this same role.
    if (inFlightRequest && inFlightRoleId === roleId) return inFlightRequest

    inFlightRoleId = roleId
    inFlightRequest = loadPages(roleId)
    return inFlightRequest
  }

  function hasAccessToRoute(route: string): boolean {
    if (!userRoleId.value) return false

    // Every signed-in user reaches their own account pages regardless of role.
    if (route.startsWith('/account/')) return true

    return userAccessiblePages.value.includes(route)
  }

  function getFilteredNavigationItems(children: NavigationChild[]): NavigationChild[] {
    return children
      .map((child): NavigationChild | null => {
        if (isNavigationItem(child)) {
          return hasAccessToRoute(child.route) ? child : null
        }
        const filteredItems = child.children.filter((item) => hasAccessToRoute(item.route))
        if (filteredItems.length === 0) return null
        return { ...child, children: filteredItems }
      })
      .filter((child): child is NavigationChild => child !== null)
  }

  function getFilteredNavigationGroups(): NavigationGroup[] {
    if (!userRoleId.value) return []

    return navigationConfig
      .map((group) => ({
        ...group,
        children: getFilteredNavigationItems(group.children),
      }))
      .filter((group) => group.children.length > 0)
  }

  watch(
    () => userRoleId.value,
    (newRoleId) => {
      if (newRoleId) {
        fetchUserAccessiblePages()
      } else {
        userAccessiblePages.value = []
        loadedForRoleId = null
      }
    },
    { immediate: true },
  )

  return {
    userAccessiblePages,
    isLoading,
    userRoleId,
    hasAccessToRoute,
    getFilteredNavigationGroups,
    fetchUserAccessiblePages,
  }
}
