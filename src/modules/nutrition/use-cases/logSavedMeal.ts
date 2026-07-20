import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import { MASS_UNIT, QUANTITY_MODE, SAVED_MEAL_BASE_GRAMS } from '../types/nutrition.types';
import type { MealEntry, SavedMeal, SavedMealLogRequest } from '../types/nutrition.types';
import { logMeal } from './logMeal';
import { scaleMealFromReference } from './scaleMealFromReference';

export function logSavedMeal(repository: MealEntryRepository) {
  const log = logMeal(repository);
  return async (meal: SavedMeal, request: SavedMealLogRequest): Promise<MealEntry> => {
    if (request.amount <= 0) {
      throw new Error('La cantidad debe ser mayor a cero.');
    }

    let grams = request.amount;
    if (request.mode === QUANTITY_MODE.UNITS) {
      if (meal.unitGrams === null) {
        throw new Error('Esta comida no tiene definido el peso por unidad.');
      }
      grams = request.amount * meal.unitGrams;
    }

    const scaled = scaleMealFromReference(
      {
        base: SAVED_MEAL_BASE_GRAMS,
        protein: meal.proteinPerBase,
        carbohydrates: meal.carbohydratesPerBase,
        fat: meal.fatPerBase,
        calories: meal.caloriesPerBase,
      },
      grams,
    );

    return log({
      date: request.date,
      foodName: meal.name,
      quantity: grams,
      unit: MASS_UNIT,
      protein: scaled.protein,
      carbohydrates: scaled.carbohydrates,
      fat: scaled.fat,
      calories: scaled.calories,
      loggedAt: new Date(),
    });
  };
}
