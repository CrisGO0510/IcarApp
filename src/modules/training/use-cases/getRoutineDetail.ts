import type {
  ExerciseRepository,
  RoutineRepository,
  RoutineExerciseRepository,
  WorkoutSessionRepository,
} from '../repositories/training.repository.port';
import type { Routine, RoutineExerciseView } from '../types/training.types';
import { joinRoutineExercises } from './joinRoutineExercises';

export interface RoutineDetail {
  routine: Routine;
  exercises: RoutineExerciseView[];
  inProgress: boolean;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getRoutineDetail(
  routineRepository: RoutineRepository,
  routineExerciseRepository: RoutineExerciseRepository,
  exerciseRepository: ExerciseRepository,
  sessionRepository: WorkoutSessionRepository,
) {
  return async (id: string, now: Date = new Date()): Promise<RoutineDetail> => {
    const routine = await routineRepository.findById(id);
    if (!routine) {
      throw new Error('La rutina no existe.');
    }

    const pivots = await routineExerciseRepository.findByRoutine(id);
    const exercises = await exerciseRepository.findAll();
    const sessions = await sessionRepository.findByRoutine(id);
    const inProgress = sessions.some(
      (session) => isSameDay(session.startedAt, now) && !session.isCompleted,
    );

    return { routine, exercises: joinRoutineExercises(pivots, exercises), inProgress };
  };
}
