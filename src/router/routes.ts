import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/onboarding',
    component: () => import('src/modules/profile/views/OnboardingPage/OnboardingPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/views/IndexPage/IndexPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/views/ErrorNotFound/ErrorNotFound.vue'),
  },
];

export default routes;
