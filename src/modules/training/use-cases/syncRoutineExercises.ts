import type { RoutineExerciseRepository } from '../repositories/training.repository.port';

export function syncRoutineExercises(repository: RoutineExerciseRepository) {
  return async (routineId: string, exerciseIds: string[]): Promise<void> => {
    const existing = await repository.findByRoutine(routineId);
    const desired = new Set(exerciseIds);

    for (const pivot of existing) {
      if (!desired.has(pivot.exerciseId)) {
        await repository.delete(pivot.id);
      }
    }

    const byExerciseId = new Map(existing.map((pivot) => [pivot.exerciseId, pivot]));

    for (let orderIndex = 0; orderIndex < exerciseIds.length; orderIndex++) {
      const exerciseId = exerciseIds[orderIndex]!;
      const pivot = byExerciseId.get(exerciseId);

      if (!pivot) {
        await repository.create({ routineId, exerciseId, orderIndex });
      } else if (pivot.orderIndex !== orderIndex) {
        await repository.update(pivot.id, { orderIndex });
      }
    }
  };
}
