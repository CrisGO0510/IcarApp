import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry, MealInput } from '../types/nutrition.types';
import { resolveMealCalories } from './resolveMealCalories';

export function updateMeal(repository: MealEntryRepository) {
  return async (id: string, input: MealInput): Promise<MealEntry> => {
    const foodName = input.foodName.trim();
    if (!foodName) {
      throw new Error('El nombre de la comida es obligatorio.');
    }

    const calories = resolveMealCalories(
      input.calories,
      input.protein,
      input.carbohydrates,
      input.fat,
    );

    const updated = await repository.update(id, {
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
    if (!updated) {
      throw new Error('No se encontró la comida a actualizar.');
    }
    return updated;
  };
}
