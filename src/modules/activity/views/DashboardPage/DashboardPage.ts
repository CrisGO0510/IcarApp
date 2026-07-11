import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useActivityStore } from '../../stores/activity.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { useMeasurementsStore } from 'src/modules/measurements/stores/measurements.store';
import { todayKey } from 'src/core/utils/dateKey';

export function useDashboardPage() {
  const activityStore = useActivityStore();
  const profileStore = useProfileStore();
  const measurementsStore = useMeasurementsStore();

  const { summary } = storeToRefs(activityStore);
  const { profile } = storeToRefs(profileStore);
  const { latest } = storeToRefs(measurementsStore);

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

  const showWeightDialog = ref(false);
  const currentWeight = computed(() => latest.value?.weightKg ?? null);

  function openWeightDialog(): void {
    showWeightDialog.value = true;
  }

  async function onSubmitWeight(weightKg: number): Promise<void> {
    await measurementsStore.log({ date: todayKey(), weightKg });
    showWeightDialog.value = false;
  }

  onMounted(async () => {
    await activityStore.loadDashboard();
    await measurementsStore.load();
  });

  return {
    summary,
    greeting,
    todayLabel,
    weightValue,
    weightUnit,
    showWeightDialog,
    currentWeight,
    openWeightDialog,
    onSubmitWeight,
  };
}
