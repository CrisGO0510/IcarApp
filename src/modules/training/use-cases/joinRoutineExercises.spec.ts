import { describe, it, expect } from 'vitest';
import { joinRoutineExercises, countByRoutine } from './joinRoutineExercises';
import type { Exercise, RoutineExercise } from '../types/training.types';

function makeExercise(id: string, name: string): Exercise {
  return {
    id,
    name,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
  };
}

function makePivot(overrides: Partial<RoutineExercise>): RoutineExercise {
  return {
    id: 'pivot',
    routineId: 'r1',
    exerciseId: 'e1',
    orderIndex: 0,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    ...overrides,
  };
}

describe('joinRoutineExercises', () => {
  it('joins pivots with exercises ordered by orderIndex', () => {
    // Arrange
    const exercises = [makeExercise('e1', 'Sentadilla'), makeExercise('e2', 'Prensa')];
    const pivots = [
      makePivot({ id: 'p2', exerciseId: 'e2', orderIndex: 1 }),
      makePivot({ id: 'p1', exerciseId: 'e1', orderIndex: 0 }),
    ];

    // Act
    const result = joinRoutineExercises(pivots, exercises);

    // Assert
    expect(result.map((view) => view.exercise.name)).toEqual(['Sentadilla', 'Prensa']);
  });

  it('drops pivots whose exercise no longer exists', () => {
    // Arrange
    const exercises = [makeExercise('e1', 'Sentadilla')];
    const pivots = [
      makePivot({ id: 'p1', exerciseId: 'e1', orderIndex: 0 }),
      makePivot({ id: 'p2', exerciseId: 'missing', orderIndex: 1 }),
    ];

    // Act
    const result = joinRoutineExercises(pivots, exercises);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]!.exercise.id).toBe('e1');
  });
});

describe('countByRoutine', () => {
  it('counts pivots grouped by routine', () => {
    // Arrange
    const pivots = [
      makePivot({ id: 'p1', routineId: 'r1' }),
      makePivot({ id: 'p2', routineId: 'r1' }),
      makePivot({ id: 'p3', routineId: 'r2' }),
    ];

    // Act
    const counts = countByRoutine(pivots);

    // Assert
    expect(counts.get('r1')).toBe(2);
    expect(counts.get('r2')).toBe(1);
  });
});
