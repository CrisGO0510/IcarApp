import { describe, it, expect } from 'vitest';
import { filterExercises, sortExercises } from './exerciseQuery';
import type { Exercise } from '../types/training.types';

function makeExercise(name: string, createdAt: string): Exercise {
  return {
    id: name,
    name,
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
  };
}

describe('filterExercises', () => {
  it('returns every exercise when the query is empty', () => {
    // Arrange
    const list = [makeExercise('Prensa', '2026-06-01'), makeExercise('Remo', '2026-06-02')];

    // Act
    const result = filterExercises(list, '   ');

    // Assert
    expect(result).toHaveLength(2);
  });

  it('matches the name case-insensitively by substring', () => {
    // Arrange
    const list = [makeExercise('Press de Banca', '2026-06-01'), makeExercise('Remo', '2026-06-02')];

    // Act
    const result = filterExercises(list, 'press');

    // Assert
    expect(result.map((exercise) => exercise.name)).toEqual(['Press de Banca']);
  });
});

describe('sortExercises', () => {
  it('orders alphabetically when sort is alpha', () => {
    // Arrange
    const list = [makeExercise('Remo', '2026-06-01'), makeExercise('Curl', '2026-06-02')];

    // Act
    const result = sortExercises(list, 'alpha');

    // Assert
    expect(result.map((exercise) => exercise.name)).toEqual(['Curl', 'Remo']);
  });

  it('orders by most recent creation when sort is recent', () => {
    // Arrange
    const list = [makeExercise('Viejo', '2026-06-01'), makeExercise('Nuevo', '2026-06-10')];

    // Act
    const result = sortExercises(list, 'recent');

    // Assert
    expect(result.map((exercise) => exercise.name)).toEqual(['Nuevo', 'Viejo']);
  });
});
