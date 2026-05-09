import { ref, onMounted, onUnmounted } from 'vue'
import {
  saveLocalSiteInspection,
  syncAllPending,
  getUnsyncedCount,
} from '@/services/siteInspectionService'
import {
  saveLocalFinalInspection,
  syncFinalInspectionsPending,
  getUnsyncedFinalInspectionCount,
} from '@/services/finalInspectionService'
import type { SurveyState } from '@/pages/siteinspection/types/siteinspection.type'
import type { SurveyState as FinalInspection } from '@/pages/finalinspection/types/finalInspection.types'

// ── Toast Type ─────────────────────────────────────────────────
interface Toast {
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
}

export function useFeedback() {
  const isSyncing = ref(false)
  const isSyncingFinalInspections = ref(false)
  const unsyncedCount = ref(0)
  const syncResult = ref<{ synced: number; failed: number } | null>(null)
  const toast = ref<Toast>({ show: false, message: '', color: 'success' })

  // ── Toast Helper ───────────────────────────────────────────
  const showToast = (message: string, color: Toast['color'] = 'success') => {
    toast.value = { show: true, message, color }
  }

  // ── Save to Dexie ──────────────────────────────────────────
  const submitSiteInspection = async (data: SurveyState): Promise<void> => {
    try {
      await saveLocalSiteInspection(data)
      await refreshUnsyncedCount()

      if (navigator.onLine) {
        await sync()
      } else {
        showToast('Feedback saved locally. Will sync when online.', 'info')
      }
    } catch {
      showToast('Failed to save feedback. Please try again.', 'error')
    }
  }

  const submitFinalInspection = async (data: FinalInspection): Promise<void> => {
    try {
      await saveLocalFinalInspection(data)
      await refreshUnsyncedFinalInspectionCount()
      showToast('Feedback saved successfully!', 'success')

      if (navigator.onLine) {
        console.log('🔄 Online detected, attempting to sync final inspections...')
        await syncFinalInspections()
      } else {
        console.log('📴 Offline - will sync when online')
        showToast('Will sync when online.', 'info')
      }
    } catch (error) {
      console.error('Error saving feedback:', error)
      showToast('Failed to save feedback. Please try again.', 'error')
    }
  }

  // ── Sync Dexie → Supabase ──────────────────────────────────
  const sync = async (): Promise<void> => {
    if (isSyncing.value) return

    const count = await getUnsyncedCount()
    if (count === 0) return

    isSyncing.value = true
    syncResult.value = null

    try {
      const result = await syncAllPending()
      syncResult.value = result

      if (result.failed === 0 && result.synced > 0) {
        showToast(`✅ ${result.synced} record(s) successfully synced to cloud!`, 'success')
      } else if (result.synced > 0 && result.failed > 0) {
        showToast(
          `⚠️ Synced ${result.synced} record(s), but ${result.failed} failed. Try again.`,
          'warning',
        )
      } else {
        showToast('❌ Sync failed. Check your connection and try again.', 'error')
      }

      await refreshUnsyncedCount()
    } catch {
      showToast('❌ Sync error. Please try again.', 'error')
    } finally {
      isSyncing.value = false
    }
  }

  const syncFinalInspections = async (): Promise<void> => {
    if (isSyncingFinalInspections.value) {
      console.log('⏳ Final inspection sync already in progress, skipping...')
      return
    }

    const count = await getUnsyncedFinalInspectionCount()
    console.log(`📊 Unsynced final inspections count: ${count}`)
    if (count === 0) {
      console.log('✅ No final inspection records to sync')
      return
    }

    isSyncingFinalInspections.value = true
    syncResult.value = null

    try {
      console.log('🚀 Starting final inspection sync...')
      const result = await syncFinalInspectionsPending()
      syncResult.value = result

      if (result.failed === 0 && result.synced > 0) {
        showToast(`✅ ${result.synced} record(s) successfully synced to cloud!`, 'success')
      } else if (result.synced > 0 && result.failed > 0) {
        showToast(
          `⚠️ Synced ${result.synced} record(s), but ${result.failed} failed. Try again.`,
          'warning',
        )
      } else {
        showToast('❌ Sync failed. Check your connection and try again.', 'error')
      }

      await refreshUnsyncedFinalInspectionCount()
    } catch (error) {
      console.error('❌ Final inspection sync error:', error)
      showToast('❌ Sync error. Please try again.', 'error')
    } finally {
      isSyncingFinalInspections.value = false
    }
  }

  // ── Helpers ────────────────────────────────────────────────
  const refreshUnsyncedCount = async (): Promise<void> => {
    unsyncedCount.value = await getUnsyncedCount()
  }

  const refreshUnsyncedFinalInspectionCount = async (): Promise<void> => {
    unsyncedCount.value = await getUnsyncedFinalInspectionCount()
  }

  // ── Auto-sync when back online ─────────────────────────────

  const syncAll = async (): Promise<void> => {
    console.log('🌐 Online event detected!')
    console.log('Checking site inspections...')
    await sync()
    console.log('Checking final inspections...')
    await syncFinalInspections()
    console.log('✅ Auto-sync completed')
  }

  onMounted(async () => {
    await refreshUnsyncedCount()
    await refreshUnsyncedFinalInspectionCount()
    console.log('📍 useFeedback mounted, attaching online listener...')
    window.addEventListener('online', syncAll)
  })

  onUnmounted(() => {
    window.removeEventListener('online', syncAll)
  })

  return {
    submitSiteInspection,
    submitFinalInspection,
    sync,
    syncFinalInspections,
    isSyncing,
    isSyncingFinalInspections,
    unsyncedCount,
    syncResult,
    toast,
  }
}
