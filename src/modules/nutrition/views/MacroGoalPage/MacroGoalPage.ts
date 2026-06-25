import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useNutritionStore } from '../../stores/nutrition.store';
import type { MacroGoalInput } from '../../types/nutrition.types';

const DEFAULTS = { calories: 2500, protein: 30, carbs: 40, fat: 30 };

export function useMacroGoalPage() {
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();

  const calorieGoal = ref<number>(DEFAULTS.calories);
  const proteinPct = ref<number>(DEFAULTS.protein);
  const carbsPct = ref<number>(DEFAULTS.carbs);
  const fatPct = ref<number>(DEFAULTS.fat);
  const unit = ref<'%' | 'g'>('%');

  const totalPct = computed(() => proteinPct.value + carbsPct.value + fatPct.value);

  function toGrams(pct: number, kcalPerGram: number): number {
    return Math.round(((calorieGoal.value || 0) * pct) / 100 / kcalPerGram);
  }
  const proteinGrams = computed(() => toGrams(proteinPct.value, 4));
  const carbsGrams = computed(() => toGrams(carbsPct.value, 4));
  const fatGrams = computed(() => toGrams(fatPct.value, 9));

  function displayValue(pct: number, grams: number): string {
    return unit.value === '%' ? `${pct}%` : `${grams}g`;
  }

  async function save(): Promise<void> {
    if (totalPct.value !== 100) {
      $q.notify({ type: 'warning', message: 'La repartición de macros debe sumar 100%.' });
      return;
    }

    const input: MacroGoalInput = {
      date: store.date,
      calorieGoal: calorieGoal.value || 0,
      proteinGoal: proteinGrams.value,
      carbohydrateGoal: carbsGrams.value,
      fatGoal: fatGrams.value,
    };

    try {
      await store.saveGoal(input);
      $q.notify({ type: 'positive', message: 'Meta de macros guardada.' });
      await router.push('/nutricion');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar la meta.',
      });
    }
  }

  function reset(): void {
    calorieGoal.value = DEFAULTS.calories;
    proteinPct.value = DEFAULTS.protein;
    carbsPct.value = DEFAULTS.carbs;
    fatPct.value = DEFAULTS.fat;
  }

  onMounted(async () => {
    await store.loadGoal();
    const goal = store.goal;
    if (goal) {
      calorieGoal.value = goal.calorieGoal;
      const cal = goal.calorieGoal || 1;
      proteinPct.value = Math.round(((goal.proteinGoal * 4) / cal) * 100);
      carbsPct.value = Math.round(((goal.carbohydrateGoal * 4) / cal) * 100);
      fatPct.value = Math.round(((goal.fatGoal * 9) / cal) * 100);
    }
  });

  return {
    calorieGoal,
    proteinPct,
    carbsPct,
    fatPct,
    unit,
    totalPct,
    proteinGrams,
    carbsGrams,
    fatGrams,
    displayValue,
    save,
    reset,
  };
}
