import { describe, it, expect } from 'vitest';
import { dateKey, todayKey, shiftDateKey, isTodayKey } from './dateKey';

describe('dateKey utils', () => {
  it('formats a date as YYYY-MM-DD', () => {
    // Arrange
    const date = new Date(2026, 6, 7);

    // Act
    const result = dateKey(date);

    // Assert
    expect(result).toBe('2026-07-07');
  });

  it('shifts a key by days across month boundaries', () => {
    // Arrange
    const key = '2026-07-01';

    // Act
    const result = shiftDateKey(key, -1);

    // Assert
    expect(result).toBe('2026-06-30');
  });

  it('detects today', () => {
    // Arrange
    const now = new Date();

    // Act
    const result = isTodayKey(dateKey(now), now);

    // Assert
    expect(result).toBe(true);
  });

  it('todayKey equals dateKey of now', () => {
    // Arrange
    const now = new Date();

    // Act
    const result = todayKey(now);

    // Assert
    expect(result).toBe(dateKey(now));
  });
});
