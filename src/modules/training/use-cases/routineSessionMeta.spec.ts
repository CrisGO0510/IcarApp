import { describe, it, expect } from 'vitest';
import { buildRoutineSessionMeta } from './routineSessionMeta';
import type { ExerciseSet, WorkoutSession } from '../types/training.types';

function session(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: 's1',
    createdAt: new Date(),
    updatedAt: new Date(),
    routineId: 'r1',
    startedAt: new Date('2026-06-24T08:00:00'),
    isCompleted: false,
    ...overrides,
  };
}

function set(overrides: Partial<ExerciseSet> = {}): ExerciseSet {
  return {
    id: 'x',
    createdAt: new Date('2026-06-24T08:00:00'),
    updatedAt: new Date(),
    workoutSessionId: 's1',
    routineExerciseId: 're1',
    setNumber: 1,
    isCompleted: true,
    ...overrides,
  };
}

describe('buildRoutineSessionMeta', () => {
  it('returns empty meta when the routine has no sessions', () => {
    // Act
    const meta = buildRoutineSessionMeta('r1', [], [], new Date('2026-06-24T10:00:00'));

    // Assert
    expect(meta.lastPerformedAt).toBeNull();
    expect(meta.durationMinutes).toBeNull();
    expect(meta.inProgress).toBe(false);
  });

  it('marks a same-day open session as in progress', () => {
    // Arrange
    const now = new Date('2026-06-24T10:00:00');

    // Act
    const meta = buildRoutineSessionMeta('r1', [session()], [], now);

    // Assert
    expect(meta.inProgress).toBe(true);
    expect(meta.lastPerformedAt).toEqual(new Date('2026-06-24T08:00:00'));
  });

  it('derives duration from the span between the session sets', () => {
    // Arrange
    const sets = [
      set({ id: 'a', createdAt: new Date('2026-06-24T08:00:00') }),
      set({ id: 'b', createdAt: new Date('2026-06-24T08:30:00') }),
    ];

    // Act
    const meta = buildRoutineSessionMeta('r1', [session()], sets, new Date('2026-06-25T10:00:00'));

    // Assert
    expect(meta.durationMinutes).toBe(30);
    expect(meta.inProgress).toBe(false);
  });
});
