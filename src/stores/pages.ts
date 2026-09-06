import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from 'vue-toastification'

export type RolePage = {
  id: number
  created_at: string
  role_id: number | null
  pages: string | null
}

export type CreateRolePageData = {
  role_id: number
  pages: string
}

export const useUserPagesStore = defineStore('userPages', () => {
  const toast = useToast()

  const rolePages = ref<RolePage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Every route a role has been granted. Used by the router guard and
  // useUserPermissions to decide what the current user may open/see.
  const fetchRolePagesByRoleId = async (roleId: number): Promise<RolePage[]> => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('role_pages')
        .select('*')
        .eq('role_id', roleId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      return data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch role pages by role ID'
      return []
    } finally {
      loading.value = false
    }
  }

  const createRolePage = async (rolePageData: CreateRolePageData, silent = false) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('role_pages')
        .insert([rolePageData])
        .select()
        .single()

      if (createError) throw createError

      rolePages.value.unshift(data)
      if (!silent) toast.success('Page grant added')
      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create role page'
      error.value = message
      if (!silent) toast.error('Failed to add page grant')
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  const deleteRolePagesByRoutes = async (roleId: number, routes: string[]) => {
    if (routes.length === 0) return { error: null }

    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('role_pages')
        .delete()
        .eq('role_id', roleId)
        .in('pages', routes)

      if (deleteError) throw deleteError

      rolePages.value = rolePages.value.filter(
        (rolePage) => rolePage.role_id !== roleId || !routes.includes(rolePage.pages || ''),
      )

      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete role pages'
      error.value = message
      return { error: message }
    } finally {
      loading.value = false
    }
  }

  const deleteRolePagesByRoleId = async (roleId: number, silent = false) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('role_pages')
        .delete()
        .eq('role_id', roleId)

      if (deleteError) throw deleteError

      rolePages.value = rolePages.value.filter((rolePage) => rolePage.role_id !== roleId)

      if (!silent) toast.success('Page grants removed')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete role pages'
      if (!silent) toast.error('Failed to remove page grants')
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    rolePages,
    loading,
    error,

    fetchRolePagesByRoleId,
    createRolePage,
    deleteRolePagesByRoutes,
    deleteRolePagesByRoleId,
  }
})
