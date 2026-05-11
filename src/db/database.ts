import Dexie, { type Table } from 'dexie'
import type { RespondentInfo } from '../pages/siteinspection/types/siteinspection.type'
import type { RespondentInfo as FinalInspectionRespondentInfo } from '../pages/finalinspection/types/finalInspection.types'
import type { RespondentInfoAnnualInspection as AnnualInspectionRespondentInfo } from '../pages/annualinspection/types/annualInspection.types'

export interface SiteInspectionFeedback {
  id?: number
  selectedAnswers: { [key: string]: string }
  selectedRatings: { [key: string]: string }
  respondentInfo: RespondentInfo
  comments: string
  synced: number
  createdAt: string
}

export interface FinalInspectionFeedback {
  id?: number
  selectedAnswers: { [key: string]: string }
  selectedRatings: { [key: string]: string }
  respondentInfo: FinalInspectionRespondentInfo
  comments: string
  synced: number
  createdAt: string
}

export interface AnnualInspectionFeedback {
  id?: number
  selectedAnswers: { [key: string]: string }
  selectedRatings: { [key: string]: string }
  respondentInfo: AnnualInspectionRespondentInfo
  comments: string
  synced: number
  createdAt: string
}

class FeedbackDatabase extends Dexie {
  siteInspections!: Table<SiteInspectionFeedback>
  finalInspections!: Table<FinalInspectionFeedback>
  annualInspections!: Table<AnnualInspectionFeedback>

  constructor() {
    super('FeedbackDB') // this is the IndexedDB database name

    this.version(1).stores({
      siteInspections: '++id, synced, createdAt',
    })
    this.version(2).stores({
      siteInspections: '++id, synced, createdAt',
      finalInspections: '++id, synced, createdAt', // ← new
      annualInspections: '++id, synced, createdAt', // ← new
      internalFeedbacks: '++id, synced, createdAt', // ← new
    })
  }
}

export const db = new FeedbackDatabase()

// Force the database to open immediately so it appears in DevTools
db.open().catch((err) => {
  console.error('Dexie failed to open:', err.stack || err)
})
