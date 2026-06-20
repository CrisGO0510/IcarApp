import { describe, it, expect } from 'vitest';
import { buildWeightProgression, summarizeWeight } from './bodyWeight';
import { makeWeight } from './fixtures';
import type { BodyWeightEntry } from '../types/progress.types';

const NOW = new Date('2026-06-21T12:00:00');

describe('buildWeightProgression', () => {
  it('returns no points when the log is empty', () => {
    // Arrange
    const log: BodyWeightEntry[] = [];

    // Act
    const progression = buildWeightProgression(log, '1S', NOW);

    // Assert
    expect(progression.points).toEqual([]);
    expect(progression.subtitle).toBe('Últimos 7 días');
  });

  it('keeps only entries inside the range and orders them chronologically', () => {
    // Arrange
    const log = [
      makeWeight({ date: new Date('2026-06-20T08:00:00'), weight: 81 }),
      makeWeight({ date: new Date('2026-06-18T08:00:00'), weight: 82 }),
      makeWeight({ date: new Date('2026-05-01T08:00:00'), weight: 90 }),
    ];

    // Act
    const progression = buildWeightProgression(log, '1S', NOW);

    // Assert
    expect(progression.points.map((p) => p.value)).toEqual([82, 81]);
  });

  it('labels weekly points with weekday names', () => {
    // Arrange
    const log = [makeWeight({ date: new Date('2026-06-20T08:00:00'), weight: 81 })];

    // Act
    const progression = buildWeightProgression(log, '1S', NOW);

    // Assert
    expect(progression.points[0]!.label).toBe('Sáb');
  });
});

describe('summarizeWeight', () => {
  it('returns nulls when there is no data in range', () => {
    // Arrange
    const log = [makeWeight({ date: new Date('2026-01-01T08:00:00') })];

    // Act
    const summary = summarizeWeight(log, '1S', NOW);

    // Assert
    expect(summary).toEqual({ currentWeight: null, weightDelta: null });
  });

  it('computes current weight and delta across the range', () => {
    // Arrange
    const log = [
      makeWeight({ date: new Date('2026-06-16T08:00:00'), weight: 82.5 }),
      makeWeight({ date: new Date('2026-06-20T08:00:00'), weight: 81.8 }),
    ];

    // Act
    const summary = summarizeWeight(log, '1S', NOW);

    // Assert
    expect(summary.currentWeight).toBe(81.8);
    expect(summary.weightDelta).toBe(-0.7);
  });
});
