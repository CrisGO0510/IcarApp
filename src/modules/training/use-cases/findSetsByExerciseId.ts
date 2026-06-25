import type { RoutineExerciseRepository, ExerciseSetRepository } from '../repositories/training.repository.port';
import type { ExerciseSet } from '../types/training.types';

export function findSetsByExerciseId(
  pivotRepository: RoutineExerciseRepository,
  setRepository: ExerciseSetRepository,
) {
  return async (exerciseId: string): Promise<ExerciseSet[]> => {
    const allPivots = await pivotRepository.findAll();
    const pivotIds = allPivots
      .filter((pivot) => pivot.exerciseId === exerciseId)
      .map((pivot) => pivot.id);

    const results = await Promise.all(pivotIds.map((id) => setRepository.findByExercise(id)));
    return results.flat();
  };
}
