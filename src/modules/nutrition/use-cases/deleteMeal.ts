import type { MealEntryRepository } from '../repositories/nutrition.repository.port';

export function deleteMeal(repository: MealEntryRepository) {
  return async (id: string): Promise<void> => {
    await repository.delete(id);
  };
}
