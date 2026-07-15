import { describe, it, expect } from 'vitest';
import { scaleMealFromReference } from './scaleMealFromReference';

describe('scaleMealFromReference', () => {
  it('returns the table values unchanged when eaten grams equal the base', () => {
    // Arrange
    const table = { base: 100, protein: 20, carbohydrates: 30, fat: 5, calories: 165 };

    // Act
    const result = scaleMealFromReference(table, 100);

    // Assert
    expect(result).toEqual({ protein: 20, carbohydrates: 30, fat: 5, calories: 165 });
  });

  it('scales macros by grams / base and rounds them to one decimal', () => {
    // Arrange
    const table = { base: 100, protein: 20, carbohydrates: 30, fat: 5, calories: 165 };

    // Act
    const result = scaleMealFromReference(table, 83);

    // Assert
    expect(result.protein).toBe(16.6);
    expect(result.carbohydrates).toBe(24.9);
    expect(result.fat).toBe(4.1); // 5 * 0.83 = 4.15, rounds to 4.1 in float
    expect(result.calories).toBe(137); // 165 * 0.83 = 136.95 -> 137
  });

  it('supports a non-100 reference base', () => {
    // Arrange
    const table = { base: 30, protein: 6, carbohydrates: 9, fat: 1.5, calories: 75 };

    // Act
    const result = scaleMealFromReference(table, 83);

    // Assert
    const factor = 83 / 30;
    expect(result.protein).toBe(Math.round(6 * factor * 10) / 10);
    expect(result.calories).toBe(Math.round(75 * factor));
  });

  it('derives calories from macros when the table has no calories', () => {
    // Arrange
    const table = { base: 100, protein: 10, carbohydrates: 10, fat: 10 };

    // Act
    const result = scaleMealFromReference(table, 100);

    // Assert
    expect(result.calories).toBe(170); // 4*10 + 4*10 + 9*10
  });

  it('derives calories from the already-scaled macros', () => {
    // Arrange
    const table = { base: 100, protein: 20, carbohydrates: 0, fat: 0, calories: 0 };

    // Act
    const result = scaleMealFromReference(table, 50);

    // Assert
    expect(result.protein).toBe(10);
    expect(result.calories).toBe(40); // 4 * 10
  });

  it('returns zeros for an invalid base', () => {
    // Act
    const result = scaleMealFromReference({ base: 0, protein: 20, carbohydrates: 30, fat: 5 }, 83);

    // Assert
    expect(result).toEqual({ protein: 0, carbohydrates: 0, fat: 0, calories: 0 });
  });

  it('returns zeros when no grams were eaten', () => {
    // Act
    const result = scaleMealFromReference(
      { base: 100, protein: 20, carbohydrates: 30, fat: 5 },
      0,
    );

    // Assert
    expect(result).toEqual({ protein: 0, carbohydrates: 0, fat: 0, calories: 0 });
  });
});
