import Dexie, { type Table } from 'dexie'
import type { RespondentInfo } from '../pages/siteinspection/types/siteinspections.type'

export interface SiteInspectionFeedback {
  id?: number
  selectedAnswers: { [key: string]: string }
  selectedRatings: { [key: string]: string }
  respondentInfo: RespondentInfo
  comments: string
  synced: boolean
  createdAt: string
}

class FeedbackDatabase extends Dexie {
  siteInspections!: Table<SiteInspectionFeedback>

  constructor() {
    super('FeedbackDB') // this is the IndexedDB database name

    this.version(1).stores({
      siteInspections: '++id, synced, createdAt',
    })
  }
}

export const db = new FeedbackDatabase()

// Force the database to open immediately so it appears in DevTools
db.open().catch((err) => {
  console.error('Dexie failed to open:', err.stack || err)
})
