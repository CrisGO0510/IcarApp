import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry, MealInput } from '../types/nutrition.types';
import { resolveMealCalories } from './resolveMealCalories';

export function logMeal(repository: MealEntryRepository) {
  return async (input: MealInput): Promise<MealEntry> => {
    const foodName = input.foodName.trim();
    if (!foodName) {
      throw new Error('El nombre de la comida es obligatorio.');
    }
    if (input.quantity < 0) {
      throw new Error('La cantidad no puede ser negativa.');
    }

    const calories = resolveMealCalories(
      input.calories,
      input.protein,
      input.carbohydrates,
      input.fat,
    );

    return repository.create({
      date: input.date,
      loggedAt: input.loggedAt,
      foodName,
      quantity: input.quantity,
      unit: input.unit,
      protein: input.protein,
      carbohydrates: input.carbohydrates,
      fat: input.fat,
      calories,
      ...(input.notes ? { notes: input.notes } : {}),
    });
  };
}
