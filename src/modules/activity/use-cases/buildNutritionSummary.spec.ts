import { describe, it, expect } from 'vitest';
import { buildMacroProgress, buildNutritionSummary } from './buildNutritionSummary';
import { makeActivity, makeEntry, makeGoal } from './fixtures';

describe('buildMacroProgress', () => {
  it('returns null goal fields when no goal is set', () => {
    // Arrange
    const consumed = 1500;

    // Act
    const progress = buildMacroProgress(consumed, null);

    // Assert
    expect(progress).toEqual({ consumed: 1500, goal: null, remaining: null, percentage: null });
  });

  it('computes remaining and percentage against a goal', () => {
    // Arrange
    const consumed = 500;
    const goal = 2000;

    // Act
    const progress = buildMacroProgress(consumed, goal);

    // Assert
    expect(progress.remaining).toBe(1500);
    expect(progress.percentage).toBe(25);
  });
});

describe('buildNutritionSummary', () => {
  it('aggregates totals across entries and counts distinct meals', () => {
    // Arrange
    const entries = [
      makeEntry({ mealId: 'breakfast', calories: 300, protein: 20, carbohydrates: 30, fat: 10 }),
      makeEntry({ mealId: 'breakfast', calories: 200, protein: 10, carbohydrates: 20, fat: 5 }),
      makeEntry({ mealId: 'lunch', calories: 500, protein: 40, carbohydrates: 50, fat: 15 }),
    ];
    const goal = makeGoal({ calorieGoal: 2000, proteinGoal: 100 });

    // Act
    const summary = buildNutritionSummary('2026-06-15', entries, goal);

    // Assert
    expect(summary.calories.consumed).toBe(1000);
    expect(summary.calories.remaining).toBe(1000);
    expect(summary.protein.consumed).toBe(70);
    expect(summary.mealsCount).toBe(2);
  });

  it('leaves goal fields null when there is no macro goal', () => {
    // Arrange
    const entries = [makeEntry({ calories: 400 })];

    // Act
    const summary = buildNutritionSummary('2026-06-15', entries, null);

    // Assert
    expect(summary.calories.consumed).toBe(400);
    expect(summary.calories.goal).toBeNull();
    expect(summary.calories.percentage).toBeNull();
  });

  it('expands calories remaining with burned activities', () => {
    // Arrange
    const entries = [makeEntry({ mealId: 'lunch', calories: 1500 })];
    const goal = makeGoal({ calorieGoal: 2000 });
    const activities = [makeActivity({ date: '2026-06-15', caloriesBurned: 300 })];

    // Act
    const result = buildNutritionSummary('2026-06-15', entries, goal, activities);

    // Assert
    expect(result.burned).toBe(300);
    expect(result.calories.remaining).toBe(goal.calorieGoal + 300 - result.calories.consumed);
  });
});
