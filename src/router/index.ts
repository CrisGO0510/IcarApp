import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

let profileLoaded = false;

router.beforeEach(async (to) => {
  const profileStore = useProfileStore();

  if (!profileLoaded) {
    try {
      await profileStore.loadProfile();
    } catch {
      profileLoaded = true;
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

export default router;
