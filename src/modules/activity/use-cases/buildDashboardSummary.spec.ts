import { describe, it, expect } from 'vitest';
import { buildDashboardSummary } from './buildDashboardSummary';
import { makeEntry, makeGoal, makeSession, makeSet } from './fixtures';

describe('buildDashboardSummary', () => {
  it('composes training and nutrition summaries for the given date', () => {
    // Arrange
    const date = '2026-06-15';
    const input = {
      sessions: [makeSession({ duration: 60 })],
      sets: [makeSet({ reps: 8, weight: 80, isCompleted: true })],
      entries: [makeEntry({ mealId: 'lunch', calories: 600 })],
      goal: makeGoal({ calorieGoal: 2000 }),
      lastWorkout: null,
      weeklyStats: { workoutFrequency: 3, averageWeight: 80 },
    };

    // Act
    const summary = buildDashboardSummary(date, input);

    // Assert
    expect(summary.date).toBe(date);
    expect(summary.training.totalVolume).toBe(640);
    expect(summary.nutrition.calories.consumed).toBe(600);
    expect(summary.nutrition.calories.remaining).toBe(1400);
    expect(summary.lastWorkout).toBeNull();
    expect(summary.weeklyStats.workoutFrequency).toBe(3);
  });
});
