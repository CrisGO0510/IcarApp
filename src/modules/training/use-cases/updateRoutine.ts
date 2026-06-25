import type { RoutineRepository } from '../repositories/training.repository.port';
import type { Routine } from '../types/training.types';

export function updateRoutine(repository: RoutineRepository) {
  return async (id: string, name: string): Promise<Routine> => {
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('El nombre de la rutina es obligatorio.');
    }

    const updated = await repository.update(id, { name: cleanName });
    if (!updated) {
      throw new Error('La rutina no existe.');
    }
    return updated;
  };
}
