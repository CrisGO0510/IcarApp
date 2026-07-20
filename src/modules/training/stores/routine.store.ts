import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { Preferences } from '@capacitor/preferences';
import type {
  Routine,
  RoutineExerciseView,
  RoutineSortMode,
  RoutineSummary,
} from '../types/training.types';
import { ROUTINE_SORT_MODE, ROUTINE_SORT_MODES } from '../types/training.types';
import { RoutineJsonRepository } from '../repositories/routine.json-repository';
import { RoutineExerciseJsonRepository } from '../repositories/routine-exercise.json-repository';
import { ExerciseJsonRepository } from '../repositories/exercise.json-repository';
import { WorkoutSessionJsonRepository } from '../repositories/workout-session.json-repository';
import { ExerciseSetJsonRepository } from '../repositories/exercise-set.json-repository';
import { listRoutines } from '../use-cases/listRoutines';
import { getRoutineDetail } from '../use-cases/getRoutineDetail';
import { createRoutine } from '../use-cases/createRoutine';
import { updateRoutine } from '../use-cases/updateRoutine';
import { deleteRoutine } from '../use-cases/deleteRoutine';
import { syncRoutineExercises } from '../use-cases/syncRoutineExercises';
import { removeRoutineExercise } from '../use-cases/removeRoutineExercise';
import { sortRoutineSummaries } from '../use-cases/sortRoutineSummaries';

export const ROUTINE_SORT_KEY = 'icarapp:routine_sort';

const DEFAULT_SORT_MODE: RoutineSortMode = ROUTINE_SORT_MODE.RECENT;

export const useRoutineStore = defineStore('routine', () => {
  const routineRepo = new RoutineJsonRepository();
  const pivotRepo = new RoutineExerciseJsonRepository();
  const exerciseRepo = new ExerciseJsonRepository();
  const sessionRepo = new WorkoutSessionJsonRepository();
  const setRepo = new ExerciseSetJsonRepository();

  const _list = listRoutines(routineRepo, pivotRepo, sessionRepo, setRepo);
  const _detail = getRoutineDetail(routineRepo, pivotRepo, exerciseRepo, sessionRepo);
  const _create = createRoutine(routineRepo);
  const _update = updateRoutine(routineRepo);
  const _delete = deleteRoutine(routineRepo, pivotRepo);
  const _sync = syncRoutineExercises(pivotRepo);
  const _removeExercise = removeRoutineExercise(pivotRepo);

  const summaries = ref<RoutineSummary[]>([]);
  const sortMode = ref<RoutineSortMode>(DEFAULT_SORT_MODE);
  const current = ref<Routine | null>(null);
  const currentExercises = ref<RoutineExerciseView[]>([]);
  const currentInProgress = ref(false);

  const sortedSummaries = computed(() => sortRoutineSummaries(summaries.value, sortMode.value));

  async function loadList(): Promise<void> {
    const saved = await Preferences.get({ key: ROUTINE_SORT_KEY });
    if (saved.value && (ROUTINE_SORT_MODES as readonly string[]).includes(saved.value)) {
      sortMode.value = saved.value as RoutineSortMode;
    }
    summaries.value = await _list();
  }

  async function setSortMode(mode: RoutineSortMode): Promise<void> {
    sortMode.value = mode;
    await Preferences.set({ key: ROUTINE_SORT_KEY, value: mode });
  }

  async function loadDetail(id: string): Promise<void> {
    const detail = await _detail(id);
    current.value = detail.routine;
    currentExercises.value = detail.exercises;
    currentInProgress.value = detail.inProgress;
  }

  async function create(name: string, exerciseIds: string[]): Promise<Routine> {
    const routine = await _create(name);
    await _sync(routine.id, exerciseIds);
    return routine;
  }

  async function update(id: string, name: string, exerciseIds: string[]): Promise<void> {
    await _update(id, name);
    await _sync(id, exerciseIds);
  }

  async function remove(id: string): Promise<void> {
    await _delete(id);
    summaries.value = summaries.value.filter((summary) => summary.routine.id !== id);
  }

  async function removeExercise(pivotId: string): Promise<void> {
    await _removeExercise(pivotId);
    currentExercises.value = currentExercises.value.filter((view) => view.pivotId !== pivotId);
  }

  return {
    summaries,
    sortMode,
    sortedSummaries,
    current,
    currentExercises,
    currentInProgress,
    loadList,
    setSortMode,
    loadDetail,
    create,
    update,
    remove,
    removeExercise,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoutineStore, import.meta.hot));
}
