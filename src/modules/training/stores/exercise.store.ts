import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Exercise, WeightUnit } from '../types/training.types';
import { ExerciseJsonRepository } from '../repositories/exercise.json-repository';
import { RoutineExerciseJsonRepository } from '../repositories/routine-exercise.json-repository';
import { listExercises } from '../use-cases/listExercises';
import { createExercise } from '../use-cases/createExercise';
import { updateExercise } from '../use-cases/updateExercise';
import { deleteExercise } from '../use-cases/deleteExercise';
import { seedExercises } from '../use-cases/seedExercises';
import { filterExercises, sortExercises, type ExerciseSort } from '../use-cases/exerciseQuery';

export const useExerciseStore = defineStore('exercise', () => {
  const repository = new ExerciseJsonRepository();
  const pivotRepository = new RoutineExerciseJsonRepository();
  const list = listExercises(repository);
  const add = createExercise(repository);
  const edit = updateExercise(repository);
  const remove = deleteExercise(repository, pivotRepository);
  const seed = seedExercises(repository);

  const exercises = ref<Exercise[]>([]);
  const query = ref('');
  const sort = ref<ExerciseSort>('alpha');
  const loaded = ref(false);

  const visibleExercises = computed(() =>
    sortExercises(filterExercises(exercises.value, query.value), sort.value),
  );

  async function load(): Promise<void> {
    if (loaded.value) return;
    await seed();
    exercises.value = await list();
    loaded.value = true;
  }

  async function create(name: string): Promise<void> {
    const created = await add(name);
    exercises.value = [...exercises.value, created];
  }

  async function update(
    id: string,
    name: string,
    restTime: number | null,
    weightUnit: WeightUnit,
  ): Promise<void> {
    const updated = await edit(id, name, restTime, weightUnit);
    exercises.value = exercises.value.map((exercise) =>
      exercise.id === id ? updated : exercise,
    );
  }

  async function deleteById(id: string): Promise<void> {
    await remove(id);
    exercises.value = exercises.value.filter((exercise) => exercise.id !== id);
  }

  function setQuery(value: string): void {
    query.value = value;
  }

  function setSort(value: ExerciseSort): void {
    sort.value = value;
  }

  return {
    exercises,
    query,
    sort,
    visibleExercises,
    load,
    create,
    update,
    deleteById,
    setQuery,
    setSort,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExerciseStore, import.meta.hot));
}
