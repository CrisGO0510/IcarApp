import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { DashboardSummary } from '../types/activity.types';
import { getDashboardSummary } from '../use-cases/getDashboardSummary';
import { RoutineJsonRepository } from 'src/modules/training/repositories/routine.json-repository';
import { RoutineExerciseJsonRepository } from 'src/modules/training/repositories/routine-exercise.json-repository';
import { ExerciseJsonRepository } from 'src/modules/training/repositories/exercise.json-repository';
import { WorkoutSessionJsonRepository } from 'src/modules/training/repositories/workout-session.json-repository';
import { ExerciseSetJsonRepository } from 'src/modules/training/repositories/exercise-set.json-repository';
import { MealEntryJsonRepository } from 'src/modules/nutrition/repositories/meal-entry.json-repository';
import { MacroGoalJsonRepository } from 'src/modules/nutrition/repositories/macro-goal.json-repository';
import { ActivityEntryJsonRepository } from 'src/modules/nutrition/repositories/activity-entry.json-repository';
import { BodyWeightLogJsonRepository } from 'src/modules/measurements/repositories/body-weight.json-repository';

export const useActivityStore = defineStore('activity', () => {
  const buildSummary = getDashboardSummary({
    routineRepo: new RoutineJsonRepository(),
    pivotRepo: new RoutineExerciseJsonRepository(),
    exerciseRepo: new ExerciseJsonRepository(),
    sessionRepo: new WorkoutSessionJsonRepository(),
    setRepo: new ExerciseSetJsonRepository(),
    mealEntryRepo: new MealEntryJsonRepository(),
    macroGoalRepo: new MacroGoalJsonRepository(),
    activityRepo: new ActivityEntryJsonRepository(),
    bodyWeightRepo: new BodyWeightLogJsonRepository(),
  });

  const summary = ref<DashboardSummary | null>(null);

  async function loadDashboard(): Promise<void> {
    summary.value = await buildSummary();
  }

  return { summary, loadDashboard };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActivityStore, import.meta.hot));
}
