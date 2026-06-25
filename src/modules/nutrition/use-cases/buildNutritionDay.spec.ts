import { describe, it, expect } from 'vitest';
import { buildNutritionDay } from './buildNutritionDay';
import type { MacroGoal, MealEntry } from '../types/nutrition.types';

function entry(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    id: 'e',
    createdAt: new Date(),
    updatedAt: new Date(),
    date: '2026-06-24',
    loggedAt: new Date(),
    foodName: 'x',
    quantity: 1,
    unit: 'g',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    ...overrides,
  };
}

describe('buildNutritionDay', () => {
  it('sums macros across entries', () => {
    // Arrange
    const entries = [
      entry({ calories: 420, protein: 32, carbohydrates: 45, fat: 8 }),
      entry({ calories: 650, protein: 55, carbohydrates: 70, fat: 12 }),
    ];

    // Act
    const day = buildNutritionDay('2026-06-24', entries, null);

    // Assert
    expect(day.calories.consumed).toBe(1070);
    expect(day.protein.consumed).toBe(87);
    expect(day.calories.goal).toBeNull();
  });

  it('exposes goals when a macro goal is present', () => {
    // Arrange
    const goal = {
      calorieGoal: 2200,
      proteinGoal: 180,
      carbohydrateGoal: 320,
      fatGoal: 75,
    } as MacroGoal;

    // Act
    const day = buildNutritionDay('2026-06-24', [], goal);

    // Assert
    expect(day.protein.goal).toBe(180);
    expect(day.calories.consumed).toBe(0);
  });
});
