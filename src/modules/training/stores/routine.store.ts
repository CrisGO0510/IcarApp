import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Routine, RoutineExerciseView, RoutineSummary } from '../types/training.types';
import { RoutineJsonRepository } from '../repositories/routine.json-repository';
import { RoutineExerciseJsonRepository } from '../repositories/routine-exercise.json-repository';
import { ExerciseJsonRepository } from '../repositories/exercise.json-repository';
import { listRoutines } from '../use-cases/listRoutines';
import { getRoutineDetail } from '../use-cases/getRoutineDetail';
import { createRoutine } from '../use-cases/createRoutine';
import { updateRoutine } from '../use-cases/updateRoutine';
import { deleteRoutine } from '../use-cases/deleteRoutine';
import { syncRoutineExercises } from '../use-cases/syncRoutineExercises';

export const useRoutineStore = defineStore('routine', () => {
  const routineRepo = new RoutineJsonRepository();
  const pivotRepo = new RoutineExerciseJsonRepository();
  const exerciseRepo = new ExerciseJsonRepository();

  const _list = listRoutines(routineRepo, pivotRepo);
  const _detail = getRoutineDetail(routineRepo, pivotRepo, exerciseRepo);
  const _create = createRoutine(routineRepo);
  const _update = updateRoutine(routineRepo);
  const _delete = deleteRoutine(routineRepo, pivotRepo);
  const _sync = syncRoutineExercises(pivotRepo);

  const summaries = ref<RoutineSummary[]>([]);
  const current = ref<Routine | null>(null);
  const currentExercises = ref<RoutineExerciseView[]>([]);

  async function loadList(): Promise<void> {
    summaries.value = await _list();
  }

  async function loadDetail(id: string): Promise<void> {
    const detail = await _detail(id);
    current.value = detail.routine;
    currentExercises.value = detail.exercises;
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

  return {
    summaries,
    current,
    currentExercises,
    loadList,
    loadDetail,
    create,
    update,
    remove,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoutineStore, import.meta.hot));
}
