import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSavedMealStore } from '../../stores/savedMeal.store';
import { NEW_SAVED_MEAL_PATH, SAVED_MEALS_PATH } from '../../types/nutrition.types';

export function useSavedMealsPage() {
  const router = useRouter();
  const store = useSavedMealStore();
  const { visibleItems, query } = storeToRefs(store);

  const searchModel = computed({
    get: () => query.value,
    set: (value: string) => store.setQuery(value),
  });

  function addNew(): void {
    void router.push(NEW_SAVED_MEAL_PATH);
  }

  function openMeal(id: string): void {
    void router.push(`${SAVED_MEALS_PATH}/${id}/editar`);
  }

  onMounted(() => {
    void store.load();
  });

  return { visibleItems, searchModel, addNew, openMeal };
}
