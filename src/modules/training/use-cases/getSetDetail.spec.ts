import { describe, it, expect } from 'vitest';
import { getSetDetail } from './getSetDetail';
import type {
  ExerciseSetRepository,
  RoutineExerciseRepository,
  ExerciseRepository,
} from '../repositories/training.repository.port';
import type { ExerciseSet, RoutineExercise, Exercise } from '../types/training.types';

const NOW = new Date(2026, 6, 1, 18, 0);

const set: ExerciseSet = {
  id: 's1',
  workoutSessionId: 'ws1',
  routineExerciseId: 'p1',
  setNumber: 1,
  reps: 10,
  weight: 100,
  isCompleted: true,
  createdAt: NOW,
  updatedAt: NOW,
};

const pivot: RoutineExercise = {
  id: 'p1',
  routineId: 'r1',
  exerciseId: 'e1',
  orderIndex: 0,
  createdAt: NOW,
  updatedAt: NOW,
};

const exercise: Exercise = {
  id: 'e1',
  name: 'Press de Banca',
  createdAt: NOW,
  updatedAt: NOW,
};

function repos(found: boolean) {
  return {
    setRepo: {
      findById: () => Promise.resolve(found ? set : null),
    } as unknown as ExerciseSetRepository,
    pivotRepo: {
      findById: () => Promise.resolve(pivot),
    } as unknown as RoutineExerciseRepository,
    exerciseRepo: {
      findById: () => Promise.resolve(exercise),
    } as unknown as ExerciseRepository,
  };
}

describe('getSetDetail', () => {
  it('returns the set with its exercise name', async () => {
    // Arrange
    const { setRepo, pivotRepo, exerciseRepo } = repos(true);
    const detail = getSetDetail(setRepo, pivotRepo, exerciseRepo);

    // Act
    const result = await detail('s1');

    // Assert
    expect(result.set.id).toBe('s1');
    expect(result.exerciseName).toBe('Press de Banca');
  });

  it('throws when the set does not exist', async () => {
    // Arrange
    const { setRepo, pivotRepo, exerciseRepo } = repos(false);
    const detail = getSetDetail(setRepo, pivotRepo, exerciseRepo);

    // Act
    const result = detail('missing');

    // Assert
    await expect(result).rejects.toThrow('No se encontró la serie.');
  });

  it('falls back to the default exercise name when the pivot is missing', async () => {
    // Arrange
    const { setRepo, exerciseRepo } = repos(true);
    const pivotRepo = {
      findById: () => Promise.resolve(null),
    } as unknown as RoutineExerciseRepository;
    const detail = getSetDetail(setRepo, pivotRepo, exerciseRepo);

    // Act
    const result = await detail('s1');

    // Assert
    expect(result.exerciseName).toBe('Ejercicio');
  });
});
