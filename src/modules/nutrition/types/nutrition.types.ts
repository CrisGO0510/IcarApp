import type { BaseEntity } from 'src/core/types/base.types';

// ── Macro Goal ───────────────────────────────────────────────────────

export interface MacroGoal extends BaseEntity {
  date: string; // YYYY-MM-DD
  calorieGoal: number;
  proteinGoal: number;
  carbohydrateGoal: number;
  fatGoal: number;
  isActive: boolean;
}

// ── Meal ─────────────────────────────────────────────────────────────

export interface Meal extends BaseEntity {
  date: string; // YYYY-MM-DD
  name: string;
  orderIndex: number;
  notes?: string;
}

// ── Meal Entry ───────────────────────────────────────────────────────

export interface MealEntry extends BaseEntity {
  date: string; // YYYY-MM-DD
  loggedAt: Date;
  mealId?: string; // sin uso esta iteración (agrupación diferida)
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  notes?: string;
}

// ── Vistas / inputs de dominio ───────────────────────────────────────

export interface MealInput {
  date: string; // YYYY-MM-DD
  foodName: string;
  quantity: number;
  unit: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  calories?: number; // si se omite, se calcula 4·P + 4·C + 9·G
  loggedAt: Date;
  notes?: string;
}

export interface MacroGoalInput {
  date: string; // YYYY-MM-DD
  calorieGoal: number;
  proteinGoal: number;
  carbohydrateGoal: number;
  fatGoal: number;
}

export interface MacroTotal {
  consumed: number;
  goal: number | null;
}

export interface NutritionDay {
  date: string;
  calories: MacroTotal;
  protein: MacroTotal;
  carbohydrates: MacroTotal;
  fat: MacroTotal;
  entries: MealEntry[];
}

// ── Food (reusable catalog) ──────────────────────────────────────────

export interface Food extends BaseEntity {
  name: string;
  brand?: string;
  barcode?: string;
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbohydratesPerServing: number;
  fatPerServing: number;
  isCustom: boolean;
  isFavorite: boolean;
}
