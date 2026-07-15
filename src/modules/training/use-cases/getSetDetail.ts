import type {
  ExerciseSetRepository,
  RoutineExerciseRepository,
  ExerciseRepository,
} from '../repositories/training.repository.port';
import type { ExerciseSet, WeightUnit } from '../types/training.types';

export interface SetDetail {
  set: ExerciseSet;
  exerciseName: string;
  weightUnit?: WeightUnit | undefined;
}

const FALLBACK_EXERCISE_NAME = 'Ejercicio';
const SET_DETAIL_NOT_FOUND_MESSAGE = 'No se encontró la serie.';

export function getSetDetail(
  setRepository: ExerciseSetRepository,
  pivotRepository: RoutineExerciseRepository,
  exerciseRepository: ExerciseRepository,
) {
  return async (setId: string): Promise<SetDetail> => {
    const set = await setRepository.findById(setId);
    if (!set) {
      throw new Error(SET_DETAIL_NOT_FOUND_MESSAGE);
    }
    const pivot = await pivotRepository.findById(set.routineExerciseId);
    const exercise = pivot ? await exerciseRepository.findById(pivot.exerciseId) : null;
    return {
      set,
      exerciseName: exercise?.name ?? FALLBACK_EXERCISE_NAME,
      weightUnit: exercise?.weightUnit,
    };
  };
}
