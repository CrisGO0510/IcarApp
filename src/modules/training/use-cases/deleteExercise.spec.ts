import { describe, it, expect } from 'vitest';
import { deleteExercise } from './deleteExercise';
import type {
  ExerciseRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';
import type { RoutineExercise } from '../types/training.types';

function makePivot(id: string, exerciseId: string): RoutineExercise {
  return {
    id,
    routineId: 'r1',
    exerciseId,
    orderIndex: 0,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
  };
}

describe('deleteExercise', () => {
  it('deletes the exercise and removes only the pivots that reference it', async () => {
    // Arrange
    const deletedExercises: string[] = [];
    const exerciseRepo = {
      delete(id: string): Promise<boolean> {
        deletedExercises.push(id);
        return Promise.resolve(true);
      },
    } as unknown as ExerciseRepository;

    let pivots = [makePivot('p1', 'e1'), makePivot('p2', 'e2'), makePivot('p3', 'e1')];
    const pivotRepo = {
      findAll(): Promise<RoutineExercise[]> {
        return Promise.resolve(pivots);
      },
      delete(id: string): Promise<boolean> {
        pivots = pivots.filter((pivot) => pivot.id !== id);
        return Promise.resolve(true);
      },
    } as unknown as RoutineExerciseRepository;

    const remove = deleteExercise(exerciseRepo, pivotRepo);

    // Act
    await remove('e1');

    // Assert
    expect(deletedExercises).toEqual(['e1']);
    expect(pivots.map((pivot) => pivot.id)).toEqual(['p2']);
  });
});
