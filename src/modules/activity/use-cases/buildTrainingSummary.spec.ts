import { describe, it, expect } from 'vitest';
import { buildTrainingSummary } from './buildTrainingSummary';
import { makeSession, makeSet } from './fixtures';

describe('buildTrainingSummary', () => {
  it('reports no training when there are no sessions', () => {
    // Arrange
    const date = '2026-06-15';

    // Act
    const summary = buildTrainingSummary(date, [], []);

    // Assert
    expect(summary.hasTrained).toBe(false);
    expect(summary.sessionsCount).toBe(0);
    expect(summary.completedSets).toBe(0);
    expect(summary.totalVolume).toBe(0);
    expect(summary.durationMinutes).toBe(0);
  });

  it('counts only completed sets when computing volume', () => {
    // Arrange
    const sessions = [makeSession({ duration: 45 })];
    const sets = [
      makeSet({ reps: 10, weight: 100, isCompleted: true }),
      makeSet({ reps: 10, weight: 50, isCompleted: false }),
    ];

    // Act
    const summary = buildTrainingSummary('2026-06-15', sessions, sets);

    // Assert
    expect(summary.completedSets).toBe(1);
    expect(summary.totalVolume).toBe(1000);
  });

  it('sums session durations across the day', () => {
    // Arrange
    const sessions = [makeSession({ duration: 30 }), makeSession({ duration: 20 })];

    // Act
    const summary = buildTrainingSummary('2026-06-15', sessions, []);

    // Assert
    expect(summary.hasTrained).toBe(true);
    expect(summary.sessionsCount).toBe(2);
    expect(summary.durationMinutes).toBe(50);
  });
});
