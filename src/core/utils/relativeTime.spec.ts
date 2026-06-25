import { describe, it, expect } from 'vitest';
import { relativeTimeEs, isWithinLast24h } from './relativeTime';

const NOW = new Date('2026-06-20T12:00:00');

describe('relativeTimeEs', () => {
  it('reports very recent times as "hace un momento"', () => {
    // Arrange
    const date = new Date('2026-06-20T11:59:30');

    // Act
    const result = relativeTimeEs(date, NOW);

    // Assert
    expect(result).toBe('hace un momento');
  });

  it('reports minutes and hours within the day', () => {
    // Arrange
    const oneMinute = new Date('2026-06-20T11:59:00');
    const threeHours = new Date('2026-06-20T09:00:00');

    // Act & Assert
    expect(relativeTimeEs(oneMinute, NOW)).toBe('hace 1 minuto');
    expect(relativeTimeEs(threeHours, NOW)).toBe('hace 3 horas');
  });

  it('reports days, weeks and months as the gap grows', () => {
    // Arrange
    const fourDays = new Date('2026-06-16T12:00:00');
    const twoWeeks = new Date('2026-06-06T12:00:00');
    const twoMonths = new Date('2026-04-21T12:00:00');

    // Act & Assert
    expect(relativeTimeEs(fourDays, NOW)).toBe('hace 4 días');
    expect(relativeTimeEs(twoWeeks, NOW)).toBe('hace 2 semanas');
    expect(relativeTimeEs(twoMonths, NOW)).toBe('hace 2 meses');
  });
});

describe('isWithinLast24h', () => {
  it('is true for a time less than 24 hours ago', () => {
    // Arrange
    const date = new Date('2026-06-19T13:00:00');

    // Act
    const result = isWithinLast24h(date, NOW);

    // Assert
    expect(result).toBe(true);
  });

  it('is false for a time more than 24 hours ago', () => {
    // Arrange
    const date = new Date('2026-06-19T11:00:00');

    // Act
    const result = isWithinLast24h(date, NOW);

    // Assert
    expect(result).toBe(false);
  });
});
