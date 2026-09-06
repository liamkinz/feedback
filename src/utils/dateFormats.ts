/**
 * Date formatting shared by the admin pages. Every date shown to a user
 * should come from here, so a format change happens in one place.
 */

const locale = 'en-US'
const emptyDate = 'N/A'

/** Date with time — "Mar 4, 2026, 02:30 PM". */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return emptyDate

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return emptyDate

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
