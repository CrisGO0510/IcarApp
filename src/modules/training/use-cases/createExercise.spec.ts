import { describe, it, expect } from 'vitest';
import { createExercise } from './createExercise';
import type { ExerciseRepository } from '../repositories/training.repository.port';
import type { Exercise } from '../types/training.types';

function fakeRepository(initial: Exercise[] = []): ExerciseRepository {
  const items = [...initial];
  return {
    findAll(): Promise<Exercise[]> {
      return Promise.resolve(items.filter((item) => !item.deletedAt));
    },
    create(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
      const entity: Exercise = {
        ...data,
        id: `id-${items.length}`,
        createdAt: new Date('2026-06-20T00:00:00'),
        updatedAt: new Date('2026-06-20T00:00:00'),
      };
      items.push(entity);
      return Promise.resolve(entity);
    },
  } as unknown as ExerciseRepository;
}

function makeExercise(name: string): Exercise {
  return {
    id: name,
    name,
    createdAt: new Date('2026-06-01T00:00:00'),
    updatedAt: new Date('2026-06-01T00:00:00'),
  };
}

describe('createExercise', () => {
  it('rejects an empty or whitespace-only name', async () => {
    // Arrange
    const create = createExercise(fakeRepository());

    // Act
    const result = create('   ');

    // Assert
    await expect(result).rejects.toThrow('obligatorio');
  });

  it('rejects a duplicate name regardless of case', async () => {
    // Arrange
    const create = createExercise(fakeRepository([makeExercise('Sentadilla')]));

    // Act
    const result = create('sentadilla');

    // Assert
    await expect(result).rejects.toThrow('Ya existe');
  });

  it('trims the name before persisting', async () => {
    // Arrange
    const create = createExercise(fakeRepository());

    // Act
    const exercise = await create('  Prensa  ');

    // Assert
    expect(exercise.name).toBe('Prensa');
  });
});
