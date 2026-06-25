import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useNutritionStore } from '../../stores/nutrition.store';
import { computeCalories } from '../../use-cases/computeCalories';
import type { MealInput } from '../../types/nutrition.types';

export function useMealFormPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();

  const mealId = computed(() => (route.params.id as string | undefined) ?? null);
  const isEdit = computed(() => mealId.value !== null);

  const foodName = ref('');
  const quantity = ref<number>(0);
  const protein = ref<number>(0);
  const carbohydrates = ref<number>(0);
  const fat = ref<number>(0);

  const calories = computed(() =>
    computeCalories(protein.value || 0, carbohydrates.value || 0, fat.value || 0),
  );

  async function save(): Promise<void> {
    const input: MealInput = {
      date: isEdit.value ? (store.current?.date ?? store.date) : store.date,
      foodName: foodName.value,
      quantity: quantity.value || 0,
      unit: 'g',
      protein: protein.value || 0,
      carbohydrates: carbohydrates.value || 0,
      fat: fat.value || 0,
      loggedAt: isEdit.value ? (store.current?.loggedAt ?? new Date()) : new Date(),
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

  function cancel(): void {
    void router.push('/nutricion');
  }

  onMounted(async () => {
    if (isEdit.value && mealId.value) {
      await store.loadMeal(mealId.value);
      const meal = store.current;
      if (meal) {
        foodName.value = meal.foodName;
        quantity.value = meal.quantity;
        protein.value = meal.protein;
        carbohydrates.value = meal.carbohydrates;
        fat.value = meal.fat;
      }
    }
  });

  return { isEdit, foodName, quantity, protein, carbohydrates, fat, calories, save, cancel };
}
