import type {
  RoutineRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';

export function deleteRoutine(
  routineRepository: RoutineRepository,
  routineExerciseRepository: RoutineExerciseRepository,
) {
  return async (id: string): Promise<void> => {
    const pivots = await routineExerciseRepository.findByRoutine(id);
    for (const pivot of pivots) {
      await routineExerciseRepository.delete(pivot.id);
    }
    await routineRepository.delete(id);
  };
}
