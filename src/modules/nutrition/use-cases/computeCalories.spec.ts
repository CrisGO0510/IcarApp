import { describe, it, expect } from 'vitest';
import { computeCalories } from './computeCalories';

describe('computeCalories', () => {
  it('applies 4/4/9 kcal per gram', () => {
    // Act
    const kcal = computeCalories(25, 0, 3);

    // Assert
    expect(kcal).toBe(127);
  });

  it('rounds to the nearest integer', () => {
    // Act
    const kcal = computeCalories(10.2, 5.1, 2.3);

    // Assert
    expect(kcal).toBe(Math.round(4 * 10.2 + 4 * 5.1 + 9 * 2.3));
  });
});
