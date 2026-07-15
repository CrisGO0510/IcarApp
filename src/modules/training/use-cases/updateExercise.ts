import type { ExerciseRepository } from '../repositories/training.repository.port';
import type { Exercise, WeightUnit } from '../types/training.types';

export function updateExercise(repository: ExerciseRepository) {
  return async (
    id: string,
    name: string,
    restTime: number | null,
    weightUnit: WeightUnit,
  ): Promise<Exercise> => {
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('El nombre del ejercicio es obligatorio.');
    }

    const all = await repository.findAll();
    const isDuplicate = all.some(
      (exercise) => exercise.id !== id && exercise.name.toLowerCase() === cleanName.toLowerCase(),
    );
    if (isDuplicate) {
      throw new Error('Ya existe un ejercicio con ese nombre.');
    }

    const updated = await repository.update(id, { name: cleanName, restTime, weightUnit });
    if (!updated) {
      throw new Error('El ejercicio no existe.');
    }
    return updated;
  };
}
