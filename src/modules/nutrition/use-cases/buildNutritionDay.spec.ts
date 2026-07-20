import { describe, it, expect } from 'vitest';
import { buildNutritionDay } from './buildNutritionDay';
import type { ActivityEntry, MacroGoal, MealEntry } from '../types/nutrition.types';

function activity(overrides: Partial<ActivityEntry> = {}): ActivityEntry {
  return {
    id: 'a1',
    date: '2026-06-24',
    type: 'Correr',
    caloriesBurned: 300,
    durationMinutes: 30,
    loggedAt: new Date(2026, 5, 24, 10),
    createdAt: new Date(2026, 5, 24, 10),
    updatedAt: new Date(2026, 5, 24, 10),
    ...overrides,
  };
}

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

  it('rounds macro totals to one decimal and calories to integers', () => {
    // Arrange
    const entries = [
      entry({ calories: 100.4, protein: 10.15, carbohydrates: 0.1, fat: 0.1 }),
      entry({ calories: 100.4, protein: 10.15, carbohydrates: 0.2, fat: 0.25 }),
    ];

    // Act
    const day = buildNutritionDay('2026-06-24', entries, null);

    // Assert
    expect(day.calories.consumed).toBe(201);
    expect(day.protein.consumed).toBe(20.3);
    expect(day.carbohydrates.consumed).toBe(0.3);
    expect(day.fat.consumed).toBe(0.4);
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

  it('adds burned total and expanded remaining when there are activities', () => {
    // Arrange
    const goal = {
      calorieGoal: 2000,
      proteinGoal: 180,
      carbohydrateGoal: 320,
      fatGoal: 75,
    } as MacroGoal;
    const entries = [entry({ calories: 1500 })];
    const activities = [activity({ caloriesBurned: 300 })];

    // Act
    const day = buildNutritionDay('2026-06-24', entries, goal, activities);

    // Assert
    expect(day.burned).toBe(300);
    expect(day.remaining).toBe(goal.calorieGoal + 300 - day.calories.consumed);
    expect(day.activities).toHaveLength(1);
  });

  it('remaining is null without goal and burned still sums', () => {
    // Arrange
    const activities = [activity({ caloriesBurned: 300 })];

    // Act
    const day = buildNutritionDay('2026-06-24', [], null, activities);

    // Assert
    expect(day.remaining).toBeNull();
    expect(day.burned).toBe(300);
  });
});
