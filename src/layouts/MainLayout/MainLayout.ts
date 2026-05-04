import { ref } from 'vue';

export function useMainLayout() {
  const leftDrawerOpen = ref(false);

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  return { leftDrawerOpen, toggleLeftDrawer };
}
