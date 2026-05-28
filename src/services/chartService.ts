import { supabase } from '@/lib/supabase'

export type InspectionChartPoint = {
  date: string
  count: number
}

type ChartQueryOptions = {
  startDate?: string
  endDate?: string
}

const SITE_TABLE_CANDIDATES = ['siteinspection', 'siteInspection', 'siteinspections']
const FINAL_TABLE_CANDIDATES = ['finalinspection', 'finalInspection', 'finalinspections']
const ANNUAL_TABLE_CANDIDATES = ['annualinspection', 'annualInspection', 'annualinspections']

function normalizeDate(value: unknown): string {
  if (typeof value !== 'string') return ''
  if (!value.includes('T')) return value
  return value.split('T')[0] ?? ''
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

async function queryTable(
  tableName: string,
  options: ChartQueryOptions,
  columns: string[] = ['date'],
) {
  const selectColumns = columns.join(',')
  let query = supabase.from(tableName).select(selectColumns).order('date', { ascending: true })

  if (options.startDate) query = query.gte('date', options.startDate)
  if (options.endDate) query = query.lte('date', options.endDate)

  return await query
}

export async function fetchSiteInspectionChartData(
  options: ChartQueryOptions = {},
): Promise<InspectionChartPoint[]> {
  return fetchSiteInspectionValueSum(
    SITE_TABLE_CANDIDATES,
    options,
    'siteInspections',
    'Failed to load site inspection data.',
  )
}

export async function fetchFinalInspectionChartData(
  options: ChartQueryOptions = {},
): Promise<InspectionChartPoint[]> {
  return fetchFinalInspectionValueSum(
    FINAL_TABLE_CANDIDATES,
    options,
    'finalInspection',
    'Failed to load final inspection data.',
  )
}

export async function fetchAnnualInspectionChartData(
  options: ChartQueryOptions = {},
): Promise<InspectionChartPoint[]> {
  return fetchAnnualInspectionValueSum(
    ANNUAL_TABLE_CANDIDATES,
    options,
    'annualInspection',
    'Failed to load annual inspection data.',
  )
}

async function fetchAnnualInspectionValueSum(
  tables: string[],
  options: ChartQueryOptions,
  valueColumn: string,
  defaultErrorMessage: string,
): Promise<InspectionChartPoint[]> {
  let lastError: Error | null = null

  for (const table of tables) {
    const { data, error } = await queryTable(table, options, ['date', valueColumn])

    if (error) {
      lastError = new Error(error.message)
      const message = error.message.toLowerCase()
      if (
        message.includes('relation') ||
        message.includes('does not exist') ||
        message.includes('column') ||
        message.includes('could not find the table') ||
        message.includes('schema cache')
      ) {
        continue
      }
      throw lastError
    }

    const counts = new Map<string, number>()
    for (const row of data ?? []) {
      if (!row || typeof row !== 'object') continue
      const record = row as Record<string, unknown>
      const date = normalizeDate(record.date)
      if (!date) continue
      const value = toNumber(record[valueColumn])
      counts.set(date, (counts.get(date) ?? 0) + value)
    }

    return Array.from(counts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  throw lastError ?? new Error(defaultErrorMessage)
}

async function fetchSiteInspectionValueSum(
  tables: string[],
  options: ChartQueryOptions,
  valueColumn: string,
  defaultErrorMessage: string,
): Promise<InspectionChartPoint[]> {
  let lastError: Error | null = null

  for (const table of tables) {
    const { data, error } = await queryTable(table, options, ['date', valueColumn])

    if (error) {
      lastError = new Error(error.message)
      const message = error.message.toLowerCase()
      if (
        message.includes('relation') ||
        message.includes('does not exist') ||
        message.includes('column') ||
        message.includes('could not find the table') ||
        message.includes('schema cache')
      ) {
        continue
      }
      throw lastError
    }

    const counts = new Map<string, number>()
    for (const row of data ?? []) {
      if (!row || typeof row !== 'object') continue
      const record = row as Record<string, unknown>
      const date = normalizeDate(record.date)
      if (!date) continue
      const value = toNumber(record[valueColumn])
      counts.set(date, (counts.get(date) ?? 0) + value)
    }

    return Array.from(counts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  throw lastError ?? new Error(defaultErrorMessage)
}

async function fetchFinalInspectionValueSum(
  tables: string[],
  options: ChartQueryOptions,
  valueColumn: string,
  defaultErrorMessage: string,
): Promise<InspectionChartPoint[]> {
  let lastError: Error | null = null

  for (const table of tables) {
    const { data, error } = await queryTable(table, options, ['date', valueColumn])

    if (error) {
      lastError = new Error(error.message)
      const message = error.message.toLowerCase()
      if (
        message.includes('relation') ||
        message.includes('does not exist') ||
        message.includes('column') ||
        message.includes('could not find the table') ||
        message.includes('schema cache')
      ) {
        continue
      }
      throw lastError
    }

    const counts = new Map<string, number>()
    for (const row of data ?? []) {
      if (!row || typeof row !== 'object') continue
      const record = row as Record<string, unknown>
      const date = normalizeDate(record.date)
      if (!date) continue
      const value = toNumber(record[valueColumn])
      counts.set(date, (counts.get(date) ?? 0) + value)
    }

    return Array.from(counts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  throw lastError ?? new Error(defaultErrorMessage)
}
