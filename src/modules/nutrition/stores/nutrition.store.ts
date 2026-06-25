import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type {
  MacroGoal,
  MacroGoalInput,
  MealEntry,
  MealInput,
  NutritionDay,
} from '../types/nutrition.types';
import { MealEntryJsonRepository } from '../repositories/meal-entry.json-repository';
import { MacroGoalJsonRepository } from '../repositories/macro-goal.json-repository';
import { logMeal } from '../use-cases/logMeal';
import { updateMeal } from '../use-cases/updateMeal';
import { deleteMeal } from '../use-cases/deleteMeal';
import { listMealsByDate } from '../use-cases/listMealsByDate';
import { getMeal } from '../use-cases/getMeal';
import { buildNutritionDay } from '../use-cases/buildNutritionDay';
import { getActiveMacroGoal, saveMacroGoal } from '../use-cases/macroGoal';

function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useNutritionStore = defineStore('nutrition', () => {
  const mealRepo = new MealEntryJsonRepository();
  const goalRepo = new MacroGoalJsonRepository();

  const _log = logMeal(mealRepo);
  const _update = updateMeal(mealRepo);
  const _delete = deleteMeal(mealRepo);
  const _list = listMealsByDate(mealRepo);
  const _get = getMeal(mealRepo);
  const _getGoal = getActiveMacroGoal(goalRepo);
  const _saveGoal = saveMacroGoal(goalRepo);

  const date = ref<string>(todayKey());
  const day = ref<NutritionDay | null>(null);
  const goal = ref<MacroGoal | null>(null);
  const current = ref<MealEntry | null>(null);

  async function loadDay(target: string = todayKey()): Promise<void> {
    date.value = target;
    goal.value = await _getGoal();
    const entries = await _list(target);
    day.value = buildNutritionDay(target, entries, goal.value);
  }

  async function loadGoal(): Promise<void> {
    goal.value = await _getGoal();
  }

  async function loadMeal(id: string): Promise<void> {
    current.value = await _get(id);
  }

  async function log(input: MealInput): Promise<void> {
    await _log(input);
    await loadDay(date.value);
  }

  async function update(id: string, input: MealInput): Promise<void> {
    await _update(id, input);
    await loadDay(date.value);
  }

  async function remove(id: string): Promise<void> {
    await _delete(id);
    await loadDay(date.value);
  }

  async function saveGoal(input: MacroGoalInput): Promise<void> {
    goal.value = await _saveGoal(input);
  }

  return {
    date,
    day,
    goal,
    current,
    loadDay,
    loadGoal,
    loadMeal,
    log,
    update,
    remove,
    saveGoal,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNutritionStore, import.meta.hot));
}
