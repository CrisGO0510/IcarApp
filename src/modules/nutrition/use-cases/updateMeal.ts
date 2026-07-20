import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry, MealInput } from '../types/nutrition.types';
import { resolveMealCalories } from './resolveMealCalories';
import { round1 } from './scaleMealFromReference';

export function updateMeal(repository: MealEntryRepository) {
  return async (id: string, input: MealInput): Promise<MealEntry> => {
    const foodName = input.foodName.trim();
    if (!foodName) {
      throw new Error('El nombre de la comida es obligatorio.');
    }

    const protein = round1(input.protein);
    const carbohydrates = round1(input.carbohydrates);
    const fat = round1(input.fat);
    const calories = resolveMealCalories(input.calories, protein, carbohydrates, fat);

    const updated = await repository.update(id, {
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
    if (!updated) {
      throw new Error('No se encontró la comida a actualizar.');
    }
    return updated;
  };
}
