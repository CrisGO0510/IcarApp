import type { ExerciseRepository } from '../repositories/training.repository.port';
import type { Exercise } from '../types/training.types';

export function listExercises(repository: ExerciseRepository) {
  return async (): Promise<Exercise[]> => repository.findAll();
}
