import { db } from '../database'
import type { SurveyState } from '../../pages/siteinspection/types/siteinspections.type'

export function useFeedback() {
  const submitSiteInspection = async (data: SurveyState) => {
    try {
      const id = await db.siteInspections.add({
        selectedAnswers: JSON.parse(JSON.stringify(data.selectedAnswers)),
        selectedRatings: JSON.parse(JSON.stringify(data.selectedRatings)),
        respondentInfo: JSON.parse(JSON.stringify(data.respondentInfo)),
        comments: data.comments,
        synced: false,
        createdAt: new Date().toISOString()
      })
      console.log('Site inspection successfully saved to Dexie with ID:', id)
      return id
    } catch (error) {
      console.error('Error saving site inspection:', error)
      throw error
    }
  }

  return {
    submitSiteInspection
  }
}
