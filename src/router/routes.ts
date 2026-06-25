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
        path: 'entreno',
        component: () => import('src/modules/training/views/RoutinesListPage/RoutinesListPage.vue'),
        meta: { title: 'Rutinas' },
      },
      {
        path: 'entreno/ejercicios',
        component: () =>
          import('src/modules/training/views/ExerciseLibraryPage/ExerciseLibraryPage.vue'),
        meta: { title: 'Mis ejercicios', back: true },
      },
      {
        path: 'entreno/ejercicios/:id',
        component: () =>
          import('src/modules/training/views/ExerciseHistoryPage/ExerciseHistoryPage.vue'),
        meta: { title: 'Ejercicio', back: true },
      },
      {
        path: 'entreno/ejercicios/:id/editar',
        component: () =>
          import('src/modules/training/views/ExerciseEditPage/ExerciseEditPage.vue'),
        meta: { title: 'Editar ejercicio', back: true },
      },
      {
        path: 'entreno/rutinas/nueva',
        component: () => import('src/modules/training/views/RoutineFormPage/RoutineFormPage.vue'),
        meta: { title: 'Nueva rutina', back: true },
      },
      {
        path: 'entreno/rutinas/:id/editar',
        component: () => import('src/modules/training/views/RoutineFormPage/RoutineFormPage.vue'),
        meta: { title: 'Editar rutina', back: true },
      },
      {
        path: 'entreno/rutinas/:id/ejercicio/:pivotId',
        component: () =>
          import('src/modules/training/views/ExerciseDetailPage/ExerciseDetailPage.vue'),
        meta: { title: 'Ejercicio', back: true },
      },
      {
        path: 'entreno/rutinas/:id',
        component: () =>
          import('src/modules/training/views/RoutineDetailPage/RoutineDetailPage.vue'),
        meta: { title: 'Rutina', back: true },
      },
      {
        path: 'nutricion',
        component: () => import('src/modules/nutrition/views/NutritionPage/NutritionPage.vue'),
        meta: { title: 'Nutrición' },
      },
      {
        path: 'nutricion/macros',
        component: () => import('src/modules/nutrition/views/MacroGoalPage/MacroGoalPage.vue'),
        meta: { title: 'Ajustar calorías y macros', back: true },
      },
      {
        path: 'nutricion/comida/nueva',
        component: () => import('src/modules/nutrition/views/MealFormPage/MealFormPage.vue'),
        meta: { title: 'Agregar comida', back: true },
      },
      {
        path: 'nutricion/comida/:id/editar',
        component: () => import('src/modules/nutrition/views/MealFormPage/MealFormPage.vue'),
        meta: { title: 'Editar comida', back: true },
      },
      {
        path: 'progreso',
        component: () => import('src/modules/progress/views/ProgressPage/ProgressPage.vue'),
        meta: { title: 'Progreso' },
      },
      {
        path: 'ajustes',
        component: () => import('src/modules/profile/views/SettingsPage/SettingsPage.vue'),
        meta: { title: 'Ajustes' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/views/ErrorNotFound/ErrorNotFound.vue'),
  },
];

export default routes;
