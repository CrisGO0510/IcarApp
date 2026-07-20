import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNutritionStore } from '../../stores/nutrition.store';
import { DATE_QUERY_PARAM, MACRO_GOAL_PATH, SAVED_MEALS_PATH } from '../../types/nutrition.types';
import type { ActivityEntry, MacroTotal, MealEntry, SavedMeal } from '../../types/nutrition.types';
import { WEIGHT_HISTORY_PATH } from 'src/modules/measurements/types/measurements.types';
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
    void router.push(MACRO_GOAL_PATH);
  }
  function goToSavedMeals(): void {
    void router.push(SAVED_MEALS_PATH);
  }
  function goToWeights(): void {
    void router.push(WEIGHT_HISTORY_PATH);
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

  const showPicker = ref(false);
  const showQuickLog = ref(false);
  const pickedMeal = ref<SavedMeal | null>(null);

  function openPicker(): void {
    showPicker.value = true;
  }

  function onPickSavedMeal(meal: SavedMeal): void {
    pickedMeal.value = meal;
    showQuickLog.value = true;
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
    goToSavedMeals,
    goToWeights,
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
    showPicker,
    showQuickLog,
    pickedMeal,
    openPicker,
    onPickSavedMeal,
  };
}
