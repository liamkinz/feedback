import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

import OuterLayout from '../layouts/OuterLayout.vue'

// Landing Routes
import LandingView from '../pages/LandingPage/LandingView.vue'

// // Dashboard Routes (placeholder for future use)
// import DashboardView from '@/pages/dashboard/DashboardView.vue'

// // Internal Routes (placeholder for future use)
// import InternalView from '@/pages/internal/InternalView.vue'

// Site Inspection Routes
import SiteInspectionView from '@/pages/siteinspection/SiteInspectionView.vue'
import SiteInspectionDashboard from '@/pages/siteinspection/components/SiteInspectionDashboard.vue'

// Final Inspection Routes
import FinalInspectionView from '@/pages/finalinspection/components/FinalInspection.vue'
import FinalInspectionDashboard from '@/pages/finalinspection/components/FinalInspectionDashboard.vue'

// Annual Inspection Routes
import AnnualInspectionView from '@/pages/annualinspection/components/AnnualInspection.vue'
import AnnualInspectionDashboard from '@/pages/annualinspection/components/AnnualInspectionDashboard.vue'

// Auth Routes are lazy-loaded in the router config below to optimize initial load time
import Auth from '@/pages/auth/Auth.vue'
import login from '@/pages/auth/login/LoginView.vue'
import register from '@/pages/auth/register/RegisterView.vue'

//Admin Dashboard
import InnerLayout from '@/layouts/InnerLayout.vue'
import AdminView from '@/pages/(admin)/AdminView.vue'
import SiteInspectionLogs from '@/pages/(admin)/components/SiteInspectionLogs.vue'
import FinalInspectionLogs from '@/pages/(admin)/components/FinalInspectionLogs.vue'
import AnnualInspectionLogs from '@/pages/(admin)/components/AnnualInspectionLogs.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: OuterLayout,
      children: [
        {
          path: '',
          name: 'landing',
          component: LandingView,
          meta: { requiresGuest: true },
        },
        {
          path: 'site-inspection',
          name: 'site-inspection',
          component: SiteInspectionView,
          meta: { requiresGuest: true },
        },
        {
          path: 'site-inspection/dashboard',
          name: 'site-inspection-dashboard',
          component: SiteInspectionDashboard,
          meta: { requiresGuest: true },
        },
        {
          path: 'final-inspection',
          name: 'final-inspection',
          component: FinalInspectionView,
          meta: { requiresGuest: true },
        },
        {
          path: 'final-inspection/dashboard',
          name: 'final-inspection-dashboard',
          component: FinalInspectionDashboard,
          meta: { requiresGuest: true },
        },
        {
          path: 'annual-inspection',
          name: 'annual-inspection',
          component: AnnualInspectionView,
          meta: { requiresGuest: true },
        },
        {
          path: 'annual-inspection/dashboard',
          name: 'annual-inspection-dashboard',
          component: AnnualInspectionDashboard,
          meta: { requiresGuest: true },
        },
        {
          path: '/auth',
          component: Auth,
          redirect: '/auth/login',
          children: [
            {
              path: 'login',
              name: 'Login',
              component: login,
              meta: { requiresGuest: true },
            },
            {
              path: 'register',
              name: 'Register',
              component: register,
              meta: { requiresGuest: true },
            },
          ],
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'admin-dashboard',
      component: InnerLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
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
      ],
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
    return { name: 'Login' }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { path: '/dashboard' }
  }
})

export default router
