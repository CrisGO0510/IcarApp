import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry, MealInput } from '../types/nutrition.types';
import { resolveMealCalories } from './resolveMealCalories';
import { round1 } from './scaleMealFromReference';

export function logMeal(repository: MealEntryRepository) {
  return async (input: MealInput): Promise<MealEntry> => {
    const foodName = input.foodName.trim();
    if (!foodName) {
      throw new Error('El nombre de la comida es obligatorio.');
    }
    if (input.quantity < 0) {
      throw new Error('La cantidad no puede ser negativa.');
    }

    const protein = round1(input.protein);
    const carbohydrates = round1(input.carbohydrates);
    const fat = round1(input.fat);
    const calories = resolveMealCalories(input.calories, protein, carbohydrates, fat);

    return repository.create({
      date: input.date,
      loggedAt: input.loggedAt,
      foodName,
      quantity: input.quantity,
      unit: input.unit,
      protein,
      carbohydrates,
      fat,
      calories,
      ...(input.notes ? { notes: input.notes } : {}),
    });
  };
}
