export interface NavigationItem {
  title: string
  icon: string
  route: string
  // Extra routes that should still count as "this item is active" for
  // sidebar highlight/expand purposes.
  activeRoutes?: string[]
}

// An optional second level: a group's children can include a labeled
// sub-section instead of only flat leaf items. Not used by feedbacks' own
// nav today, but the ported sidebar/navbar components expect the shape.
export interface NavigationSubGroup {
  title: string
  icon: string
  route?: string
  children: NavigationItem[]
}

export type NavigationChild = NavigationItem | NavigationSubGroup

export function isNavigationItem(child: NavigationChild): child is NavigationItem {
  return !('children' in child)
}

export interface NavigationGroup {
  title: string
  icon: string
  children: NavigationChild[]
}

/**
 * The app's menu, and the set of routes a role can be granted in
 * supabase/migrations/0001_roles_and_role_pages.sql. A route only becomes
 * grantable once it appears here, and the router guard only enforces
 * role-page rules for routes listed here.
 */
export const navigationConfig: NavigationGroup[] = [
  {
    title: 'My Account',
    icon: 'mdi-account',
    children: [
      { title: 'Home', icon: 'mdi-home-outline', route: '/account/home' },
      { title: 'Settings', icon: 'mdi-cog-outline', route: '/account/settings' },
    ],
  },
  {
    title: 'Overview',
    icon: 'mdi-view-dashboard-outline',
    children: [{ title: 'Dashboard', icon: 'mdi-home-outline', route: '/dashboard' }],
  },
  {
    title: 'Inspection Logs',
    icon: 'mdi-clipboard-text-outline',
    children: [
      { title: 'Site Inspection', icon: 'mdi-map-marker-outline', route: '/inspections/site' },
      {
        title: 'Final Inspection',
        icon: 'mdi-clipboard-check-outline',
        route: '/inspections/final',
      },
      {
        title: 'Annual Inspection',
        icon: 'mdi-calendar-check-outline',
        route: '/inspections/annual',
      },
    ],
  },
  {
    title: 'Admin Controls',
    icon: 'mdi-shield-crown-outline',
    children: [
      {
        title: 'User Management',
        icon: 'mdi-account-multiple-outline',
        route: '/admin/user-management',
      },
      { title: 'User Roles', icon: 'mdi-account-key-outline', route: '/admin/user-roles' },
    ],
  },
]

// Recursively collect every leaf NavigationItem out of a children array,
// descending into sub-groups. Used wherever code only cares about the flat
// set of routes, not the visual nesting.
export function flattenNavigationItems(children: NavigationChild[]): NavigationItem[] {
  return children.flatMap((child) =>
    isNavigationItem(child) ? [child] : flattenNavigationItems(child.children),
  )
}

// Every leaf item in the whole config, across all groups. The router guard
// needs the flat set, not the visual nesting.
export function allNavigationItems(): NavigationItem[] {
  return navigationConfig.flatMap((group) => flattenNavigationItems(group.children))
}
