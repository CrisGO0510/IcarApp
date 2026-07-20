import type { BaseEntity } from 'src/core/types/base.types';

// ── Units ────────────────────────────────────────────────────────────

export const MASS_UNIT = 'gr'; // unit for meal quantities and macros
export const ENERGY_UNIT = 'kcal';

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

// ── Activity Entry ───────────────────────────────────────────────────

export const ACTIVITY_TYPES = [
  'Correr',
  'Caminar',
  'Ciclismo',
  'Natación',
  'Pesas',
  'Otro',
] as const;
export const OTHER_ACTIVITY_TYPE: (typeof ACTIVITY_TYPES)[number] = 'Otro';

export const DATE_QUERY_PARAM = 'fecha';

export interface ActivityEntry extends BaseEntity {
  date: string; // YYYY-MM-DD
  type: string;
  caloriesBurned: number;
  durationMinutes: number;
  loggedAt: Date;
}

export interface ActivityInput {
  date: string; // YYYY-MM-DD
  type: string;
  caloriesBurned: number;
  durationMinutes: number;
  loggedAt: Date;
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
  burned: number;
  remaining: number | null;
  activities: ActivityEntry[];
}

// ── Saved Meal ───────────────────────────────────────────────────────

export const SAVED_MEAL_BASE_GRAMS = 100;

export const SAVED_MEALS_PATH = '/nutricion/mis-comidas';
export const NEW_SAVED_MEAL_PATH = `${SAVED_MEALS_PATH}/nueva`;
export const MACRO_GOAL_PATH = '/nutricion/macros';

export const QUANTITY_MODE = {
  GRAMS: MASS_UNIT,
  UNITS: 'unidades',
} as const;
export type QuantityMode = (typeof QUANTITY_MODE)[keyof typeof QUANTITY_MODE];

export interface SavedMeal extends BaseEntity {
  name: string;
  caloriesPerBase: number;
  proteinPerBase: number;
  carbohydratesPerBase: number;
  fatPerBase: number;
  unitGrams: number | null;
}

export interface SavedMealInput {
  name: string;
  caloriesPerBase: number | null;
  proteinPerBase: number;
  carbohydratesPerBase: number;
  fatPerBase: number;
  unitGrams: number | null;
}

export interface SavedMealLogRequest {
  mode: QuantityMode;
  amount: number;
  date: string;
}
