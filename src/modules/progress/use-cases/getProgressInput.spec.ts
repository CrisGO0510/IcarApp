import { describe, it, expect } from 'vitest';
import { buildSessionVolumes, toBodyWeightLog } from './getProgressInput';
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
    createdAt: new Date(),
    updatedAt: new Date(),
    workoutSessionId: 's1',
    routineExerciseId: 'pivot-1',
    setNumber: 1,
    isCompleted: true,
    ...overrides,
  };
}

describe('buildSessionVolumes', () => {
  it('aggregates sets and total volume per exercise of a session', () => {
    // Arrange
    const sessions = [session()];
    const sets = [
      set({ id: 'a', reps: 10, weight: 100 }),
      set({ id: 'b', reps: 8, weight: 100 }),
    ];
    const routines = [{ id: 'r1', name: 'Pierna A' } as Routine];
    const pivots = [{ id: 'pivot-1', exerciseId: 'e1' } as RoutineExercise];
    const exercises = [{ id: 'e1', name: 'Sentadilla' } as Exercise];

    // Act
    const volumes = buildSessionVolumes(sessions, sets, routines, pivots, exercises);

    // Assert
    expect(volumes).toHaveLength(1);
    expect(volumes[0]).toMatchObject({
      routine: 'Pierna A',
      type: 'Sentadilla',
      sets: 2,
      weight: 1800,
    });
  });
});

describe('toBodyWeightLog', () => {
  it('maps stored logs to dated body-weight entries', () => {
    // Arrange
    const logs: BodyWeightLog[] = [
      { id: 'w1', createdAt: new Date(), updatedAt: new Date(), date: '2026-06-24', weightKg: 81.5 },
    ];

    // Act
    const entries = toBodyWeightLog(logs);

    // Assert
    expect(entries[0]!.weight).toBe(81.5);
    expect(entries[0]!.date.getFullYear()).toBe(2026);
    expect(entries[0]!.date.getMonth()).toBe(5);
    expect(entries[0]!.date.getDate()).toBe(24);
  });
});
