import { useAuthStore } from '@/stores/authStore'
import { useUserPagesStore } from '@/stores/pages'
import { createRouter, createWebHistory } from 'vue-router'

// Landing Routes
import LandingView from '../pages/LandingPage/LandingView.vue'

// Site Inspection Routes
import SiteInspectionView from '@/pages/siteinspection/SiteInspectionView.vue'
import SiteInspectionDashboard from '@/pages/siteinspection/components/SiteInspectionDashboard.vue'

// Final Inspection Routes
import FinalInspectionView from '@/pages/finalinspection/components/FinalInspection.vue'
import FinalInspectionDashboard from '@/pages/finalinspection/components/FinalInspectionDashboard.vue'

// Annual Inspection Routes
import AnnualInspectionView from '@/pages/annualinspection/components/AnnualInspection.vue'
import AnnualInspectionDashboard from '@/pages/annualinspection/components/AnnualInspectionDashboard.vue'

// Auth
import Auth from '@/pages/auth/Auth.vue'

// Admin dashboard (signed-in shell, role-gated — see supabase/migrations/0001_roles_and_role_pages.sql)
import AdminView from '@/pages/(admin)/AdminView.vue'
import SiteInspectionLogs from '@/pages/(admin)/components/SiteInspectionLogs.vue'
import FinalInspectionLogs from '@/pages/(admin)/components/FinalInspectionLogs.vue'
import AnnualInspectionLogs from '@/pages/(admin)/components/AnnualInspectionLogs.vue'
import UserManagementView from '@/pages/admin/UserManagementView.vue'
import AdminUserRolesView from '@/pages/admin/AdminUserRolesView.vue'

// Account (any signed-in user, regardless of role)
import AccountHomeView from '@/pages/account/HomeView.vue'
import SettingsView from '@/pages/account/SettingsView.vue'

// Errors
import ForbiddenView from '@/pages/ForbiddenView.vue'
import NotFound from '@/pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: { requiresGuest: true },
    },
    {
      path: '/site-inspection',
      name: 'site-inspection',
      component: SiteInspectionView,
      meta: { requiresGuest: true },
    },
    {
      path: '/site-inspection/dashboard',
      name: 'site-inspection-dashboard',
      component: SiteInspectionDashboard,
      meta: { requiresGuest: true },
    },
    {
      path: '/final-inspection',
      name: 'final-inspection',
      component: FinalInspectionView,
      meta: { requiresGuest: true },
    },
    {
      path: '/final-inspection/dashboard',
      name: 'final-inspection-dashboard',
      component: FinalInspectionDashboard,
      meta: { requiresGuest: true },
    },
    {
      path: '/annual-inspection',
      name: 'annual-inspection',
      component: AnnualInspectionView,
      meta: { requiresGuest: true },
    },
    {
      path: '/annual-inspection/dashboard',
      name: 'annual-inspection-dashboard',
      component: AnnualInspectionDashboard,
      meta: { requiresGuest: true },
    },
    {
      path: '/auth',
      component: Auth,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'AdminView',
      component: AdminView,
      meta: { requiresAuth: true },
    },
    {
      path: '/inspections/site',
      name: 'SiteInspectionLogs',
      component: SiteInspectionLogs,
      meta: { requiresAuth: true },
    },
    {
      path: '/inspections/final',
      name: 'FinalInspectionLogs',
      component: FinalInspectionLogs,
      meta: { requiresAuth: true },
    },
    {
      path: '/inspections/annual',
      name: 'AnnualInspectionLogs',
      component: AnnualInspectionLogs,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/user-management',
      name: 'UserManagementView',
      component: UserManagementView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/user-roles',
      name: 'AdminUserRolesView',
      component: AdminUserRolesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/account/home',
      name: 'AccountHome',
      component: AccountHomeView,
      // requiresAuth only — every signed-in user reaches their own account
      // pages regardless of role, so /account/* is exempted from the
      // role_pages check below rather than needing a grant row per role.
      meta: { requiresAuth: true },
    },
    {
      path: '/account/settings',
      name: 'AccountSettings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: ForbiddenView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

// Navigation guards
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Restore session on first load
  if (!authStore.isAuthenticated) {
    await authStore.restoreSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/auth' }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { path: '/dashboard' }
  }

  // Every signed-in user reaches their own account pages regardless of role.
  if (to.meta.requiresAuth && to.path.startsWith('/account/')) {
    return
  }

  // Role-gated pages — see supabase/migrations/0001_roles_and_role_pages.sql
  if (to.meta.requiresAuth) {
    const pagesStore = useUserPagesStore()
    const rolePages = await pagesStore.fetchRolePagesByRoleId(authStore.userRole)
    const allowedPages = rolePages.map((rp) => rp.pages)

    if (!allowedPages.includes(to.path)) {
      return { path: '/forbidden' }
    }
  }
})

export default router
