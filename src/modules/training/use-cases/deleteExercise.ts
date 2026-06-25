import type {
  ExerciseRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';

export function deleteExercise(
  exerciseRepository: ExerciseRepository,
  routineExerciseRepository: RoutineExerciseRepository,
) {
  return async (id: string): Promise<void> => {
    const pivots = await routineExerciseRepository.findAll();
    for (const pivot of pivots) {
      if (pivot.exerciseId === id) {
        await routineExerciseRepository.delete(pivot.id);
      }
    }
    await exerciseRepository.delete(id);
  };
}
