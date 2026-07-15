import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  ALL_FILTER,
  type ProgressInput,
  type ProgressRange,
  type VolumeFilters,
} from '../types/progress.types';
import { buildProgressSummary } from '../use-cases/buildProgressSummary';
import { getProgressInput } from '../use-cases/getProgressInput';
import { RoutineJsonRepository } from 'src/modules/training/repositories/routine.json-repository';
import { RoutineExerciseJsonRepository } from 'src/modules/training/repositories/routine-exercise.json-repository';
import { ExerciseJsonRepository } from 'src/modules/training/repositories/exercise.json-repository';
import { WorkoutSessionJsonRepository } from 'src/modules/training/repositories/workout-session.json-repository';
import { ExerciseSetJsonRepository } from 'src/modules/training/repositories/exercise-set.json-repository';
import { BodyWeightLogJsonRepository } from 'src/modules/measurements/repositories/body-weight.json-repository';
import { MealEntryJsonRepository } from 'src/modules/nutrition/repositories/meal-entry.json-repository';
import { ActivityEntryJsonRepository } from 'src/modules/nutrition/repositories/activity-entry.json-repository';
import { MacroGoalJsonRepository } from 'src/modules/nutrition/repositories/macro-goal.json-repository';

export const useProgressStore = defineStore('progress', () => {
  const now = new Date();

  const loadInput = getProgressInput({
    routineRepo: new RoutineJsonRepository(),
    pivotRepo: new RoutineExerciseJsonRepository(),
    exerciseRepo: new ExerciseJsonRepository(),
    sessionRepo: new WorkoutSessionJsonRepository(),
    setRepo: new ExerciseSetJsonRepository(),
    bodyWeightRepo: new BodyWeightLogJsonRepository(),
    mealEntryRepo: new MealEntryJsonRepository(),
    activityRepo: new ActivityEntryJsonRepository(),
    macroGoalRepo: new MacroGoalJsonRepository(),
  });

  const range = ref<ProgressRange>('1M');
  const filters = ref<VolumeFilters>({ routine: ALL_FILTER, type: ALL_FILTER });
  const input = ref<ProgressInput>({
    bodyWeightLog: [],
    sessionVolumes: [],
    consumedCalories: [],
    burnedCalories: [],
    calorieGoal: null,
  });

  const summary = computed(() =>
    buildProgressSummary(input.value, range.value, filters.value, now),
  );

  async function load(): Promise<void> {
    input.value = await loadInput();
  }

  function setRange(value: ProgressRange): void {
    range.value = value;
  }

  function setRoutine(routine: string): void {
    filters.value = { ...filters.value, routine };
  }

  function setType(type: string): void {
    filters.value = { ...filters.value, type };
  }

  return { range, filters, summary, load, setRange, setRoutine, setType };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgressStore, import.meta.hot));
}
