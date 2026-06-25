import type { Repository } from 'src/core/types/base.types';
import type { MacroGoal, Meal, MealEntry, Food } from '../types/nutrition.types';

// ── MacroGoal Port ───────────────────────────────────────────────────

export interface MacroGoalRepository extends Repository<MacroGoal> {
  findActive(): Promise<MacroGoal | null>;
  findByDate(date: string): Promise<MacroGoal | null>;
}

// ── Meal Port ────────────────────────────────────────────────────────

export interface MealRepository extends Repository<Meal> {
  findByDate(date: string): Promise<Meal[]>;
}

// ── MealEntry Port ───────────────────────────────────────────────────

export interface MealEntryRepository extends Repository<MealEntry> {
  findByMeal(mealId: string): Promise<MealEntry[]>;
  findByDate(date: string): Promise<MealEntry[]>;
}

// ── Food Port ────────────────────────────────────────────────────────

export interface FoodRepository extends Repository<Food> {
  searchByName(query: string): Promise<Food[]>;
  findFavorites(): Promise<Food[]>;
}
