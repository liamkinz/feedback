// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//     {
//       path: '/test',
//       name: 'test',
//       component: () => import('../components/Testings.vue'),
//     },
//   ],
// })

import { createRouter, createWebHistory } from 'vue-router'

import OuterLayout from '../layouts/OuterLayout.vue'

// Landing Routes
import LandingView from '../pages/LandingPage/LandingView.vue'

// // Dashboard Routes
// import DashboardView from '@/pages/dashboard/DashboardView.vue'

// // Internal Routes
// import InternalView from '@/pages/internal/InternalView.vue'

// Site Inspection Routes
import SiteInspectionView from '@/pages/siteinspection/SiteInspectionView.vue'
import SiteInspectionDashboard from '@/pages/siteinspection/components/SiteInspectionDashboard.vue'

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
        // {
        //   path: 'dashboard',
        //   name: 'dashboard',
        //   component: DashboardView,
        //   meta: { requiresGuest: true },
        // },
        // {
        //   path: 'internal',
        //   name: 'internal',
        //   component: InternalView,
        //   meta: { requiresGuest: true },
        // },
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
      ],
    },
  ],
})

export default router
