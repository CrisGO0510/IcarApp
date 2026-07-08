import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExerciseSetJsonRepository } from './exercise-set.json-repository';

const storage = new Map<string, string>();

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: ({ key }: { key: string }) =>
      Promise.resolve({ value: storage.get(key) ?? null }),
    set: ({ key, value }: { key: string; value: string }) => {
      storage.set(key, value);
      return Promise.resolve();
    },
  },
}));

describe('ExerciseSetJsonRepository.update', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('persists a new createdAt when provided', async () => {
    // Arrange
    const repo = new ExerciseSetJsonRepository();
    const created = await repo.create({
      workoutSessionId: 'ws1',
      routineExerciseId: 'p1',
      setNumber: 1,
      reps: 10,
      weight: 100,
      isCompleted: true,
    });
    const performedAt = new Date(2026, 6, 3, 18, 30);

    // Act
    await repo.update(created.id, { createdAt: performedAt });
    const found = await repo.findById(created.id);

    // Assert
    expect(found?.createdAt).toEqual(performedAt);
  });

  it('keeps createdAt when not provided', async () => {
    // Arrange
    const repo = new ExerciseSetJsonRepository();
    const created = await repo.create({
      workoutSessionId: 'ws1',
      routineExerciseId: 'p1',
      setNumber: 1,
      reps: 10,
      weight: 100,
      isCompleted: true,
    });

    // Act
    await repo.update(created.id, { reps: 8 });
    const found = await repo.findById(created.id);

    // Assert
    expect(found?.createdAt).toEqual(created.createdAt);
    expect(found?.reps).toBe(8);
  });

  it('returns null for a missing id', async () => {
    // Arrange
    const repo = new ExerciseSetJsonRepository();

    // Act
    const result = await repo.update('missing', { reps: 8 });

    // Assert
    expect(result).toBeNull();
  });

  it('does not update a soft-deleted row', async () => {
    // Arrange
    const repo = new ExerciseSetJsonRepository();
    const created = await repo.create({
      workoutSessionId: 'ws1',
      routineExerciseId: 'p1',
      setNumber: 1,
      reps: 10,
      weight: 100,
      isCompleted: true,
    });
    await repo.delete(created.id);

    // Act
    const result = await repo.update(created.id, { reps: 8 });

    // Assert
    expect(result).toBeNull();
  });

  it('refreshes updatedAt on update', async () => {
    // Arrange
    const repo = new ExerciseSetJsonRepository();
    const created = await repo.create({
      workoutSessionId: 'ws1',
      routineExerciseId: 'p1',
      setNumber: 1,
      reps: 10,
      weight: 100,
      isCompleted: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 5));

    // Act
    await repo.update(created.id, { reps: 8 });
    const found = await repo.findById(created.id);

    // Assert
    expect(found!.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    expect(found!.reps).toBe(8);
  });
});
