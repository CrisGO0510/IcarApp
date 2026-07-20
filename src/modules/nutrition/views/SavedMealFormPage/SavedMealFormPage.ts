import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useSavedMealStore } from '../../stores/savedMeal.store';
import { SAVED_MEALS_PATH, type SavedMealInput } from '../../types/nutrition.types';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

const NOT_FOUND_MESSAGE = 'No se encontró la comida guardada.';

export function useSavedMealFormPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useSavedMealStore();
  const { confirmDestructive } = useConfirmDialog();

  const mealId = computed(() => (route.params.id as string | undefined) ?? null);
  const isEdit = computed(() => mealId.value !== null);

  const name = ref('');
  const protein = ref<number>(0);
  const carbohydrates = ref<number>(0);
  const fat = ref<number>(0);
  const calories = ref<number>(0);
  const unitGrams = ref<number>(0);

  function buildInput(): SavedMealInput {
    return {
      name: name.value,
      proteinPerBase: protein.value || 0,
      carbohydratesPerBase: carbohydrates.value || 0,
      fatPerBase: fat.value || 0,
      caloriesPerBase: calories.value > 0 ? calories.value : null,
      unitGrams: unitGrams.value > 0 ? unitGrams.value : null,
    };
  }

  async function save(): Promise<void> {
    try {
      if (isEdit.value && mealId.value) {
        await store.update(mealId.value, buildInput());
      } else {
        await store.create(buildInput());
      }
      await router.push(SAVED_MEALS_PATH);
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
      title: 'Eliminar comida guardada',
      message: 'Se eliminará de tu biblioteca. Las comidas ya registradas no cambian. ¿Eliminar?',
      onConfirm: () => {
        void store
          .remove(id)
          .then(() => router.push(SAVED_MEALS_PATH))
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
    void router.push(SAVED_MEALS_PATH);
  }

  onMounted(async () => {
    if (!isEdit.value || !mealId.value) return;
    try {
      await store.loadOne(mealId.value);
      const meal = store.current;
      if (!meal) throw new Error(NOT_FOUND_MESSAGE);
      name.value = meal.name;
      protein.value = meal.proteinPerBase;
      carbohydrates.value = meal.carbohydratesPerBase;
      fat.value = meal.fatPerBase;
      calories.value = meal.caloriesPerBase;
      unitGrams.value = meal.unitGrams ?? 0;
    } catch {
      $q.notify({ type: 'negative', message: NOT_FOUND_MESSAGE });
      void router.replace(SAVED_MEALS_PATH);
    }
  });

  return {
    isEdit,
    name,
    protein,
    carbohydrates,
    fat,
    calories,
    unitGrams,
    save,
    remove,
    cancel,
  };
}
