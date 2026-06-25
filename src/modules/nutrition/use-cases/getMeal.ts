import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry } from '../types/nutrition.types';

export function getMeal(repository: MealEntryRepository) {
  return (id: string): Promise<MealEntry | null> => repository.findById(id);
}
