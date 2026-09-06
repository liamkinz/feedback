/**
 * Small shared helpers used by the auth forms and the shell's user menu.
 */

/** Extracts a readable error message from Supabase/JS errors and plain strings. */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message)
  }
  return 'Unknown error occurred'
}

/** Generates 1-2 uppercase initials from an email address, for avatar display. */
export function getEmailInitials(email: string | null | undefined): string {
  if (!email) return 'U'

  const localPart = email.split('@')[0] ?? email
  const parts = localPart.split(/[._\-\d]+/).filter((part) => part.length > 0)
  const first = parts[0]
  const second = parts[1]

  if (first && second) {
    return (first[0]! + second[0]!).toUpperCase()
  }
  if (first && first.length >= 2) {
    return (first[0]! + first[1]!).toUpperCase()
  }
  if (first && first.length === 1) {
    return first[0]!.toUpperCase()
  }

  return email[0]!.toUpperCase()
}
