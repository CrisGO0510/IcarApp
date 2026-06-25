import type { ExerciseRepository } from '../repositories/training.repository.port';
import type { Exercise } from '../types/training.types';

export function createExercise(repository: ExerciseRepository) {
  return async (name: string): Promise<Exercise> => {
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('El nombre del ejercicio es obligatorio.');
    }

    const existing = await repository.findAll();
    const isDuplicate = existing.some(
      (exercise) => exercise.name.toLowerCase() === cleanName.toLowerCase(),
    );
    if (isDuplicate) {
      throw new Error('Ya existe un ejercicio con ese nombre.');
    }

    return repository.create({ name: cleanName });
  };
}
