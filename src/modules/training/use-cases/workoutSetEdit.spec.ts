import { describe, it, expect } from 'vitest';
import { updateSet, deleteSet } from './workoutSession';
import type { ExerciseSetRepository } from '../repositories/training.repository.port';
import type { ExerciseSet } from '../types/training.types';

describe('updateSet', () => {
  it('throws when the set does not exist', async () => {
    // Arrange
    const repo = {
      update: () => Promise.resolve(null),
    } as unknown as ExerciseSetRepository;
    const update = updateSet(repo);

    // Act
    const result = update('missing', { reps: 8, weight: 100 });

    // Assert
    await expect(result).rejects.toThrow('No se encontró');
  });

  it('persists reps and weight', async () => {
    // Arrange
    let payload: Partial<ExerciseSet> | null = null;
    const repo = {
      update: (_id: string, data: Partial<ExerciseSet>) => {
        payload = data;
        return Promise.resolve({ id: _id, ...data } as ExerciseSet);
      },
    } as unknown as ExerciseSetRepository;
    const update = updateSet(repo);

    // Act
    await update('s1', { reps: 8, weight: 125, notes: 'PR' });

    // Assert
    expect(payload!.reps).toBe(8);
    expect(payload!.weight).toBe(125);
    expect(payload!.notes).toBe('PR');
  });
});

describe('deleteSet', () => {
  it('delegates to the repository delete', async () => {
    // Arrange
    let deletedId: string | null = null;
    const repo = {
      delete: (id: string) => {
        deletedId = id;
        return Promise.resolve(true);
      },
    } as unknown as ExerciseSetRepository;
    const remove = deleteSet(repo);

    // Act
    await remove('s1');

    // Assert
    expect(deletedId).toBe('s1');
  });
});
