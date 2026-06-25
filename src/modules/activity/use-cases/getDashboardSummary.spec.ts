import { describe, it, expect } from 'vitest';
import { buildLastWorkout, buildWeeklyStats } from './getDashboardSummary';
import type {
  Exercise,
  ExerciseSet,
  Routine,
  RoutineExercise,
  WorkoutSession,
} from 'src/modules/training/types/training.types';
import type { BodyWeightLog } from 'src/modules/measurements/types/measurements.types';

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
    routineExerciseId: 'pivot-1',
    setNumber: 1,
    isCompleted: true,
    ...overrides,
  };
}

describe('buildLastWorkout', () => {
  it('returns null without sessions', () => {
    // Act / Assert
    expect(buildLastWorkout([], [], [], [], [])).toBeNull();
  });

  it('names the routine and counts sets per exercise', () => {
    // Arrange
    const sessions = [session()];
    const sets = [set({ id: 'a' }), set({ id: 'b' }), set({ id: 'c', routineExerciseId: 'pivot-2' })];
    const routines = [{ id: 'r1', name: 'Pierna A' } as Routine];
    const pivots = [
      { id: 'pivot-1', exerciseId: 'e1' } as RoutineExercise,
      { id: 'pivot-2', exerciseId: 'e2' } as RoutineExercise,
    ];
    const exercises = [
      { id: 'e1', name: 'Sentadilla' } as Exercise,
      { id: 'e2', name: 'Prensa' } as Exercise,
    ];

    // Act
    const last = buildLastWorkout(sessions, sets, routines, pivots, exercises);

    // Assert
    expect(last?.routineName).toBe('Pierna A');
    expect(last?.exercises).toContainEqual({ name: 'Sentadilla', sets: 2 });
    expect(last?.exercises).toContainEqual({ name: 'Prensa', sets: 1 });
  });
});

describe('buildWeeklyStats', () => {
  it('counts distinct training days and averages recent weights', () => {
    // Arrange
    const now = new Date('2026-06-24T10:00:00');
    const sessions = [
      session({ id: 's1', startedAt: new Date('2026-06-24T08:00:00') }),
      session({ id: 's2', startedAt: new Date('2026-06-22T08:00:00') }),
      session({ id: 's3', startedAt: new Date('2026-06-22T18:00:00') }),
    ];
    const weights: BodyWeightLog[] = [
      { id: 'w1', createdAt: now, updatedAt: now, date: '2026-06-24', weightKg: 82 },
      { id: 'w2', createdAt: now, updatedAt: now, date: '2026-06-23', weightKg: 80 },
      { id: 'w3', createdAt: now, updatedAt: now, date: '2026-05-01', weightKg: 90 },
    ];

    // Act
    const stats = buildWeeklyStats(sessions, weights, now);

    // Assert
    expect(stats.workoutFrequency).toBe(2);
    expect(stats.averageWeight).toBe(81);
  });

  it('returns null average weight without recent logs', () => {
    // Arrange
    const now = new Date('2026-06-24T10:00:00');

    // Act
    const stats = buildWeeklyStats([], [], now);

    // Assert
    expect(stats.workoutFrequency).toBe(0);
    expect(stats.averageWeight).toBeNull();
  });
});
