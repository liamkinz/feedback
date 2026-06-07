import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export interface SiteInspectionLog {
  id: number
  created_at: number
  age: string | null
  clientType: string | null
  contactNumber: string | null
  date: string
  sex: string | null
  siteInspections: string | null
  CC1: string | null
  CC2: string | null
  CC3: string | null
  SQD0: number | null
  SQD1: number | null
  SQD2: number | null
  SQD3: number | null
  SQD4: number | null
  SQD5: number | null
  SQD6: number | null
  SQD7: number | null
  SQD8: number | null
  comments: string | null
}
export interface FinalInspectionLog {
  id: number
  created_at: number
  age: string | null
  clientType: string | null
  contactNumber: string | null
  date: string
  sex: string | null
  finalInspection: string | null
  CC1: string | null
  CC2: string | null
  CC3: string | null
  SQD0: number | null
  SQD1: number | null
  SQD2: number | null
  SQD3: number | null
  SQD4: number | null
  SQD5: number | null
  SQD6: number | null
  SQD7: number | null
  SQD8: number | null
  comments: string | null
}
export interface AnnualInspectionLog {
  id: number
  created_at: number
  age: string | null
  clientType: string | null
  contactNumber: string | null
  date: string
  sex: string | null
  finalInspection: string | null
  CC1: string | null
  CC2: string | null
  CC3: string | null
  SQD0: number | null
  SQD1: number | null
  SQD2: number | null
  SQD3: number | null
  SQD4: number | null
  SQD5: number | null
  SQD6: number | null
  SQD7: number | null
  SQD8: number | null
  comments: string | null
}

export const useInspectionLogsStore = defineStore('inspectionLogs', () => {
  const siteInspect = ref<SiteInspectionLog[]>([])
  const finalInspect = ref<FinalInspectionLog[]>([])
  const annualInspect = ref<AnnualInspectionLog[]>([])

  const isLoading = ref(false)
  const msgError = ref<string | null>(null)

  async function fetchSiteInspections() {
    isLoading.value = true
    msgError.value = null

    try {
      const { data, error } = await supabase
        .from('siteinspection')
        .select('*')
        .order('id', { ascending: false })

      if (data) siteInspect.value = data || []

      if (error) throw error
    } catch (err) {
      msgError.value = 'Failed to fetch site inspections'
      console.error('Error fetching site inspections:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFinalInspections() {
    isLoading.value = true
    msgError.value = null

    try {
      const { data, error } = await supabase
        .from('finalinspection')
        .select('*')
        .order('id', { ascending: false })

      if (data) finalInspect.value = data || []

      if (error) throw error
    } catch (err) {
      msgError.value = 'Failed to fetch final inspections'
      console.error('Error fetching final inspections:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAnnualInspections() {
    isLoading.value = true
    msgError.value = null

    try {
      const { data, error } = await supabase
        .from('annualinspection')
        .select('*')
        .order('id', { ascending: false })

      if (data) annualInspect.value = data || []

      if (error) throw error
    } catch (err) {
      msgError.value = 'Failed to fetch annual inspections'
      console.error('Error fetching annual inspections:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    fetchSiteInspections,
    fetchFinalInspections,
    fetchAnnualInspections,
    annualInspect,
    finalInspect,
    siteInspect,
    isLoading,
    msgError,
  }
})
