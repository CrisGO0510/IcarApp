import { describe, it, expect } from 'vitest';
import { resolveMealCalories } from './resolveMealCalories';

describe('resolveMealCalories', () => {
  it('computes from macros when there is no manual value', () => {
    // Arrange
    const manual = null;

    // Act
    const result = resolveMealCalories(manual, 30, 40, 10);

    // Assert
    expect(result).toBe(4 * 30 + 4 * 40 + 9 * 10);
  });

  it('computes from macros when the manual value is undefined', () => {
    // Arrange
    const manual = undefined;

    // Act
    const result = resolveMealCalories(manual, 30, 40, 10);

    // Assert
    expect(result).toBe(4 * 30 + 4 * 40 + 9 * 10);
  });

  it('prefers the manual value when present', () => {
    // Arrange
    const manual = 500;

    // Act
    const result = resolveMealCalories(manual, 30, 40, 10);

    // Assert
    expect(result).toBe(500);
  });

  it('treats zero manual value as manual', () => {
    // Arrange
    const manual = 0;

    // Act
    const result = resolveMealCalories(manual, 30, 40, 10);

    // Assert
    expect(result).toBe(0);
  });
});
