import type { RoutineRepository } from '../repositories/training.repository.port';
import type { Routine } from '../types/training.types';

export function createRoutine(repository: RoutineRepository) {
  return async (name: string): Promise<Routine> => {
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('El nombre de la rutina es obligatorio.');
    }

    return repository.create({ name: cleanName, isActive: true });
  };
}
