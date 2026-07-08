import { describe, it, expect } from 'vitest';
import { updateSet, deleteSet } from './workoutSession';
import type {
  ExerciseSetRepository,
  WorkoutSessionRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';
import type { ExerciseSet, WorkoutSession, RoutineExercise } from '../types/training.types';

const ROUTINE_ID = 'r1';
const PIVOT_ID = 'p1';
const SOURCE_SESSION_ID = 'session-source';
const TARGET_SESSION_ID = 'session-target';
const SOURCE_DATE = new Date(2026, 6, 1, 18, 0);
const SAME_DAY_LATER = new Date(2026, 6, 1, 20, 30);
const TARGET_DATE = new Date(2026, 6, 3, 18, 0);

function makeSet(overrides: Partial<ExerciseSet>): ExerciseSet {
  return {
    id: 's1',
    workoutSessionId: SOURCE_SESSION_ID,
    routineExerciseId: PIVOT_ID,
    setNumber: 1,
    reps: 10,
    weight: 100,
    isCompleted: true,
    createdAt: SOURCE_DATE,
    updatedAt: SOURCE_DATE,
    ...overrides,
  };
}

function makeSession(overrides: Partial<WorkoutSession>): WorkoutSession {
  return {
    id: SOURCE_SESSION_ID,
    routineId: ROUTINE_ID,
    startedAt: SOURCE_DATE,
    isCompleted: false,
    createdAt: SOURCE_DATE,
    updatedAt: SOURCE_DATE,
    ...overrides,
  };
}

function setRepoWith(sets: ExerciseSet[]): ExerciseSetRepository {
  return {
    findById: (id: string) => Promise.resolve(sets.find((s) => s.id === id) ?? null),
    findBySession: (sessionId: string) =>
      Promise.resolve(sets.filter((s) => s.workoutSessionId === sessionId)),
    update: (id: string, data: Partial<ExerciseSet>) => {
      const idx = sets.findIndex((s) => s.id === id);
      if (idx === -1) return Promise.resolve(null);
      sets[idx] = { ...sets[idx]!, ...data };
      return Promise.resolve(sets[idx]);
    },
    delete: (id: string) => {
      const idx = sets.findIndex((s) => s.id === id);
      if (idx === -1) return Promise.resolve(false);
      sets.splice(idx, 1);
      return Promise.resolve(true);
    },
  } as unknown as ExerciseSetRepository;
}

function sessionRepoWith(sessions: WorkoutSession[], deleted: string[]): WorkoutSessionRepository {
  return {
    findByRoutine: (routineId: string) =>
      Promise.resolve(sessions.filter((s) => s.routineId === routineId)),
    create: (data: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>) => {
      const session = {
        ...data,
        id: 'session-created',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      sessions.push(session);
      return Promise.resolve(session);
    },
    delete: (id: string) => {
      deleted.push(id);
      return Promise.resolve(true);
    },
  } as unknown as WorkoutSessionRepository;
}

const pivotRepo = {
  findById: () =>
    Promise.resolve({
      id: PIVOT_ID,
      routineId: ROUTINE_ID,
      exerciseId: 'e1',
      orderIndex: 0,
      createdAt: SOURCE_DATE,
      updatedAt: SOURCE_DATE,
    } as RoutineExercise),
} as unknown as RoutineExerciseRepository;

describe('updateSet', () => {
  it('throws when the set does not exist', async () => {
    // Arrange
    const update = updateSet(sessionRepoWith([], []), setRepoWith([]), pivotRepo);

    // Act
    const result = update('missing', {
      reps: 8,
      weight: 100,
      performedAt: SOURCE_DATE,
    });

    // Assert
    await expect(result).rejects.toThrow('No se encontró');
  });

  it('updates fields and time within the same day without touching sessions', async () => {
    // Arrange
    const sets = [makeSet({})];
    const deleted: string[] = [];
    const sessions = [makeSession({})];
    const update = updateSet(sessionRepoWith(sessions, deleted), setRepoWith(sets), pivotRepo);

    // Act
    const result = await update('s1', {
      reps: 8,
      weight: 125,
      notes: 'PR',
      performedAt: SAME_DAY_LATER,
    });

    // Assert
    expect(result.reps).toBe(8);
    expect(result.weight).toBe(125);
    expect(result.notes).toBe('PR');
    expect(result.createdAt).toEqual(SAME_DAY_LATER);
    expect(result.workoutSessionId).toBe(SOURCE_SESSION_ID);
    expect(sessions).toHaveLength(1);
    expect(deleted).toHaveLength(0);
  });

  it('clears notes when they come empty', async () => {
    // Arrange
    const sets = [makeSet({ notes: 'vieja' })];
    const update = updateSet(sessionRepoWith([makeSession({})], []), setRepoWith(sets), pivotRepo);

    // Act
    const result = await update('s1', {
      reps: 10,
      weight: 100,
      notes: '  ',
      performedAt: SOURCE_DATE,
    });

    // Assert
    expect(result.notes).toBeNull();
  });

  it('throws when the pivot of the set is missing', async () => {
    // Arrange
    const missingPivotRepo = {
      findById: () => Promise.resolve(null),
    } as unknown as RoutineExerciseRepository;
    const sets = [makeSet({})];
    const update = updateSet(
      sessionRepoWith([makeSession({})], []),
      setRepoWith(sets),
      missingPivotRepo,
    );

    // Act
    const result = update('s1', { reps: 10, weight: 100, performedAt: TARGET_DATE });

    // Assert
    await expect(result).rejects.toThrow('No se encontró el ejercicio');
  });

  it('moves the set to the existing session of the target day', async () => {
    // Arrange
    const sets = [
      makeSet({}),
      makeSet({ id: 's2', workoutSessionId: TARGET_SESSION_ID, setNumber: 1 }),
      makeSet({
        id: 's3',
        workoutSessionId: TARGET_SESSION_ID,
        routineExerciseId: 'p2',
        setNumber: 7,
      }),
    ];
    const sessions = [
      makeSession({}),
      makeSession({ id: TARGET_SESSION_ID, startedAt: TARGET_DATE }),
    ];
    const update = updateSet(sessionRepoWith(sessions, []), setRepoWith(sets), pivotRepo);

    // Act
    const result = await update('s1', {
      reps: 10,
      weight: 100,
      performedAt: TARGET_DATE,
    });

    // Assert
    expect(result.workoutSessionId).toBe(TARGET_SESSION_ID);
    expect(result.setNumber).toBe(2);
    expect(result.createdAt).toEqual(TARGET_DATE);
    expect(sessions).toHaveLength(2);
  });

  it('creates the target session when the day has none', async () => {
    // Arrange
    const sets = [makeSet({})];
    const sessions = [makeSession({})];
    const update = updateSet(sessionRepoWith(sessions, []), setRepoWith(sets), pivotRepo);

    // Act
    const result = await update('s1', {
      reps: 10,
      weight: 100,
      performedAt: TARGET_DATE,
    });

    // Assert
    expect(result.workoutSessionId).toBe('session-created');
    expect(result.setNumber).toBe(1);
    const created = sessions.find((s) => s.id === 'session-created');
    expect(created?.startedAt).toEqual(TARGET_DATE);
    expect(created?.routineId).toBe(ROUTINE_ID);
  });

  it('deletes the source session when it ends up empty', async () => {
    // Arrange
    const sets = [makeSet({})];
    const deleted: string[] = [];
    const sessions = [
      makeSession({}),
      makeSession({ id: TARGET_SESSION_ID, startedAt: TARGET_DATE }),
    ];
    const update = updateSet(sessionRepoWith(sessions, deleted), setRepoWith(sets), pivotRepo);

    // Act
    await update('s1', { reps: 10, weight: 100, performedAt: TARGET_DATE });

    // Assert
    expect(deleted).toEqual([SOURCE_SESSION_ID]);
  });

  it('keeps the source session when other sets remain', async () => {
    // Arrange
    const sets = [makeSet({}), makeSet({ id: 's2', setNumber: 2 })];
    const deleted: string[] = [];
    const sessions = [
      makeSession({}),
      makeSession({ id: TARGET_SESSION_ID, startedAt: TARGET_DATE }),
    ];
    const update = updateSet(sessionRepoWith(sessions, deleted), setRepoWith(sets), pivotRepo);

    // Act
    await update('s1', { reps: 10, weight: 100, performedAt: TARGET_DATE });

    // Assert
    expect(deleted).toHaveLength(0);
  });
});

describe('deleteSet', () => {
  it('deletes the session when its last set is removed', async () => {
    // Arrange
    const sets = [makeSet({})];
    const deleted: string[] = [];
    const sessions = [makeSession({})];
    const remove = deleteSet(sessionRepoWith(sessions, deleted), setRepoWith(sets));

    // Act
    await remove('s1');

    // Assert
    expect(sets).toHaveLength(0);
    expect(deleted).toEqual([SOURCE_SESSION_ID]);
  });

  it('keeps the session when other sets remain', async () => {
    // Arrange
    const sets = [makeSet({}), makeSet({ id: 's2', setNumber: 2 })];
    const deleted: string[] = [];
    const sessions = [makeSession({})];
    const remove = deleteSet(sessionRepoWith(sessions, deleted), setRepoWith(sets));

    // Act
    await remove('s1');

    // Assert
    expect(sets).toHaveLength(1);
    expect(deleted).toHaveLength(0);
  });
});
