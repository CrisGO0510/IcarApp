import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useNutritionStore } from '../../stores/nutrition.store';
import type { MacroTotal, MealEntry } from '../../types/nutrition.types';

export function useNutritionPage() {
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();
  const { day } = storeToRefs(store);

  const caloriesLabel = computed(() =>
    (day.value?.calories.consumed ?? 0).toLocaleString('en-US'),
  );
  const meals = computed<MealEntry[]>(() => day.value?.entries ?? []);

  function macroRatio(total: MacroTotal): number {
    if (!total.goal) return 0;
    return Math.min(total.consumed / total.goal, 1);
  }

  function macroLabel(total: MacroTotal): string {
    return total.goal === null ? `${total.consumed}g` : `${total.consumed}/${total.goal}g`;
  }

  function goToEdit(): void {
    void router.push('/nutricion/macros');
  }
  function addMeal(): void {
    void router.push('/nutricion/comida/nueva');
  }
  function openMeal(meal: MealEntry): void {
    void router.push(`/nutricion/comida/${meal.id}/editar`);
  }
  function addActivity(): void {
    $q.notify({ message: 'El registro de actividad estará disponible próximamente.' });
  }

  onMounted(() => {
    void store.loadDay();
  });

  return {
    day,
    meals,
    caloriesLabel,
    macroRatio,
    macroLabel,
    goToEdit,
    addMeal,
    openMeal,
    addActivity,
  };
}
