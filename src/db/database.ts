import Dexie, { type Table } from 'dexie'
import type { RespondentInfo } from '../pages/siteinspection/types/siteinspections.type'

// Define the shape of your feedback record
export interface Feedback {
  id?: number // auto-incremented local ID
  name: string
  email: string
  message: string
  rating: number
  synced: boolean // false = not yet sent to Supabase
  createdAt: string
}

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
  feedbacks!: Table<Feedback>
  siteInspections!: Table<SiteInspectionFeedback>

  constructor() {
    super('FeedbackDB') // this is the IndexedDB database name
    this.version(1).stores({
      feedbacks: '++id, synced, createdAt',
    })
    
    // Version 2 adds siteInspections table
    this.version(2).stores({
      feedbacks: '++id, synced, createdAt',
      siteInspections: '++id, synced, createdAt',
    })
  }
}

export const db = new FeedbackDatabase()

// Force the database to open immediately so it appears in DevTools
db.open().catch(err => {
  console.error("Dexie failed to open:", err.stack || err)
})
