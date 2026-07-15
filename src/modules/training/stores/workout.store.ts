import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { ExerciseSet, SetDayGroup } from '../types/training.types';
import { WorkoutSessionJsonRepository } from '../repositories/workout-session.json-repository';
import { ExerciseSetJsonRepository } from '../repositories/exercise-set.json-repository';
import { RoutineExerciseJsonRepository } from '../repositories/routine-exercise.json-repository';
import { ExerciseJsonRepository } from '../repositories/exercise.json-repository';
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
import { getSetDetail, type SetDetail } from '../use-cases/getSetDetail';

export const useWorkoutStore = defineStore('workout', () => {
  const sessionRepo = new WorkoutSessionJsonRepository();
  const setRepo = new ExerciseSetJsonRepository();
  const pivotRepo = new RoutineExerciseJsonRepository();
  const exerciseRepo = new ExerciseJsonRepository();

  const _log = logSet(sessionRepo, setRepo);
  const _lastSets = getLastSets(setRepo);
  const _lastSet = getLastSet(setRepo);
  const _updateSet = updateSet(sessionRepo, setRepo, pivotRepo);
  const _deleteSet = deleteSet(sessionRepo, setRepo);
  const _setDetail = getSetDetail(setRepo, pivotRepo, exerciseRepo);

  const lastSets = ref<Record<string, ExerciseSet>>({});
  const history = ref<SetDayGroup[]>([]);

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

  async function editSet(id: string, input: SetEditInput): Promise<void> {
    await _updateSet(id, input);
    await loadLastSets();
  }

  async function removeSet(id: string): Promise<void> {
    await _deleteSet(id);
    await loadLastSets();
  }

  async function setDetail(id: string): Promise<SetDetail> {
    return _setDetail(id);
  }

  return {
    lastSets,
    history,
    loadLastSets,
    loadHistory,
    loadHistoryByExerciseId,
    lastSetDefaults,
    logExerciseSet,
    editSet,
    removeSet,
    setDetail,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkoutStore, import.meta.hot));
}
