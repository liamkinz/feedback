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
import {
  saveLocalAnnualInspection,
  syncAnnualInspectionsPending,
  getUnsyncedAnnualInspectionCount,
} from '@/services/annualInspectionService'
import type { SurveyState } from '@/pages/siteinspection/types/siteinspection.type'
import type { SurveyState as FinalInspection } from '@/pages/finalinspection/types/finalInspection.types'
import type { SurveyState as AnnualInspection } from '@/pages/annualinspection/types/annualInspection.types'

// ── Toast Type ─────────────────────────────────────────────────
interface Toast {
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
}

export function useFeedback() {
  const isSyncing = ref(false)
  const isSyncingFinalInspections = ref(false)
  const isSyncingAnnualInspections = ref(false)
  const unsyncedCount = ref(0)
  const unsyncedFinalInspectionCount = ref(0)
  const unsyncedAnnualInspectionCount = ref(0)
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
        await syncFinalInspections()
      } else {
        showToast('Feedback saved locally. Will sync when online.', 'info')
      }
    } catch (error) {
      showToast('Failed to save feedback. Please try again.', 'error')
    }
  }

  const submitAnnualInspection = async (data: AnnualInspection): Promise<void> => {
    try {
      await saveLocalAnnualInspection(data)
      await refreshUnsyncedAnnualInspectionCount()
      showToast('Feedback saved successfully!', 'success')

      if (navigator.onLine) {
        await syncAnnualInspections()
      } else {
        showToast('Feedback saved locally. Will sync when online.', 'info')
      }
    } catch (error) {
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
      showToast('🚀 Starting site inspection sync...', 'info')
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
    if (isSyncingFinalInspections.value) return

    const count = await getUnsyncedFinalInspectionCount()
    if (count === 0) return

    isSyncingFinalInspections.value = true
    syncResult.value = null

    try {
      showToast('🚀 Starting final inspection sync...', 'info')
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
      showToast('❌ Sync error. Please try again.', 'error')
    } finally {
      isSyncingAnnualInspections.value = false
    }
  }

  const syncAnnualInspections = async (): Promise<void> => {
    if (isSyncingAnnualInspections.value) return

    const count = await getUnsyncedAnnualInspectionCount()
    if (count === 0) return

    isSyncingAnnualInspections.value = true
    syncResult.value = null

    try {
      showToast('🚀 Starting annual inspection sync...', 'info')
      const result = await syncAnnualInspectionsPending()
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

      await refreshUnsyncedAnnualInspectionCount()
    } catch (error) {
      showToast('❌ Sync error. Please try again.', 'error')
    } finally {
      isSyncingAnnualInspections.value = false
    }
  }

  // ── Helpers ────────────────────────────────────────────────
  const refreshUnsyncedCount = async (): Promise<void> => {
    unsyncedCount.value = await getUnsyncedCount()
  }

  const refreshUnsyncedFinalInspectionCount = async (): Promise<void> => {
    unsyncedFinalInspectionCount.value = await getUnsyncedFinalInspectionCount()
  }

  const refreshUnsyncedAnnualInspectionCount = async (): Promise<void> => {
    unsyncedAnnualInspectionCount.value = await getUnsyncedAnnualInspectionCount()
  }

  // ── Auto-sync when back online ─────────────────────────────

  const syncAll = async (): Promise<void> => {
    await sync()
    await syncFinalInspections()
    await syncAnnualInspections()
  }

  onMounted(async () => {
    await refreshUnsyncedCount()
    await refreshUnsyncedFinalInspectionCount()
    await refreshUnsyncedAnnualInspectionCount()
    window.addEventListener('online', syncAll)
  })

  onUnmounted(() => {
    window.removeEventListener('online', syncAll)
  })

  return {
    submitSiteInspection,
    submitFinalInspection,
    submitAnnualInspection,
    sync,
    syncFinalInspections,
    syncAnnualInspections,
    isSyncing,
    isSyncingFinalInspections,
    isSyncingAnnualInspections,
    unsyncedCount,
    unsyncedFinalInspectionCount,
    unsyncedAnnualInspectionCount,
    syncResult,
    toast,
  }
}
