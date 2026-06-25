import { describe, it, expect } from 'vitest';
import { syncRoutineExercises } from './syncRoutineExercises';
import type { RoutineExerciseRepository } from '../repositories/training.repository.port';
import type { RoutineExercise } from '../types/training.types';

function fakeRepository(initial: RoutineExercise[] = []) {
  let items = [...initial];
  let counter = initial.length;

  const repository = {
    findByRoutine(routineId: string): Promise<RoutineExercise[]> {
      return Promise.resolve(
        items
          .filter((pivot) => pivot.routineId === routineId && !pivot.deletedAt)
          .sort((a, b) => a.orderIndex - b.orderIndex),
      );
    },
    create(data: Omit<RoutineExercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoutineExercise> {
      const entity: RoutineExercise = {
        ...data,
        id: `p-${counter++}`,
        createdAt: new Date('2026-06-20T00:00:00'),
        updatedAt: new Date('2026-06-20T00:00:00'),
      };
      items.push(entity);
      return Promise.resolve(entity);
    },
    update(id: string, patch: Partial<RoutineExercise>): Promise<RoutineExercise | null> {
      const index = items.findIndex((pivot) => pivot.id === id);
      if (index === -1) return Promise.resolve(null);
      const updated = { ...items[index]!, ...patch };
      items[index] = updated;
      return Promise.resolve(updated);
    },
    delete(id: string): Promise<boolean> {
      items = items.filter((pivot) => pivot.id !== id);
      return Promise.resolve(true);
    },
  } as unknown as RoutineExerciseRepository;

  return { repository, snapshot: () => items };
}

function makePivot(overrides: Partial<RoutineExercise>): RoutineExercise {
  return {
    id: 'p0',
    routineId: 'r1',
    exerciseId: 'e1',
    orderIndex: 0,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    ...overrides,
  };
}

describe('syncRoutineExercises', () => {
  it('creates pivots for a routine that had none, indexed by position', async () => {
    // Arrange
    const { repository, snapshot } = fakeRepository();
    const sync = syncRoutineExercises(repository);

    // Act
    await sync('r1', ['e1', 'e2']);

    // Assert
    const created = snapshot();
    expect(created).toHaveLength(2);
    expect(created.map((pivot) => [pivot.exerciseId, pivot.orderIndex])).toEqual([
      ['e1', 0],
      ['e2', 1],
    ]);
  });

  it('removes pivots whose exercise is no longer selected', async () => {
    // Arrange
    const { repository, snapshot } = fakeRepository([
      makePivot({ id: 'p1', exerciseId: 'e1', orderIndex: 0 }),
      makePivot({ id: 'p2', exerciseId: 'e2', orderIndex: 1 }),
    ]);
    const sync = syncRoutineExercises(repository);

    // Act
    await sync('r1', ['e1']);

    // Assert
    expect(snapshot().map((pivot) => pivot.exerciseId)).toEqual(['e1']);
  });

  it('reorders existing pivots to match the new selection order', async () => {
    // Arrange
    const { repository, snapshot } = fakeRepository([
      makePivot({ id: 'p1', exerciseId: 'e1', orderIndex: 0 }),
      makePivot({ id: 'p2', exerciseId: 'e2', orderIndex: 1 }),
    ]);
    const sync = syncRoutineExercises(repository);

    // Act
    await sync('r1', ['e2', 'e1']);

    // Assert
    const byId = new Map(snapshot().map((pivot) => [pivot.exerciseId, pivot.orderIndex]));
    expect(byId.get('e2')).toBe(0);
    expect(byId.get('e1')).toBe(1);
  });
});
