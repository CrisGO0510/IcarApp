import { SAVED_MEAL_BASE_GRAMS } from '../types/nutrition.types';
import { round1 } from './scaleMealFromReference';

export interface MealTotals {
  protein: number;
  carbohydrates: number;
  fat: number;
  calories: number;
}

export interface SavedMealMacros {
  caloriesPerBase: number;
  proteinPerBase: number;
  carbohydratesPerBase: number;
  fatPerBase: number;
}

export function normalizeSavedMeal(totals: MealTotals, grams: number): SavedMealMacros {
  if (grams <= 0) {
    throw new Error('La cantidad en gramos debe ser mayor a cero.');
  }

  const factor = SAVED_MEAL_BASE_GRAMS / grams;
  return {
    proteinPerBase: round1(totals.protein * factor),
    carbohydratesPerBase: round1(totals.carbohydrates * factor),
    fatPerBase: round1(totals.fat * factor),
    caloriesPerBase: Math.round(totals.calories * factor),
  };
}
