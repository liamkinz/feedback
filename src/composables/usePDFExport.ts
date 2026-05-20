import { ref } from 'vue'
import { exportInspectionPDF } from '@/services/pdfExportService'
import type { BaseInspectionFeedback } from '@/db/database'
import type { InspectionType } from '@/services/pdfExportService'

export type ExportMethod = 'pdf-lib'

export type ToastColor = 'success' | 'error' | 'warning' | 'info'
export type ToastHandler = (message: string, color?: ToastColor) => void

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

  const handleExport = async (record: T, toast?: ToastHandler): Promise<void> => {
    try {
      await exportRecord(record, 'pdf-lib')
      toast?.('PDF exported successfully.', 'success')
    } catch {
      toast?.('PDF export failed. Please try again.', 'error')
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
