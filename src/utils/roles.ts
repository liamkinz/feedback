export type RoleRef = number | { id: number } | null | undefined

export interface RoleOption {
  id: number
  title: string | null
}

// Mirrors the seeded roles in supabase/migrations/0001_roles_and_role_pages.sql
export const superAdminRoleId = 1
export const adminRoleId = 2
export const siteInspectorRoleId = 3
export const viewerRoleId = 4
export const defaultRoleId = viewerRoleId

// These four ship with the app (seeded by the migration) and can't be
// deleted or renamed from the admin UI — change both together if you ever
// change the seed list.
export const protectedRoleIds: number[] = [
  superAdminRoleId,
  adminRoleId,
  siteInspectorRoleId,
  viewerRoleId,
]

const roleColors: Record<number, string> = {
  [superAdminRoleId]: 'red',
  [adminRoleId]: 'blue',
  [siteInspectorRoleId]: 'teal',
  [viewerRoleId]: 'grey',
}

const unknownRoleColor = 'grey'
const unknownRoleTitle = 'Unknown'

export function toRoleId(role: RoleRef): number | null {
  if (role === null || role === undefined) return null
  return typeof role === 'number' ? role : role.id
}

export function isProtectedRole(role: RoleRef): boolean {
  const roleId = toRoleId(role)
  return roleId !== null && protectedRoleIds.includes(roleId)
}

export function roleTitle(role: RoleRef, roles: RoleOption[]): string {
  const roleId = toRoleId(role)
  if (roleId === null) return unknownRoleTitle

  const match = roles.find((option) => option.id === roleId)
  return match?.title || unknownRoleTitle
}

export function roleColor(role: RoleRef): string {
  const roleId = toRoleId(role)
  if (roleId === null) return unknownRoleColor

  return roleColors[roleId] ?? unknownRoleColor
}
