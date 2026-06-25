import type {
  RoutineRepository,
  RoutineExerciseRepository,
  WorkoutSessionRepository,
  ExerciseSetRepository,
} from '../repositories/training.repository.port';
import type { RoutineSummary } from '../types/training.types';
import { countByRoutine } from './joinRoutineExercises';
import { buildRoutineSessionMeta } from './routineSessionMeta';

export function listRoutines(
  routineRepository: RoutineRepository,
  routineExerciseRepository: RoutineExerciseRepository,
  sessionRepository: WorkoutSessionRepository,
  setRepository: ExerciseSetRepository,
) {
  return async (now: Date = new Date()): Promise<RoutineSummary[]> => {
    const routines = await routineRepository.findAll();
    const pivots = await routineExerciseRepository.findAll();
    const sessions = await sessionRepository.findAll();
    const sets = await setRepository.findAll();
    const counts = countByRoutine(pivots);

    return routines
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((routine) => ({
        routine,
        exerciseCount: counts.get(routine.id) ?? 0,
        ...buildRoutineSessionMeta(routine.id, sessions, sets, now),
      }));
  };
}
