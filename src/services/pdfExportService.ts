import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { BaseInspectionFeedback, BaseRespondentInfo } from '@/db/database'

// ─── Constants ────────────────────────────────────────────────
const RED = rgb(1, 0, 0)
const DEV_MODE = false

// ─── Types ────────────────────────────────────────────────────
type PdfPage = ReturnType<PDFDocument['getPages']>[number]
type PdfFont = Awaited<ReturnType<PDFDocument['embedFont']>>

export type InspectionType = 'SiteInspection' | 'FinalInspection' | 'AnnualInspection'

// Maps each inspection type to its specific respondentInfo field name
const INSPECTION_FIELD_MAP: Record<InspectionType, string> = {
  SiteInspection: 'siteInspections', // e.g. "(2), (3)"
  FinalInspection: 'finalInspection', // e.g. "(1)"
  AnnualInspection: 'annualInspection', // e.g. "(2)"
}

// ─── Service Type Checkbox Coordinates ────────────────────────
const SERVICE_TYPE_COORDS: Record<InspectionType, [number, number]> = {
  SiteInspection: [152, 609], // ← calibrate with DEV_MODE
  FinalInspection: [152, 596], // ← calibrate with DEV_MODE
  AnnualInspection: [152, 583], // ← calibrate with DEV_MODE
}

// ─── SQD Config ───────────────────────────────────────────────
const SQD_ROWS: [string, number][] = [
  ['SQD0', 302],
  ['SQD1', 284],
  ['SQD2', 258],
  ['SQD3', 234],
  ['SQD4', 210],
  ['SQD5', 185],
  ['SQD6', 160],
  ['SQD7', 138],
  ['SQD8', 108],
]

const SQD_COLS: Record<string, number> = {
  '5': 296,
  '4': 350,
  '3': 406,
  '2': 462,
  '1': 514,
  'N/A': 570,
}

// ─── Template Loader ──────────────────────────────────────────
async function loadTemplate(): Promise<PDFDocument> {
  const response = await fetch('/templates/CSMRForm.pdf')

  if (!response.ok) {
    throw new Error(`Failed to load PDF template: ${response.status} ${response.statusText}`)
  }

  const bytes = await response.arrayBuffer()
  if (bytes.byteLength === 0) throw new Error('PDF template file is empty.')

  return PDFDocument.load(bytes)
}

// ─── Drawing Helpers ──────────────────────────────────────────
function drawCheck(page: PdfPage, x: number, y: number, condition: boolean): void {
  if (DEV_MODE) {
    page.drawCircle({ x, y, size: 3, color: RED })
  }

  if (!condition) return

  const size = 7
  page.drawLine({
    start: { x, y: y + 2 },
    end: { x: x + size * 0.4, y: y - size * 0.2 },
    thickness: 1.2,
    color: RED,
  })
  page.drawLine({
    start: { x: x + size * 0.4, y: y - size * 0.2 },
    end: { x: x + size, y: y + size * 0.6 },
    thickness: 1.2,
    color: RED,
  })
}

function drawText(
  page: PdfPage,
  font: PdfFont,
  text: string,
  x: number,
  y: number,
  size = 9,
): void {
  if (!text) return
  page.drawText(text, { x, y, size, font, color: RED })
}

// ─── Section Fillers ──────────────────────────────────────────

function fillRespondentInfo(
  page: PdfPage,
  font: PdfFont,
  r: BaseRespondentInfo,
  inspectionType: InspectionType,
): void {
  const info = r ?? {}

  // ── Common fields ──────────────────────────────────────────
  drawCheck(page, 86, 800, info.clientType === 'Citizen')
  drawCheck(page, 126, 800, info.clientType === 'Business')
  drawCheck(page, 176, 800, info.clientType?.includes('Government') ?? false)

  drawText(page, font, info.date ?? '', 72, 780)
  drawCheck(page, 168, 780, info.sex?.toLowerCase() === 'male')
  drawCheck(page, 207, 780, info.sex?.toLowerCase() === 'female')
  drawText(page, font, info.age ?? '', 285, 780)
  drawText(page, font, info.contactNumber ?? '', 447, 765)

  // ── Inspection-specific field ──────────────────────────────
  // Reads siteInspections / finalInspection / annualInspection
  // based on which dashboard is exporting
  const fieldName = INSPECTION_FIELD_MAP[inspectionType]
  const specificText = (info as Record<string, unknown>)[fieldName]

  if (typeof specificText === 'string' && specificText) {
    drawText(page, font, specificText, 137, 663, 8)
  }
}

// function fillServiceType(page: PdfPage, inspectionType: InspectionType): void {
//   const coords = SERVICE_TYPE_COORDS[inspectionType]
//   if (coords) drawCheck(page, coords[0], coords[1], true)
// }

function fillCC(page: PdfPage, sa: Record<string, string>): void {
  // CC1
  drawCheck(page, 83, 572, sa['CC1'] === '1')
  drawCheck(page, 83, 559, sa['CC1'] === '2')
  drawCheck(page, 83, 546, sa['CC1'] === '3')
  drawCheck(page, 83, 533, sa['CC1'] === '4')

  // CC2
  drawCheck(page, 83, 503, sa['CC2'] === '1')
  drawCheck(page, 83, 490, sa['CC2'] === '2')
  drawCheck(page, 83, 477, sa['CC2'] === '3')
  drawCheck(page, 254, 503, sa['CC2'] === '4')
  drawCheck(page, 254, 490, sa['CC2'] === '5')

  // CC3
  drawCheck(page, 83, 434, sa['CC3'] === '1')
  drawCheck(page, 83, 421, sa['CC3'] === '2')
  drawCheck(page, 218, 434, sa['CC3'] === '3')
  drawCheck(page, 218, 421, sa['CC3'] === '4')
}

function fillSQD(page: PdfPage, sr: Record<string, string>): void {
  for (const [key, y] of SQD_ROWS) {
    const rating = sr[key]
    const x = rating !== undefined ? SQD_COLS[rating] : undefined
    if (x !== undefined) drawCheck(page, x, y, true)
  }
}

// ─── Filename Builder ─────────────────────────────────────────
function buildFilename(record: BaseInspectionFeedback, inspectionType: InspectionType): string {
  const r = record.respondentInfo ?? {}
  return `${inspectionType}_${r.clientType ?? 'client'}_${r.date ?? 'unknown'}_ID${record.id ?? 0}`
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .concat('.pdf')
}

// ─── Main Export ──────────────────────────────────────────────
export async function exportInspectionPDF(
  record: BaseInspectionFeedback,
  inspectionType: InspectionType,
): Promise<void> {
  const pdfDoc = await loadTemplate()
  const page = pdfDoc.getPages()[0]

  if (!page) throw new Error('PDF template has no pages.')

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  fillRespondentInfo(page, font, record.respondentInfo, inspectionType)
  // fillServiceType(page, inspectionType)
  fillCC(page, record.selectedAnswers ?? {})
  fillSQD(page, record.selectedRatings ?? {})
  drawText(page, font, record.comments ?? '', 21, 71, 8)

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = buildFilename(record, inspectionType)
  link.click()

  URL.revokeObjectURL(url)
}
