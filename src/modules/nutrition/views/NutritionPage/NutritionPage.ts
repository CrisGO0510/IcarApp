import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNutritionStore } from '../../stores/nutrition.store';
import { DATE_QUERY_PARAM } from '../../types/nutrition.types';
import type { ActivityEntry, MacroTotal, MealEntry } from '../../types/nutrition.types';
import { dayLabelEs } from 'src/core/utils/relativeTime';
import { parseDateKey, todayKey } from 'src/core/utils/dateKey';

export function useNutritionPage() {
  const router = useRouter();
  const store = useNutritionStore();
  const { day, date, isToday } = storeToRefs(store);

  const caloriesLabel = computed(() => (day.value?.calories.consumed ?? 0).toLocaleString('en-US'));
  const meals = computed<MealEntry[]>(() => day.value?.entries ?? []);
  const activities = computed<ActivityEntry[]>(() => day.value?.activities ?? []);
  const burnedLabel = computed(() => (day.value?.burned ?? 0).toLocaleString('en-US'));
  const remainingLabel = computed(() =>
    day.value?.remaining === null || day.value?.remaining === undefined
      ? null
      : day.value.remaining.toLocaleString('en-US'),
  );

  const dateLabel = computed(() => dayLabelEs(parseDateKey(date.value), new Date()));
  const dateProxy = computed({
    get: () => date.value.replaceAll('-', '/'),
    set: (value: string | null) => {
      if (!value) return;
      void store.goToDate(value.replaceAll('/', '-'));
    },
  });
  const todayLimit = todayKey().replaceAll('-', '/');

  function dateOptions(candidate: string): boolean {
    return candidate <= todayLimit;
  }

  function previousDay(): void {
    void store.goToPreviousDay();
  }
  function nextDay(): void {
    void store.goToNextDay();
  }

  function macroRatio(total: MacroTotal): number {
    if (!total.goal) return 0;
    return Math.min(total.consumed / total.goal, 1);
  }

  function macroGoalSuffix(total: MacroTotal): string {
    return total.goal === null ? 'g' : `/${total.goal}g`;
  }

  function goToEdit(): void {
    void router.push('/nutricion/macros');
  }
  function addMeal(): void {
    void router.push(`/nutricion/comida/nueva?${DATE_QUERY_PARAM}=${date.value}`);
  }
  function openMeal(meal: MealEntry): void {
    void router.push(`/nutricion/comida/${meal.id}/editar`);
  }
  function addActivity(): void {
    void router.push(`/nutricion/actividad/nueva?${DATE_QUERY_PARAM}=${date.value}`);
  }
  function openActivity(activity: ActivityEntry): void {
    void router.push(`/nutricion/actividad/${activity.id}/editar`);
  }

  onMounted(() => {
    void store.loadDay(store.date);
  });

  return {
    day,
    meals,
    activities,
    caloriesLabel,
    burnedLabel,
    remainingLabel,
    macroRatio,
    macroGoalSuffix,
    goToEdit,
    addMeal,
    openMeal,
    addActivity,
    openActivity,
    dateLabel,
    dateProxy,
    dateOptions,
    isToday,
    previousDay,
    nextDay,
  };
}
