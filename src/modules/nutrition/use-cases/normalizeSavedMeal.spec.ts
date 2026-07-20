import { describe, it, expect } from 'vitest';
import { normalizeSavedMeal } from './normalizeSavedMeal';

describe('normalizeSavedMeal', () => {
  it('normaliza totales de una porción a la base de 100 g', () => {
    // Arrange
    const totals = { protein: 40, carbohydrates: 50, fat: 10, calories: 460 };

    // Act
    const result = normalizeSavedMeal(totals, 250);

    // Assert
    expect(result).toEqual({
      proteinPerBase: 16,
      carbohydratesPerBase: 20,
      fatPerBase: 4,
      caloriesPerBase: 184,
    });
  });

  it('redondea macros a 1 decimal y kcal a entero', () => {
    // Arrange
    const totals = { protein: 10, carbohydrates: 20, fat: 5, calories: 100 };

    // Act
    const result = normalizeSavedMeal(totals, 300);

    // Assert
    expect(result).toEqual({
      proteinPerBase: 3.3,
      carbohydratesPerBase: 6.7,
      fatPerBase: 1.7,
      caloriesPerBase: 33,
    });
  });

  it('rechaza gramos menores o iguales a cero', () => {
    // Arrange
    const totals = { protein: 1, carbohydrates: 1, fat: 1, calories: 17 };

    // Act
    const act = () => normalizeSavedMeal(totals, 0);

    // Assert
    expect(act).toThrow('mayor a cero');
  });
});
