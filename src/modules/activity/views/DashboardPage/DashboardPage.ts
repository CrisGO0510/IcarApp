import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useActivityStore } from '../../stores/activity.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';

export function useDashboardPage() {
  const activityStore = useActivityStore();
  const profileStore = useProfileStore();

  const { summary } = storeToRefs(activityStore);
  const { profile } = storeToRefs(profileStore);

  const greeting = computed(() => (profile.value?.name ? `Hola, ${profile.value.name}` : 'Hola'));

  const todayLabel = computed(() => {
    const formatted = new Intl.DateTimeFormat('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  const weightValue = computed(() => {
    const weight = summary.value?.weeklyStats.averageWeight;
    return weight != null ? String(weight) : '—';
  });

  const weightUnit = computed(() =>
    summary.value?.weeklyStats.averageWeight != null ? 'kg' : '',
  );

  onMounted(() => {
    void activityStore.loadDashboard();
  });

  return { summary, greeting, todayLabel, weightValue, weightUnit };
}
