import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { ExerciseSet, SetDayGroup } from '../types/training.types';
import { WorkoutSessionJsonRepository } from '../repositories/workout-session.json-repository';
import { ExerciseSetJsonRepository } from '../repositories/exercise-set.json-repository';
import { RoutineExerciseJsonRepository } from '../repositories/routine-exercise.json-repository';
import {
  logSet,
  getLastSets,
  getLastSet,
  updateSet,
  deleteSet,
  type SetInput,
  type SetEditInput,
} from '../use-cases/workoutSession';
import { groupSetsByDay } from '../use-cases/exerciseHistory';
import { findSetsByExerciseId } from '../use-cases/findSetsByExerciseId';

export const useWorkoutStore = defineStore('workout', () => {
  const sessionRepo = new WorkoutSessionJsonRepository();
  const setRepo = new ExerciseSetJsonRepository();
  const pivotRepo = new RoutineExerciseJsonRepository();

  const _log = logSet(sessionRepo, setRepo);
  const _lastSets = getLastSets(setRepo);
  const _lastSet = getLastSet(setRepo);
  const _updateSet = updateSet(setRepo);
  const _deleteSet = deleteSet(setRepo);

  const lastSets = ref<Record<string, ExerciseSet>>({});
  const history = ref<SetDayGroup[]>([]);

  const restRemaining = ref(0);
  const restRunning = ref(false);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  async function loadLastSets(): Promise<void> {
    lastSets.value = await _lastSets();
  }

  async function loadHistory(routineExerciseId: string): Promise<void> {
    history.value = groupSetsByDay(await setRepo.findByExercise(routineExerciseId));
  }

  async function loadHistoryByExerciseId(exerciseId: string): Promise<void> {
    const _find = findSetsByExerciseId(pivotRepo, setRepo);
    history.value = groupSetsByDay(await _find(exerciseId));
  }

  async function lastSetDefaults(
    routineExerciseId: string,
  ): Promise<{ reps: number; weight: number }> {
    const last = await _lastSet(routineExerciseId);
    return { reps: last?.reps ?? 0, weight: last?.weight ?? 0 };
  }

  async function logExerciseSet(
    routineId: string,
    routineExerciseId: string,
    input: SetInput,
  ): Promise<void> {
    await _log(routineId, routineExerciseId, input, new Date());
    await loadLastSets();
  }

  async function editSet(
    routineExerciseId: string,
    id: string,
    input: SetEditInput,
  ): Promise<void> {
    await _updateSet(id, input);
    await loadHistory(routineExerciseId);
    await loadLastSets();
  }

  async function removeSet(routineExerciseId: string, id: string): Promise<void> {
    await _deleteSet(id);
    await loadHistory(routineExerciseId);
    await loadLastSets();
  }

  function stopRest(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    restRunning.value = false;
    restRemaining.value = 0;
  }

  function startRest(seconds: number): void {
    stopRest();
    restRemaining.value = seconds;
    restRunning.value = true;
    intervalId = setInterval(() => {
      restRemaining.value -= 1;
      if (restRemaining.value <= 0) {
        stopRest();
      }
    }, 1000);
  }

  return {
    lastSets,
    history,
    restRemaining,
    restRunning,
    loadLastSets,
    loadHistory,
    loadHistoryByExerciseId,
    lastSetDefaults,
    logExerciseSet,
    editSet,
    removeSet,
    startRest,
    stopRest,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkoutStore, import.meta.hot));
}
