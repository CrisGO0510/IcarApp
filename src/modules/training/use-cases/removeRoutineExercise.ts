import type { RoutineExerciseRepository } from '../repositories/training.repository.port';

export function removeRoutineExercise(repository: RoutineExerciseRepository) {
  return async (pivotId: string): Promise<void> => {
    await repository.delete(pivotId);
  };
}
