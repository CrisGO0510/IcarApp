import type {
  Exercise,
  RoutineExercise,
  RoutineExerciseView,
} from '../types/training.types';

export function joinRoutineExercises(
  pivots: RoutineExercise[],
  exercises: Exercise[],
): RoutineExerciseView[] {
  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  return pivots
    .map((pivot) => {
      const exercise = byId.get(pivot.exerciseId);
      if (!exercise) return null;
      return { pivotId: pivot.id, exercise, orderIndex: pivot.orderIndex };
    })
    .filter((view): view is RoutineExerciseView => view !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function countByRoutine(pivots: RoutineExercise[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const pivot of pivots) {
    counts.set(pivot.routineId, (counts.get(pivot.routineId) ?? 0) + 1);
  }
  return counts;
}
