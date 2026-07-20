import { describe, it, expect } from 'vitest';
import { sortRoutineSummaries } from './sortRoutineSummaries';
import { ROUTINE_SORT_MODE } from '../types/training.types';
import type { RoutineSummary } from '../types/training.types';

function summary(
  name: string,
  lastPerformedAt: Date | null,
  createdAt = new Date('2026-01-01T00:00:00'),
): RoutineSummary {
  return {
    routine: {
      id: name,
      name,
      isActive: true,
      createdAt,
      updatedAt: createdAt,
    },
    exerciseCount: 0,
    lastPerformedAt,
    durationMinutes: null,
    inProgress: false,
  };
}

describe('sortRoutineSummaries', () => {
  it('orders by last performed descending in recent mode', () => {
    // Arrange
    const older = summary('Pierna', new Date('2026-07-10T08:00:00'));
    const newer = summary('Espalda', new Date('2026-07-18T08:00:00'));

    // Act
    const result = sortRoutineSummaries([older, newer], ROUTINE_SORT_MODE.RECENT);

    // Assert
    expect(result.map((s) => s.routine.name)).toEqual(['Espalda', 'Pierna']);
  });

  it('puts never performed routines last, ordered by creation descending', () => {
    // Arrange
    const performed = summary('Pierna', new Date('2026-07-10T08:00:00'));
    const newUnused = summary('Hombro', null, new Date('2026-07-19T00:00:00'));
    const oldUnused = summary('Brazo', null, new Date('2026-07-01T00:00:00'));

    // Act
    const result = sortRoutineSummaries([oldUnused, newUnused, performed], ROUTINE_SORT_MODE.RECENT);

    // Assert
    expect(result.map((s) => s.routine.name)).toEqual(['Pierna', 'Hombro', 'Brazo']);
  });

  it('orders by name ignoring case and accents in alphabetical mode', () => {
    // Arrange
    const list = [
      summary('pecho', null),
      summary('Ábdomen', null),
      summary('Espalda', new Date('2026-07-18T08:00:00')),
    ];

    // Act
    const result = sortRoutineSummaries(list, ROUTINE_SORT_MODE.ALPHABETICAL);

    // Assert
    expect(result.map((s) => s.routine.name)).toEqual(['Ábdomen', 'Espalda', 'pecho']);
  });

  it('does not mutate the input array', () => {
    // Arrange
    const list = [summary('B', null), summary('A', null)];

    // Act
    sortRoutineSummaries(list, ROUTINE_SORT_MODE.ALPHABETICAL);

    // Assert
    expect(list.map((s) => s.routine.name)).toEqual(['B', 'A']);
  });
});
