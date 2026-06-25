import type { MacroGoalRepository } from '../repositories/nutrition.repository.port';
import type { MacroGoal, MacroGoalInput } from '../types/nutrition.types';

export function getActiveMacroGoal(repository: MacroGoalRepository) {
  return (): Promise<MacroGoal | null> => repository.findActive();
}

export function saveMacroGoal(repository: MacroGoalRepository) {
  return async (input: MacroGoalInput): Promise<MacroGoal> => {
    if (input.calorieGoal < 0) {
      throw new Error('Las calorías no pueden ser negativas.');
    }

    const active = await repository.findActive();
    if (active) {
      const updated = await repository.update(active.id, { ...input, isActive: true });
      if (!updated) {
        throw new Error('No se pudo actualizar la meta de macros.');
      }
      return updated;
    }
    return repository.create({ ...input, isActive: true });
  };
}
