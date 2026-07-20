import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { SavedMeal, SavedMealInput, SavedMealLogRequest } from '../types/nutrition.types';
import { SavedMealJsonRepository } from '../repositories/saved-meal.json-repository';
import { MealEntryJsonRepository } from '../repositories/meal-entry.json-repository';
import {
  createSavedMeal,
  updateSavedMeal,
  deleteSavedMeal,
  getSavedMeal,
  listSavedMeals,
} from '../use-cases/savedMeal';
import { logSavedMeal } from '../use-cases/logSavedMeal';

export const useSavedMealStore = defineStore('savedMeal', () => {
  const repository = new SavedMealJsonRepository();
  const mealEntryRepository = new MealEntryJsonRepository();

  const _list = listSavedMeals(repository);
  const _create = createSavedMeal(repository);
  const _update = updateSavedMeal(repository);
  const _delete = deleteSavedMeal(repository);
  const _get = getSavedMeal(repository);
  const _log = logSavedMeal(mealEntryRepository);

  const items = ref<SavedMeal[]>([]);
  const current = ref<SavedMeal | null>(null);
  const query = ref('');

  const visibleItems = computed(() => {
    const term = query.value.trim().toLowerCase();
    if (!term) return items.value;
    return items.value.filter((meal) => meal.name.toLowerCase().includes(term));
  });

  async function load(): Promise<void> {
    items.value = await _list();
  }

  async function loadOne(id: string): Promise<void> {
    current.value = await _get(id);
  }

  async function create(input: SavedMealInput): Promise<void> {
    await _create(input);
    await load();
  }

  async function update(id: string, input: SavedMealInput): Promise<void> {
    await _update(id, input);
    await load();
  }

  async function remove(id: string): Promise<void> {
    await _delete(id);
    items.value = items.value.filter((meal) => meal.id !== id);
  }

  async function logToDay(meal: SavedMeal, request: SavedMealLogRequest): Promise<void> {
    await _log(meal, request);
  }

  function setQuery(value: string): void {
    query.value = value;
  }

  return {
    items,
    current,
    query,
    visibleItems,
    load,
    loadOne,
    create,
    update,
    remove,
    logToDay,
    setQuery,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSavedMealStore, import.meta.hot));
}
