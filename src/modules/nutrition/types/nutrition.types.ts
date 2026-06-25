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
