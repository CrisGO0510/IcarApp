import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useNutritionStore } from '../../stores/nutrition.store';
import { DATE_QUERY_PARAM, type MealInput } from '../../types/nutrition.types';

const MEAL_NOT_FOUND_MESSAGE = 'No se encontró la comida.';

export function useMealFormPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();

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

  async function save(): Promise<void> {
    const input: MealInput = {
      date: isEdit.value ? (store.current?.date ?? store.date) : (queryDate.value ?? store.date),
      foodName: foodName.value,
      quantity: quantity.value || 0,
      unit: 'g',
      protein: protein.value || 0,
      carbohydrates: carbohydrates.value || 0,
      fat: fat.value || 0,
      calories: calories.value || 0,
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
    $q.dialog({
      title: 'Eliminar comida',
      message: 'Esta acción es irreversible. ¿Eliminar la comida?',
      cancel: { flat: true, noCaps: true, label: 'Cancelar' },
      ok: { unelevated: true, noCaps: true, color: 'negative', label: 'Eliminar' },
      dark: true,
    }).onOk(() => {
      void store
        .remove(id)
        .then(() => router.push('/nutricion'))
        .catch((error: unknown) => {
          $q.notify({
            type: 'negative',
            message: error instanceof Error ? error.message : 'No se pudo eliminar la comida.',
          });
        });
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
    save,
    remove,
    cancel,
  };
}
