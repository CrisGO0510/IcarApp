import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  let profileLoaded = false;

  Router.beforeEach(async (to) => {
    const profileStore = useProfileStore();

    if (!profileLoaded) {
      try {
        await profileStore.loadProfile();
      } catch {
        // Storage unreachable — treat as no profile so onboarding can run.
      }
      profileLoaded = true;
    }

    if (!profileStore.hasProfile && to.path !== '/onboarding') {
      return '/onboarding';
    }

    if (profileStore.hasProfile && to.path === '/onboarding') {
      return '/';
    }
  });

  return Router;
});
