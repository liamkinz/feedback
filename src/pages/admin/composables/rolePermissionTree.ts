import {
  navigationConfig,
  isNavigationItem,
  type NavigationChild,
  type NavigationGroup,
  type NavigationItem,
  type NavigationSubGroup,
} from '@/utils/navigation'

// A child annotated with selection state for the role-permission editor UI.
export type SelectableNavigationChild =
  | (NavigationItem & { selected: boolean })
  | (Omit<NavigationSubGroup, 'children'> & { children: SelectableNavigationChild[] })

export type SelectableNavigationGroup = Omit<NavigationGroup, 'children'> & {
  children: SelectableNavigationChild[]
}

export type SelectableLeaf = NavigationItem & { selected: boolean }

export function isSelectableNavigationItem(
  child: SelectableNavigationChild,
): child is SelectableLeaf {
  return !('children' in child)
}

// Every checkable row under a group, descending into sub-groups.
export function selectableLeaves(children: SelectableNavigationChild[]): SelectableLeaf[] {
  return children.flatMap((child) =>
    isSelectableNavigationItem(child) ? [child] : selectableLeaves(child.children),
  )
}

// role_pages is keyed by route directly — no separate permission string.
export function permissionKeyOf(item: NavigationItem): string {
  return item.route
}

function withSelection(
  children: NavigationChild[],
  grantedRoutes: string[],
): SelectableNavigationChild[] {
  return children.map((child) => {
    if (isNavigationItem(child)) {
      return { ...child, selected: grantedRoutes.includes(child.route) }
    }
    return { ...child, children: withSelection(child.children, grantedRoutes) }
  })
}

// The whole menu tree annotated with which checkboxes the edited role has granted.
export function getNavigationWithSelection(grantedRoutes: string[] = []): SelectableNavigationGroup[] {
  return navigationConfig.map((group) => ({
    ...group,
    children: withSelection(group.children, grantedRoutes),
  }))
}
