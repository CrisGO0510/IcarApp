import { describe, it, expect } from 'vitest';
import { createRoutine } from './createRoutine';
import type { RoutineRepository } from '../repositories/training.repository.port';
import type { Routine } from '../types/training.types';

function fakeRepository(): RoutineRepository {
  let counter = 0;
  return {
    create(data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Routine> {
      return Promise.resolve({
        ...data,
        id: `r-${counter++}`,
        createdAt: new Date('2026-06-20T00:00:00'),
        updatedAt: new Date('2026-06-20T00:00:00'),
      });
    },
  } as unknown as RoutineRepository;
}

describe('createRoutine', () => {
  it('rejects an empty name', async () => {
    // Arrange
    const create = createRoutine(fakeRepository());

    // Act
    const result = create('   ');

    // Assert
    await expect(result).rejects.toThrow('obligatorio');
  });

  it('trims the name and marks the routine active', async () => {
    // Arrange
    const create = createRoutine(fakeRepository());

    // Act
    const routine = await create('  Pierna A  ');

    // Assert
    expect(routine.name).toBe('Pierna A');
    expect(routine.isActive).toBe(true);
  });
});
