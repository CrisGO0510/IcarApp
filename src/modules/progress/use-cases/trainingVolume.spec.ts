import { describe, it, expect } from 'vitest';
import { buildTrainingVolume, computeAttendance, volumeOptions } from './trainingVolume';
import { makeVolume } from './fixtures';
import { ALL_FILTER, type VolumeFilters } from '../types/progress.types';

const NOW = new Date('2026-06-21T12:00:00');
const ALL: VolumeFilters = { routine: ALL_FILTER, type: ALL_FILTER };

describe('buildTrainingVolume', () => {
  it('buckets sessions into weeks labelled oldest-first', () => {
    // Arrange
    const volumes = [
      makeVolume({ sessionId: 'a', date: new Date('2026-06-20T08:00:00'), sets: 4, weight: 400 }),
      makeVolume({ sessionId: 'b', date: new Date('2026-06-10T08:00:00'), sets: 2, weight: 200 }),
    ];

    // Act
    const points = buildTrainingVolume(volumes, '1M', ALL, NOW);

    // Assert
    expect(points.map((p) => p.label)).toEqual(['Sem 1', 'Sem 2']);
    expect(points[0]).toMatchObject({ sets: 2, weight: 200 });
    expect(points[1]).toMatchObject({ sets: 4, weight: 400 });
  });

  it('sums sets and weight within the same week', () => {
    // Arrange
    const volumes = [
      makeVolume({ sessionId: 'a', date: new Date('2026-06-20T08:00:00'), sets: 3, weight: 300 }),
      makeVolume({ sessionId: 'a', date: new Date('2026-06-20T08:00:00'), sets: 2, weight: 150 }),
    ];

    // Act
    const points = buildTrainingVolume(volumes, '1M', ALL, NOW);

    // Assert
    expect(points).toHaveLength(1);
    expect(points[0]).toMatchObject({ label: 'Sem 1', sets: 5, weight: 450 });
  });

  it('filters by routine and type', () => {
    // Arrange
    const volumes = [
      makeVolume({ routine: 'Push A', type: 'Pecho', sets: 3 }),
      makeVolume({ routine: 'Pull B', type: 'Espalda', sets: 9 }),
    ];

    // Act
    const points = buildTrainingVolume(volumes, '1M', { routine: 'Push A', type: ALL_FILTER }, NOW);

    // Assert
    expect(points).toHaveLength(1);
    expect(points[0]!.sets).toBe(3);
  });
});

describe('volumeOptions', () => {
  it('lists distinct routines and types with the all-option first', () => {
    // Arrange
    const volumes = [
      makeVolume({ routine: 'Push A', type: 'Pecho' }),
      makeVolume({ routine: 'Pull B', type: 'Pecho' }),
    ];

    // Act
    const options = volumeOptions(volumes);

    // Assert
    expect(options.routines).toEqual([ALL_FILTER, 'Push A', 'Pull B']);
    expect(options.types).toEqual([ALL_FILTER, 'Pecho']);
  });
});

describe('computeAttendance', () => {
  it('counts distinct sessions within the range', () => {
    // Arrange
    const volumes = [
      makeVolume({ sessionId: 'a', date: new Date('2026-06-20T08:00:00') }),
      makeVolume({ sessionId: 'a', date: new Date('2026-06-20T08:00:00') }),
      makeVolume({ sessionId: 'b', date: new Date('2026-06-19T08:00:00') }),
      makeVolume({ sessionId: 'old', date: new Date('2026-01-01T08:00:00') }),
    ];

    // Act
    const attendance = computeAttendance(volumes, '1S', NOW);

    // Assert
    expect(attendance).toBe(2);
  });
});
