import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/onboarding',
    component: () => import('src/modules/profile/views/OnboardingPage/OnboardingPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/modules/activity/views/DashboardPage/DashboardPage.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'progreso',
        component: () => import('src/modules/progress/views/ProgressPage/ProgressPage.vue'),
        meta: { title: 'Progreso' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/views/ErrorNotFound/ErrorNotFound.vue'),
  },
];

export default routes;
