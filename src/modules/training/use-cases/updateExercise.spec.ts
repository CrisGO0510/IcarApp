import { describe, it, expect } from 'vitest';
import { updateExercise } from './updateExercise';
import type { ExerciseRepository } from '../repositories/training.repository.port';
import type { Exercise } from '../types/training.types';

function makeExercise(id: string, name: string, restTime?: number): Exercise {
  return {
    id,
    name,
    ...(restTime !== undefined ? { restTime } : {}),
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
  };
}

function fakeRepository(initial: Exercise[]) {
  const items = [...initial];
  const repository = {
    findAll(): Promise<Exercise[]> {
      return Promise.resolve(items);
    },
    update(id: string, patch: Partial<Exercise>): Promise<Exercise | null> {
      const index = items.findIndex((exercise) => exercise.id === id);
      if (index === -1) return Promise.resolve(null);
      const updated = { ...items[index]!, ...patch };
      items[index] = updated;
      return Promise.resolve(updated);
    },
  } as unknown as ExerciseRepository;
  return { repository, items: () => items };
}

describe('updateExercise', () => {
  it('rejects an empty name', async () => {
    // Arrange
    const { repository } = fakeRepository([makeExercise('e1', 'Press')]);
    const update = updateExercise(repository);

    // Act
    const result = update('e1', '  ', null);

    // Assert
    await expect(result).rejects.toThrow('obligatorio');
  });

  it('rejects a name already used by another exercise', async () => {
    // Arrange
    const { repository } = fakeRepository([
      makeExercise('e1', 'Press'),
      makeExercise('e2', 'Remo'),
    ]);
    const update = updateExercise(repository);

    // Act
    const result = update('e2', 'press', null);

    // Assert
    await expect(result).rejects.toThrow('Ya existe');
  });

  it('stores a custom rest time', async () => {
    // Arrange
    const { repository } = fakeRepository([makeExercise('e1', 'Press')]);
    const update = updateExercise(repository);

    // Act
    const updated = await update('e1', 'Press de Banca', 120);

    // Assert
    expect(updated.name).toBe('Press de Banca');
    expect(updated.restTime).toBe(120);
  });

  it('clears the rest time when null is passed', async () => {
    // Arrange
    const { repository } = fakeRepository([makeExercise('e1', 'Press', 90)]);
    const update = updateExercise(repository);

    // Act
    const updated = await update('e1', 'Press', null);

    // Assert
    expect(updated.restTime).toBeNull();
  });
});
