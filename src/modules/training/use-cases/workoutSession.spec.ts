import { describe, it, expect } from 'vitest';
import { logSet, getLastSet, lastSetByExercise } from './workoutSession';
import type {
  WorkoutSessionRepository,
  ExerciseSetRepository,
} from '../repositories/training.repository.port';
import type { ExerciseSet, WorkoutSession } from '../types/training.types';

function makeSet(overrides: Partial<ExerciseSet>): ExerciseSet {
  return {
    id: 'set',
    workoutSessionId: 's1',
    routineExerciseId: 'pe1',
    setNumber: 1,
    isCompleted: true,
    createdAt: new Date('2026-06-20'),
    updatedAt: new Date('2026-06-20'),
    ...overrides,
  };
}

function fakeRepos(sessions: WorkoutSession[] = [], sets: ExerciseSet[] = []) {
  const sessionItems = [...sessions];
  const setItems = [...sets];
  let counter = 0;

  const sessionRepo = {
    findByRoutine(routineId: string): Promise<WorkoutSession[]> {
      return Promise.resolve(sessionItems.filter((s) => s.routineId === routineId));
    },
    create(data: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutSession> {
      const entity: WorkoutSession = {
        ...data,
        id: `ses-${counter++}`,
        createdAt: new Date('2026-06-20'),
        updatedAt: new Date('2026-06-20'),
      };
      sessionItems.push(entity);
      return Promise.resolve(entity);
    },
  } as unknown as WorkoutSessionRepository;

  const setRepo = {
    findBySession(sessionId: string): Promise<ExerciseSet[]> {
      return Promise.resolve(setItems.filter((s) => s.workoutSessionId === sessionId));
    },
    findByExercise(routineExerciseId: string): Promise<ExerciseSet[]> {
      return Promise.resolve(setItems.filter((s) => s.routineExerciseId === routineExerciseId));
    },
    create(data: Omit<ExerciseSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseSet> {
      const entity: ExerciseSet = {
        ...data,
        id: `set-${counter++}`,
        createdAt: new Date('2026-06-20'),
        updatedAt: new Date('2026-06-20'),
      };
      setItems.push(entity);
      return Promise.resolve(entity);
    },
  } as unknown as ExerciseSetRepository;

  return {
    sessionRepo,
    setRepo,
    sessions: () => sessionItems,
    sets: () => setItems,
  };
}

const NOW = new Date('2026-06-20T10:00:00');

describe('logSet', () => {
  it('creates a session on the first set of the day and numbers it 1', async () => {
    // Arrange
    const repos = fakeRepos();
    const log = logSet(repos.sessionRepo, repos.setRepo);

    // Act
    const set = await log('r1', 'pe1', { reps: 10, weight: 80 }, NOW);

    // Assert
    expect(repos.sessions()).toHaveLength(1);
    expect(set.setNumber).toBe(1);
    expect(set.reps).toBe(10);
    expect(set.weight).toBe(80);
  });

  it('reuses the same-day session and increments the set number per exercise', async () => {
    // Arrange
    const repos = fakeRepos();
    const log = logSet(repos.sessionRepo, repos.setRepo);

    // Act
    await log('r1', 'pe1', { reps: 10, weight: 80 }, NOW);
    const second = await log('r1', 'pe1', { reps: 8, weight: 85 }, NOW);

    // Assert
    expect(repos.sessions()).toHaveLength(1);
    expect(second.setNumber).toBe(2);
  });

  it('starts a new session when the last one was a different day', async () => {
    // Arrange
    const yesterday = new Date('2026-06-19T10:00:00');
    const repos = fakeRepos([
      {
        id: 'old',
        routineId: 'r1',
        startedAt: yesterday,
        isCompleted: false,
        createdAt: yesterday,
        updatedAt: yesterday,
      },
    ]);
    const log = logSet(repos.sessionRepo, repos.setRepo);

    // Act
    await log('r1', 'pe1', { reps: 10, weight: 80 }, NOW);

    // Assert
    expect(repos.sessions()).toHaveLength(2);
  });
});

describe('getLastSet', () => {
  it('returns null when the exercise has no sets', async () => {
    // Arrange
    const repos = fakeRepos();
    const lastSet = getLastSet(repos.setRepo);

    // Act
    const result = await lastSet('pe1');

    // Assert
    expect(result).toBeNull();
  });

  it('returns the most recently created set for the exercise', async () => {
    // Arrange
    const sets = [
      makeSet({ id: 'old', routineExerciseId: 'pe1', reps: 5, weight: 10, createdAt: new Date('2026-06-18') }),
      makeSet({ id: 'new', routineExerciseId: 'pe1', reps: 8, weight: 12, createdAt: new Date('2026-06-20') }),
      makeSet({ id: 'other', routineExerciseId: 'pe2', reps: 3, weight: 99, createdAt: new Date('2026-06-21') }),
    ];
    const repos = fakeRepos([], sets);
    const lastSet = getLastSet(repos.setRepo);

    // Act
    const result = await lastSet('pe1');

    // Assert
    expect(result?.id).toBe('new');
    expect(result?.reps).toBe(8);
    expect(result?.weight).toBe(12);
  });
});

describe('lastSetByExercise', () => {
  it('keeps the most recent set per routine exercise', () => {
    // Arrange
    const sets = [
      makeSet({ id: 'a', routineExerciseId: 'pe1', createdAt: new Date('2026-06-18') }),
      makeSet({ id: 'b', routineExerciseId: 'pe1', createdAt: new Date('2026-06-20') }),
      makeSet({ id: 'c', routineExerciseId: 'pe2', createdAt: new Date('2026-06-19') }),
    ];

    // Act
    const latest = lastSetByExercise(sets);

    // Assert
    expect(latest['pe1']?.id).toBe('b');
    expect(latest['pe2']?.id).toBe('c');
  });
});
