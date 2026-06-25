import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry } from '../types/nutrition.types';

export function listMealsByDate(repository: MealEntryRepository) {
  return (date: string): Promise<MealEntry[]> => repository.findByDate(date);
}
