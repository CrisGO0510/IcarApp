import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useNutritionStore } from '../../stores/nutrition.store';
import { DATE_QUERY_PARAM, MASS_UNIT, type MealInput } from '../../types/nutrition.types';
import { scaleMealFromReference } from '../../use-cases/scaleMealFromReference';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

const MEAL_NOT_FOUND_MESSAGE = 'No se encontró la comida.';

export const MEAL_MODE = {
  MANUAL: 'manual',
  CALCULATE: 'calcular',
} as const;
export type MealMode = (typeof MEAL_MODE)[keyof typeof MEAL_MODE];

const DEFAULT_REFERENCE_BASE = 100;

export function useMealFormPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();
  const { confirmDestructive } = useConfirmDialog();

  const mealId = computed(() => (route.params.id as string | undefined) ?? null);
  const isEdit = computed(() => mealId.value !== null);
  const queryDate = computed(() => (route.query[DATE_QUERY_PARAM] as string | undefined) ?? null);

  const foodName = ref('');
  const quantity = ref<number>(0);
  const protein = ref<number>(0);
  const carbohydrates = ref<number>(0);
  const fat = ref<number>(0);
  const notes = ref('');
  const calories = ref<number>(0);

  const mode = ref<MealMode>(MEAL_MODE.MANUAL);
  const base = ref<number>(DEFAULT_REFERENCE_BASE);
  const baseProtein = ref<number>(0);
  const baseCarbohydrates = ref<number>(0);
  const baseFat = ref<number>(0);
  const baseCalories = ref<number>(0);

  const calculated = computed(() =>
    scaleMealFromReference(
      {
        base: base.value || 0,
        protein: baseProtein.value || 0,
        carbohydrates: baseCarbohydrates.value || 0,
        fat: baseFat.value || 0,
        calories: baseCalories.value || 0,
      },
      quantity.value || 0,
    ),
  );

  async function save(): Promise<void> {
    const macros =
      mode.value === MEAL_MODE.CALCULATE
        ? calculated.value
        : {
            protein: protein.value || 0,
            carbohydrates: carbohydrates.value || 0,
            fat: fat.value || 0,
            calories: calories.value || 0,
          };

    const input: MealInput = {
      date: isEdit.value ? (store.current?.date ?? store.date) : (queryDate.value ?? store.date),
      foodName: foodName.value,
      quantity: quantity.value || 0,
      unit: MASS_UNIT,
      protein: macros.protein,
      carbohydrates: macros.carbohydrates,
      fat: macros.fat,
      calories: macros.calories,
      loggedAt: isEdit.value ? (store.current?.loggedAt ?? new Date()) : new Date(),
      ...(notes.value.trim() ? { notes: notes.value.trim() } : {}),
    };

    try {
      if (isEdit.value && mealId.value) {
        await store.update(mealId.value, input);
      } else {
        await store.log(input);
      }
      await router.push('/nutricion');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar la comida.',
      });
    }
  }

  function remove(): void {
    const id = mealId.value;
    if (!id) return;
    confirmDestructive({
      title: 'Eliminar comida',
      message: 'Esta acción es irreversible. ¿Eliminar la comida?',
      onConfirm: () => {
        void store
          .remove(id)
          .then(() => router.push('/nutricion'))
          .catch((error: unknown) => {
            $q.notify({
              type: 'negative',
              message: error instanceof Error ? error.message : 'No se pudo eliminar la comida.',
            });
          });
      },
    });
  }

  function cancel(): void {
    void router.push('/nutricion');
  }

  onMounted(async () => {
    if (!isEdit.value || !mealId.value) return;
    try {
      await store.loadMeal(mealId.value);
      const meal = store.current;
      if (!meal) throw new Error(MEAL_NOT_FOUND_MESSAGE);
      foodName.value = meal.foodName;
      quantity.value = meal.quantity;
      protein.value = meal.protein;
      carbohydrates.value = meal.carbohydrates;
      fat.value = meal.fat;
      notes.value = meal.notes ?? '';
      calories.value = meal.calories;
    } catch {
      $q.notify({ type: 'negative', message: MEAL_NOT_FOUND_MESSAGE });
      void router.replace('/nutricion');
    }
  });

  return {
    isEdit,
    foodName,
    quantity,
    protein,
    carbohydrates,
    fat,
    notes,
    calories,
    mode,
    base,
    baseProtein,
    baseCarbohydrates,
    baseFat,
    baseCalories,
    calculated,
    save,
    remove,
    cancel,
  };
}
