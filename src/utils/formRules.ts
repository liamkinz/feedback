export type RuleResult = string | true

export const passwordMinLength = 8
export const usernameMinLength = 3
export const usernameMaxLength = 20

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
const usernamePattern = /^(?!.*[_.-]{2})[a-zA-Z0-9_.-]+(?<![_.-])$/

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  return false
}

export function requiredRule(value: unknown): RuleResult {
  return isBlank(value) ? 'This field is required' : true
}

export function emailRule(value: string): RuleResult {
  if (isBlank(value)) return true
  return emailPattern.test(String(value).trim()) || 'Enter a valid email address'
}

export function usernameRule(value: string): RuleResult {
  if (isBlank(value)) return true

  const username = String(value).trim()

  if (username.length < usernameMinLength || username.length > usernameMaxLength) {
    return `Username must be ${usernameMinLength}-${usernameMaxLength} characters`
  }

  return (
    usernamePattern.test(username) ||
    'Username may use letters, numbers, dots, dashes and underscores'
  )
}

export const passwordSymbols = '!@#$%&*()'

export interface PasswordChecks {
  length: boolean
  lowercase: boolean
  uppercase: boolean
  number: boolean
  symbol: boolean
}

export function passwordChecks(value: string): PasswordChecks {
  const password = String(value ?? '')

  return {
    length: password.length >= passwordMinLength,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%&*()]/.test(password),
  }
}

export function passwordRule(value: string): RuleResult {
  const checks = passwordChecks(value)

  if (!checks.length) return `Password must be at least ${passwordMinLength} characters`
  if (!checks.lowercase) return 'Password must include a lowercase letter'
  if (!checks.uppercase) return 'Password must include an uppercase letter'
  if (!checks.number) return 'Password must include a number'
  if (!checks.symbol) return `Password must include a symbol (${passwordSymbols})`

  return true
}

export function matchesRule(
  value: string,
  target: string,
  message = 'Values do not match',
): RuleResult {
  return value === target || message
}
