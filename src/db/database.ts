// import Dexie, { type Table } from 'dexie'
// import type { RespondentInfo } from '../pages/siteinspection/types/siteinspection.type'
// import type { RespondentInfo as FinalInspectionRespondentInfo } from '../pages/finalinspection/types/finalInspection.types'
// import type { RespondentInfoAnnualInspection as AnnualInspectionRespondentInfo } from '../pages/annualinspection/types/annualInspection.types'

// export interface SiteInspectionFeedback {
//   id?: number
//   selectedAnswers: { [key: string]: string }
//   selectedRatings: { [key: string]: string }
//   respondentInfo: RespondentInfo
//   comments: string
//   synced: number
//   createdAt: string
// }

// export interface FinalInspectionFeedback {
//   id?: number
//   selectedAnswers: { [key: string]: string }
//   selectedRatings: { [key: string]: string }
//   respondentInfo: FinalInspectionRespondentInfo
//   comments: string
//   synced: number
//   createdAt: string
// }

// export interface AnnualInspectionFeedback {
//   id?: number
//   selectedAnswers: { [key: string]: string }
//   selectedRatings: { [key: string]: string }
//   respondentInfo: AnnualInspectionRespondentInfo
//   comments: string
//   synced: number
//   createdAt: string
// }

// export interface LocalUser {
//   id?: number
//   supabaseId: string
//   email: string
//   name: string
//   passwordHash: string // bcrypt hash — never plain text
//   role: string
//   lastLogin: string
// }

// class FeedbackDatabase extends Dexie {
//   siteInspections!: Table<SiteInspectionFeedback>
//   finalInspections!: Table<FinalInspectionFeedback>
//   annualInspections!: Table<AnnualInspectionFeedback>
//   users!: Table<LocalUser>

//   constructor() {
//     super('FeedbackDB') // this is the IndexedDB database name

//     this.version(1).stores({
//       siteInspections: '++id, synced, createdAt',
//     })
//     this.version(2).stores({
//       siteInspections: '++id, synced, createdAt',
//       finalInspections: '++id, synced, createdAt', // ← new
//       annualInspections: '++id, synced, createdAt', // ← new
//       internalFeedbacks: '++id, synced, createdAt', // ← new
//     })
//     this.version(3).stores({
//       siteInspections: '++id, synced, createdAt',
//       finalInspections: '++id, synced, createdAt',
//       annualInspections: '++id, synced, createdAt',
//       internalFeedbacks: '++id, synced, createdAt',
//       users: '++id, email, supabaseId', // ← (new) indexed by email for lookup
//     })
//   }
// }

// export const db = new FeedbackDatabase()

// // Force the database to open immediately so it appears in DevTools
// db.open().catch((err) => {
//   console.error('Dexie failed to open:', err.stack || err)
// })

import Dexie, { type Table } from 'dexie'
import type { RespondentInfo } from '../pages/siteinspection/types/siteinspection.type'
import type { RespondentInfo as FinalInspectionRespondentInfo } from '../pages/finalinspection/types/finalInspection.types'
import type { RespondentInfoAnnualInspection as AnnualInspectionRespondentInfo } from '../pages/annualinspection/types/annualInspection.types'

// ─── Base Interfaces ───────────────────────────────────────────
// Shared across all inspection types — used by pdfExportService
// and usePDFExport composable

export interface BaseRespondentInfo {
  clientType?: string
  date?: string
  sex?: string
  age?: string
  contactNumber?: string
}

export interface BaseInspectionFeedback {
  id?: number
  respondentInfo: BaseRespondentInfo
  selectedAnswers: { [key: string]: string }
  selectedRatings: { [key: string]: string }
  comments: string
  synced: number
  createdAt: string
}

// ─── Specific Feedback Types ───────────────────────────────────
// Each extends the base and overrides respondentInfo
// with its own type that includes the inspection-specific field:
//   SiteInspection   → siteInspections
//   FinalInspection  → finalInspection
//   AnnualInspection → annualInspection

export interface SiteInspectionFeedback extends BaseInspectionFeedback {
  respondentInfo: RespondentInfo
}

export interface FinalInspectionFeedback extends BaseInspectionFeedback {
  respondentInfo: FinalInspectionRespondentInfo
}

export interface AnnualInspectionFeedback extends BaseInspectionFeedback {
  respondentInfo: AnnualInspectionRespondentInfo
}

// ─── Auth ──────────────────────────────────────────────────────

export interface LocalUser {
  id?: number
  supabaseId: string
  email: string
  name: string
  passwordHash: string // bcrypt hash — never plain text
  role: string
  lastLogin: string
}

// ─── Database ──────────────────────────────────────────────────

class FeedbackDatabase extends Dexie {
  siteInspections!: Table<SiteInspectionFeedback>
  finalInspections!: Table<FinalInspectionFeedback>
  annualInspections!: Table<AnnualInspectionFeedback>
  users!: Table<LocalUser>

  constructor() {
    super('FeedbackDB')

    this.version(1).stores({
      siteInspections: '++id, synced, createdAt',
    })

    this.version(2).stores({
      siteInspections: '++id, synced, createdAt',
      finalInspections: '++id, synced, createdAt',
      annualInspections: '++id, synced, createdAt',
      internalFeedbacks: '++id, synced, createdAt',
    })

    this.version(3).stores({
      siteInspections: '++id, synced, createdAt',
      finalInspections: '++id, synced, createdAt',
      annualInspections: '++id, synced, createdAt',
      internalFeedbacks: '++id, synced, createdAt',
      users: '++id, email, supabaseId',
    })
  }
}

export const db = new FeedbackDatabase()

db.open().catch((err) => {
  console.error('Dexie failed to open:', err.stack || err)
})
