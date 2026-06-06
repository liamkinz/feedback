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
// import { useToast } from '@/composables/useToast'
import { useToast } from 'vue-toastification'
import type { SurveyState } from '@/pages/siteinspection/types/siteinspection.type'
import type { SurveyState as FinalInspection } from '@/pages/finalinspection/types/finalInspection.types'
import type { SurveyState as AnnualInspection } from '@/pages/annualinspection/types/annualInspection.types'

export function useFeedback() {
  const isSyncing = ref(false)
  const isSyncingFinalInspections = ref(false)
  const isSyncingAnnualInspections = ref(false)
  const unsyncedCount = ref(0)
  const unsyncedFinalInspectionCount = ref(0)
  const unsyncedAnnualInspectionCount = ref(0)
  const syncResult = ref<{ synced: number; failed: number } | null>(null)
  const toast = useToast()

  // ── Save to Dexie ──────────────────────────────────────────
  const submitSiteInspection = async (data: SurveyState): Promise<void> => {
    try {
      await saveLocalSiteInspection(data)
      await refreshUnsyncedCount()

      if (navigator.onLine) {
        await sync()
      } else {
        toast.info('Feedback saved locally. Will sync when online.', { timeout: 1000 })
      }
    } catch {
      toast.error('Failed to save feedback. Please try again.')
    }
  }

  const submitFinalInspection = async (data: FinalInspection): Promise<void> => {
    try {
      await saveLocalFinalInspection(data)
      await refreshUnsyncedFinalInspectionCount()
      toast.success('Feedback saved successfully!')

      if (navigator.onLine) {
        await syncFinalInspections()
      } else {
        toast.info('Feedback saved locally. Will sync when online.', { timeout: 1000 })
      }
    } catch (error) {
      toast.error('Failed to save feedback. Please try again.')
    }
  }

  const submitAnnualInspection = async (data: AnnualInspection): Promise<void> => {
    try {
      await saveLocalAnnualInspection(data)
      await refreshUnsyncedAnnualInspectionCount()
      toast.success('Feedback saved successfully!')

      if (navigator.onLine) {
        await syncAnnualInspections()
      } else {
        toast.info('Feedback saved locally. Will sync when online.', { timeout: 1000 })
      }
    } catch (error) {
      toast.error('Failed to save feedback. Please try again.')
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
      toast.info('🚀 Starting site inspection sync...', { timeout: 2000 })
      const result = await syncAllPending()
      syncResult.value = result

      if (result.failed === 0 && result.synced > 0) {
        toast.success(`✅ ${result.synced} record(s) successfully synced to cloud!`)
      } else if (result.synced > 0 && result.failed > 0) {
        toast.warning(
          `⚠️ Synced ${result.synced} record(s), but ${result.failed} failed. Try again.`,
          { timeout: 2000 },
        )
      } else {
        toast.error('❌ Sync failed. Check your connection and try again.')
      }

      await refreshUnsyncedCount()
    } catch {
      toast.error('❌ Sync error. Please try again.')
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
      toast.info('🚀 Starting final inspection sync...', { timeout: 2000 })
      const result = await syncFinalInspectionsPending()
      syncResult.value = result

      if (result.failed === 0 && result.synced > 0) {
        toast.success(`✅ ${result.synced} record(s) successfully synced to cloud!`, {
          timeout: 2000,
        })
      } else if (result.synced > 0 && result.failed > 0) {
        toast.warning(
          `⚠️ Synced ${result.synced} record(s), but ${result.failed} failed. Try again.`,
          { timeout: 2000 },
        )
      } else {
        toast.error('❌ Sync failed. Check your connection and try again.')
      }

      await refreshUnsyncedFinalInspectionCount()
    } catch (error) {
      toast.error('❌ Sync error. Please try again.')
    } finally {
      isSyncingFinalInspections.value = false
    }
  }

  const syncAnnualInspections = async (): Promise<void> => {
    if (isSyncingAnnualInspections.value) return

    const count = await getUnsyncedAnnualInspectionCount()
    if (count === 0) return

    isSyncingAnnualInspections.value = true
    syncResult.value = null

    try {
      toast.info('🚀 Starting annual inspection sync...', { timeout: 2000 })
      const result = await syncAnnualInspectionsPending()
      syncResult.value = result

      if (result.failed === 0 && result.synced > 0) {
        toast.success(`✅ ${result.synced} record(s) successfully synced to cloud!`)
      } else if (result.synced > 0 && result.failed > 0) {
        toast.warning(
          `⚠️ Synced ${result.synced} record(s), but ${result.failed} failed. Try again.`,
          { timeout: 2000 },
        )
      } else {
        toast.error('❌ Sync failed. Check your connection and try again.')
      }

      await refreshUnsyncedAnnualInspectionCount()
    } catch (error) {
      toast.error('❌ Sync error. Please try again.')
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
  }
}
