import type { SavedMealRepository } from '../repositories/nutrition.repository.port';
import type { SavedMeal, SavedMealInput } from '../types/nutrition.types';
import { computeCalories } from './computeCalories';
import { round1 } from './scaleMealFromReference';

type SavedMealData = Omit<SavedMeal, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

function validate(input: SavedMealInput): void {
  if (!input.name.trim()) {
    throw new Error('El nombre de la comida es obligatorio.');
  }
  if (input.proteinPerBase < 0 || input.carbohydratesPerBase < 0 || input.fatPerBase < 0) {
    throw new Error('Los macros no pueden ser negativos.');
  }
  if (input.unitGrams !== null && input.unitGrams <= 0) {
    throw new Error('Los gramos por unidad deben ser mayores a cero.');
  }
}

function toData(input: SavedMealInput): SavedMealData {
  const proteinPerBase = round1(input.proteinPerBase);
  const carbohydratesPerBase = round1(input.carbohydratesPerBase);
  const fatPerBase = round1(input.fatPerBase);
  return {
    name: input.name.trim(),
    proteinPerBase,
    carbohydratesPerBase,
    fatPerBase,
    caloriesPerBase:
      input.caloriesPerBase !== null && input.caloriesPerBase > 0
        ? Math.round(input.caloriesPerBase)
        : computeCalories(proteinPerBase, carbohydratesPerBase, fatPerBase),
    unitGrams: input.unitGrams,
  };
}

export function createSavedMeal(repository: SavedMealRepository) {
  return async (input: SavedMealInput): Promise<SavedMeal> => {
    validate(input);
    return repository.create(toData(input));
  };
}

export function updateSavedMeal(repository: SavedMealRepository) {
  return async (id: string, input: SavedMealInput): Promise<SavedMeal> => {
    validate(input);
    const updated = await repository.update(id, toData(input));
    if (!updated) {
      throw new Error('No se encontró la comida guardada.');
    }
    return updated;
  };
}

export function deleteSavedMeal(repository: SavedMealRepository) {
  return async (id: string): Promise<boolean> => repository.delete(id);
}

export function getSavedMeal(repository: SavedMealRepository) {
  return async (id: string): Promise<SavedMeal | null> => repository.findById(id);
}

export function listSavedMeals(repository: SavedMealRepository) {
  return async (): Promise<SavedMeal[]> => {
    const items = await repository.findAll();
    return [...items].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  };
}
