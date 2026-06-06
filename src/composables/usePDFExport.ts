import { ref } from 'vue'
import { exportInspectionPDF } from '@/services/pdfExportService'
import type { BaseInspectionFeedback } from '@/db/database'
import type { InspectionType } from '@/services/pdfExportService'
import { useToast } from 'vue-toastification'
export type ExportMethod = 'pdf-lib'

export function usePDFExport<T extends BaseInspectionFeedback>(inspectionType: InspectionType) {
  const isExporting = ref(false)
  const exportingId = ref<number | null>(null)
  const selectedRecord = ref<T | null>(null)
  const showReportDialog = ref(false)

  // ── pdf-lib method ────────────────────────────────────────────
  async function exportWithLib(record: T): Promise<void> {
    isExporting.value = true
    exportingId.value = record.id ?? null

    try {
      await exportInspectionPDF(record, inspectionType)
    } finally {
      isExporting.value = false
      exportingId.value = null
    }
  }

  // ── Generic export ────────────────────────────────────────────
  async function exportRecord(record: T, _method: ExportMethod = 'pdf-lib'): Promise<void> {
    await exportWithLib(record)
  }

  const handleExport = async (record: T): Promise<void> => {
    const toast = useToast()
    try {
      await exportRecord(record, 'pdf-lib')
      toast.success('PDF exported successfully.')
    } catch {
      toast.error('PDF export failed. Please try again.')
    }
  }

  return {
    isExporting,
    exportingId,
    selectedRecord,
    showReportDialog,
    exportRecord,
    handleExport,
  }
}
