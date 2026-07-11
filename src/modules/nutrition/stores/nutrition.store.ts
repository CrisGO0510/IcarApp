import { computed, ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type {
  ActivityEntry,
  ActivityInput,
  MacroGoal,
  MacroGoalInput,
  MealEntry,
  MealInput,
  NutritionDay,
} from '../types/nutrition.types';
import { MealEntryJsonRepository } from '../repositories/meal-entry.json-repository';
import { MacroGoalJsonRepository } from '../repositories/macro-goal.json-repository';
import { ActivityEntryJsonRepository } from '../repositories/activity-entry.json-repository';
import { logMeal } from '../use-cases/logMeal';
import { updateMeal } from '../use-cases/updateMeal';
import { deleteMeal } from '../use-cases/deleteMeal';
import { listMealsByDate } from '../use-cases/listMealsByDate';
import { getMeal } from '../use-cases/getMeal';
import { buildNutritionDay } from '../use-cases/buildNutritionDay';
import { getActiveMacroGoal, saveMacroGoal } from '../use-cases/macroGoal';
import {
  logActivity,
  updateActivity,
  deleteActivity,
  listActivitiesByDate,
  getActivity,
} from '../use-cases/activityEntry';
import { todayKey, shiftDateKey, isTodayKey } from 'src/core/utils/dateKey';

export const useNutritionStore = defineStore('nutrition', () => {
  const mealRepo = new MealEntryJsonRepository();
  const goalRepo = new MacroGoalJsonRepository();
  const activityRepo = new ActivityEntryJsonRepository();

  const _log = logMeal(mealRepo);
  const _update = updateMeal(mealRepo);
  const _delete = deleteMeal(mealRepo);
  const _list = listMealsByDate(mealRepo);
  const _get = getMeal(mealRepo);
  const _getGoal = getActiveMacroGoal(goalRepo);
  const _saveGoal = saveMacroGoal(goalRepo);
  const _logActivity = logActivity(activityRepo);
  const _updateActivity = updateActivity(activityRepo);
  const _deleteActivity = deleteActivity(activityRepo);
  const _listActivities = listActivitiesByDate(activityRepo);
  const _getActivity = getActivity(activityRepo);

  const date = ref<string>(todayKey());
  const day = ref<NutritionDay | null>(null);
  const goal = ref<MacroGoal | null>(null);
  const current = ref<MealEntry | null>(null);
  const currentActivity = ref<ActivityEntry | null>(null);

  async function loadDay(target: string = todayKey()): Promise<void> {
    date.value = target;
    goal.value = await _getGoal();
    const [entries, activities] = await Promise.all([_list(target), _listActivities(target)]);
    day.value = buildNutritionDay(target, entries, goal.value, activities);
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

  async function loadActivity(id: string): Promise<void> {
    currentActivity.value = await _getActivity(id);
  }

  async function logActivityEntry(input: ActivityInput): Promise<void> {
    await _logActivity(input);
    await loadDay(date.value);
  }

  async function updateActivityEntry(id: string, input: ActivityInput): Promise<void> {
    await _updateActivity(id, input);
    await loadDay(date.value);
  }

  async function removeActivity(id: string): Promise<void> {
    await _deleteActivity(id);
    await loadDay(date.value);
  }

  const isToday = computed(() => isTodayKey(date.value));

  async function goToPreviousDay(): Promise<void> {
    await loadDay(shiftDateKey(date.value, -1));
  }

  async function goToNextDay(): Promise<void> {
    if (isToday.value) return;
    await loadDay(shiftDateKey(date.value, 1));
  }

  async function goToDate(target: string): Promise<void> {
    await loadDay(target);
  }

  return {
    date,
    day,
    goal,
    current,
    currentActivity,
    isToday,
    loadDay,
    loadGoal,
    loadMeal,
    loadActivity,
    log,
    update,
    remove,
    saveGoal,
    logActivityEntry,
    updateActivityEntry,
    removeActivity,
    goToPreviousDay,
    goToNextDay,
    goToDate,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNutritionStore, import.meta.hot));
}
