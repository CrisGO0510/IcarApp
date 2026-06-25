import type {
  RoutineRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';
import type { RoutineSummary } from '../types/training.types';
import { countByRoutine } from './joinRoutineExercises';

export function listRoutines(
  routineRepository: RoutineRepository,
  routineExerciseRepository: RoutineExerciseRepository,
) {
  return async (): Promise<RoutineSummary[]> => {
    const routines = await routineRepository.findAll();
    const pivots = await routineExerciseRepository.findAll();
    const counts = countByRoutine(pivots);

    return routines
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((routine) => ({ routine, exerciseCount: counts.get(routine.id) ?? 0 }));
  };
}
