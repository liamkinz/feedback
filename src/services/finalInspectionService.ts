import { db } from '../db/database'
import { supabase } from '../lib/supabase'
import type { SurveyState as FinalInspectionSurveyState } from '../pages/finalinspection/types/finalInspection.types'

// ── Local (Dexie) ──────────────────────────────────────────────

export async function saveLocalFinalInspection(data: FinalInspectionSurveyState): Promise<number> {
  return await db.finalInspections.add({
    selectedAnswers: { ...data.selectedAnswers },
    selectedRatings: { ...data.selectedRatings },
    respondentInfo: { ...data.respondentInfo },
    comments: data.comments,
    synced: 0,
    createdAt: new Date().toISOString(),
  })
}

export async function getUnsyncedFinalInspections() {
  return await db.finalInspections.where('synced').equals(0).toArray()
}

export async function getUnsyncedFinalInspectionCount(): Promise<number> {
  return await db.finalInspections.where('synced').equals(0).count()
}

export async function markFinalInspectionAsSynced(id: number): Promise<void> {
  await db.finalInspections.update(id, { synced: 1 })
}

// ── Map to Supabase flat columns ───────────────────────────────

function mapToSupabaseRow(record: any) {
  return {
    age: record.respondentInfo?.age,
    clientType: record.respondentInfo?.clientType,
    contactNumber: record.respondentInfo?.contactNumber,
    date: record.respondentInfo?.date,
    sex: record.respondentInfo?.sex,
    finalInspection: record.respondentInfo?.finalInspection,
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
  const { error } = await supabase.from('finalinspection').insert(mapToSupabaseRow(record))

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Sync Orchestration ─────────────────────────────────────────

export async function syncFinalInspectionsPending(): Promise<{ synced: number; failed: number }> {
  const unsynced = await getUnsyncedFinalInspections()

  let synced = 0
  let failed = 0

  for (const record of unsynced) {
    const { success, error } = await pushToSupabase(record)

    if (success) {
      await markFinalInspectionAsSynced(record.id!)
      synced++
    } else {
      console.error(`Failed to sync record ${record.id}:`, error)
      failed++
    }
  }

  return { synced, failed }
}

export async function getAllLocalFinalInspections() {
  return await db.finalInspections.orderBy('createdAt').reverse().toArray()
}
