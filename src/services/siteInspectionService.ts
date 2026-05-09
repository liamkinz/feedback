import { db } from '../db/database'
import { supabase } from '../lib/supabase'
import type { SurveyState } from '../pages/siteinspection/types/siteinspection.type'

// ── Local (Dexie) ──────────────────────────────────────────────

export async function saveLocalSiteInspection(data: SurveyState): Promise<number> {
  return await db.siteInspections.add({
    selectedAnswers: { ...data.selectedAnswers },
    selectedRatings: { ...data.selectedRatings },
    respondentInfo: { ...data.respondentInfo },
    comments: data.comments,
    synced: 0,
    createdAt: new Date().toISOString(),
  })
}

export async function getUnsyncedInspections() {
  return await db.siteInspections.where('synced').equals(0).toArray()
}

export async function getUnsyncedCount(): Promise<number> {
  return await db.siteInspections.where('synced').equals(0).count()
}

export async function markAsSynced(id: number): Promise<void> {
  await db.siteInspections.update(id, { synced: 1 })
}

// ── Map to Supabase flat columns ───────────────────────────────

function mapToSupabaseRow(record: any) {
  return {
    age: record.respondentInfo?.age,
    clientType: record.respondentInfo?.clientType,
    contactNumber: record.respondentInfo?.contactNumber,
    date: record.respondentInfo?.date,
    sex: record.respondentInfo?.sex,
    siteInspections: record.respondentInfo?.siteInspections,
    CC1: record.selectedAnswers?.['CC1'] ?? null,
    CC2: record.selectedAnswers?.['CC2'] ?? null,
    CC3: record.selectedAnswers?.['CC3'] ?? null,
    SQD0: record.selectedRatings?.['SQD0'] ?? null,
    SQD1: record.selectedRatings?.['SQD1'] ?? null,
    SQD2: record.selectedRatings?.['SQD2'] ?? null,
    SQD3: record.selectedRatings?.['SQD3'] ?? null,
    SQD4: record.selectedRatings?.['SQD4'] ?? null,
    SQD5: record.selectedRatings?.['SQD5'] ?? null,
    SQD6: record.selectedRatings?.['SQD6'] ?? null,
    SQD7: record.selectedRatings?.['SQD7'] ?? null,
    SQD8: record.selectedRatings?.['SQD8'] ?? null,
    comments: record.comments,
  }
}

// ── Remote (Supabase) ──────────────────────────────────────────

export async function pushToSupabase(record: any): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('siteinspection').insert(mapToSupabaseRow(record))

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Sync Orchestration ─────────────────────────────────────────

export async function syncAllPending(): Promise<{ synced: number; failed: number }> {
  const unsynced = await getUnsyncedInspections()

  let synced = 0
  let failed = 0

  for (const record of unsynced) {
    const { success, error } = await pushToSupabase(record)

    if (success) {
      await markAsSynced(record.id!)
      synced++
    } else {
      console.error(`Failed to sync record ${record.id}:`, error)
      failed++
    }
  }

  return { synced, failed }
}

// Add this to siteInspectionService.ts
export async function getAllLocalInspections() {
  return await db.siteInspections.orderBy('createdAt').reverse().toArray()
}
