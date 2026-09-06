import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUserPermissions } from '@/composables/useUserPermissions'

const storageKey = 'sidebar-collapsed'
export const sidebarExpandedWidth = 280
export const sidebarRailWidth = 76

function readStoredCollapsed(): boolean {
  try {
    return localStorage.getItem(storageKey) === 'true'
  } catch (error) {
    console.warn('Could not read the sidebar preference:', error)
    return false
  }
}

// Module-scope so the drawer and the top bar always agree on the width.
const isCollapsed = ref(readStoredCollapsed())

export function useSidebarState() {
  const { mobile } = useDisplay()
  const { userRoleId } = useUserPermissions()

  const sidebarWidth = computed(() => (isCollapsed.value ? sidebarRailWidth : sidebarExpandedWidth))

  // Sidebar.vue renders its drawer on exactly this condition. It lives here
  // rather than in the component so the layout, top bar and footer can't
  // disagree with the drawer about whether there is a sidebar on screen.
  const isSidebarVisible = computed(
    () => !mobile.value && userRoleId.value !== null && userRoleId.value !== undefined,
  )

  // How far the content, command bar and footer shift right. Zero whenever the
  // drawer isn't rendered, so nothing reserves space for a sidebar that is not
  // there — on mobile, or before a role has loaded.
  const contentOffset = computed(() => (isSidebarVisible.value ? sidebarWidth.value : 0))

  // The drawer remounts on every navigation, so the choice is kept in
  // localStorage instead of component state or it would reset on each page.
  function toggleCollapsed() {
    isCollapsed.value = !isCollapsed.value

    try {
      localStorage.setItem(storageKey, String(isCollapsed.value))
    } catch (error) {
      console.warn('Could not save the sidebar preference:', error)
    }
  }

  return {
    isCollapsed,
    sidebarWidth,
    isSidebarVisible,
    contentOffset,
    toggleCollapsed,
  }
}
