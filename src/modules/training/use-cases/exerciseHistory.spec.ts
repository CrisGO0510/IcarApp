import { describe, it, expect } from 'vitest';
import { groupSetsByDay, summarizePerformance } from './exerciseHistory';
import type { ExerciseSet } from '../types/training.types';

function makeSet(overrides: Partial<ExerciseSet>): ExerciseSet {
  return {
    id: 'set',
    workoutSessionId: 's',
    routineExerciseId: 'pe1',
    setNumber: 1,
    isCompleted: true,
    createdAt: new Date('2026-06-20T10:00:00'),
    updatedAt: new Date('2026-06-20T10:00:00'),
    ...overrides,
  };
}

describe('groupSetsByDay', () => {
  it('groups sets by calendar day and totals reps and volume', () => {
    // Arrange
    const sets = [
      makeSet({ id: 'a', setNumber: 1, reps: 10, weight: 100, createdAt: new Date('2026-06-20T10:00:00') }),
      makeSet({ id: 'b', setNumber: 2, reps: 8, weight: 100, createdAt: new Date('2026-06-20T10:05:00') }),
      makeSet({ id: 'c', setNumber: 1, reps: 5, weight: 80, createdAt: new Date('2026-06-18T10:00:00') }),
    ];

    // Act
    const groups = groupSetsByDay(sets);

    // Assert
    expect(groups).toHaveLength(2);
    expect(groups[0]!.totalSets).toBe(2);
    expect(groups[0]!.totalReps).toBe(18);
    expect(groups[0]!.totalVolume).toBe(1800);
  });

  it('orders groups from most recent to oldest', () => {
    // Arrange
    const sets = [
      makeSet({ id: 'old', createdAt: new Date('2026-06-10T10:00:00') }),
      makeSet({ id: 'new', createdAt: new Date('2026-06-20T10:00:00') }),
    ];

    // Act
    const groups = groupSetsByDay(sets);

    // Assert
    expect(groups[0]!.sets[0]!.id).toBe('new');
    expect(groups[1]!.sets[0]!.id).toBe('old');
  });
});

describe('summarizePerformance', () => {
  it('returns zeros when there is no history', () => {
    // Arrange
    const groups = groupSetsByDay([]);

    // Act
    const performance = summarizePerformance(groups);

    // Assert
    expect(performance).toEqual({
      series: 0,
      reps: 0,
      volume: 0,
      seriesDelta: null,
      repsDelta: null,
      volumeDelta: null,
    });
  });

  it('computes deltas of the latest day vs the previous one', () => {
    // Arrange
    const sets = [
      makeSet({ id: 'p1', setNumber: 1, reps: 8, weight: 100, createdAt: new Date('2026-06-18T10:00:00') }),
      makeSet({ id: 'n1', setNumber: 1, reps: 10, weight: 100, createdAt: new Date('2026-06-20T10:00:00') }),
      makeSet({ id: 'n2', setNumber: 2, reps: 10, weight: 100, createdAt: new Date('2026-06-20T10:05:00') }),
    ];

    // Act
    const performance = summarizePerformance(groupSetsByDay(sets));

    // Assert
    expect(performance.series).toBe(2);
    expect(performance.seriesDelta).toBe(1);
    expect(performance.repsDelta).toBe(12);
    expect(performance.volumeDelta).toBe(1200);
  });
});
