import type { ExerciseRepository } from '../repositories/training.repository.port';
import type {
  RoutineRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';
import type { Routine, RoutineExerciseView } from '../types/training.types';
import { joinRoutineExercises } from './joinRoutineExercises';

export interface RoutineDetail {
  routine: Routine;
  exercises: RoutineExerciseView[];
}

export function getRoutineDetail(
  routineRepository: RoutineRepository,
  routineExerciseRepository: RoutineExerciseRepository,
  exerciseRepository: ExerciseRepository,
) {
  return async (id: string): Promise<RoutineDetail> => {
    const routine = await routineRepository.findById(id);
    if (!routine) {
      throw new Error('La rutina no existe.');
    }

    const pivots = await routineExerciseRepository.findByRoutine(id);
    const exercises = await exerciseRepository.findAll();

    return { routine, exercises: joinRoutineExercises(pivots, exercises) };
  };
}
