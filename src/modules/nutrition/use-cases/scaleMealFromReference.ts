import { computeCalories } from './computeCalories';

export interface ReferenceTable {
  base: number; // reference grams the table is expressed for (e.g. 100)
  protein: number; // per base
  carbohydrates: number; // per base
  fat: number; // per base
  calories?: number; // per base, optional
}

export interface ScaledMacros {
  protein: number;
  carbohydrates: number;
  fat: number;
  calories: number;
}

const DECIMAL_FACTOR = 10;

function round1(value: number): number {
  return Math.round(value * DECIMAL_FACTOR) / DECIMAL_FACTOR;
}

export function scaleMealFromReference(table: ReferenceTable, grams: number): ScaledMacros {
  if (table.base <= 0 || grams <= 0) {
    return { protein: 0, carbohydrates: 0, fat: 0, calories: 0 };
  }

  const factor = grams / table.base;
  const protein = round1(table.protein * factor);
  const carbohydrates = round1(table.carbohydrates * factor);
  const fat = round1(table.fat * factor);
  const calories =
    table.calories && table.calories > 0
      ? Math.round(table.calories * factor)
      : computeCalories(protein, carbohydrates, fat);

  return { protein, carbohydrates, fat, calories };
}
