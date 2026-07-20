import { describe, it, expect } from 'vitest';
import { logSavedMeal } from './logSavedMeal';
import { QUANTITY_MODE } from '../types/nutrition.types';
import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry, SavedMeal } from '../types/nutrition.types';

function fakeRepo(): { repo: MealEntryRepository; created: Partial<MealEntry>[] } {
  const created: Partial<MealEntry>[] = [];
  const repo = {
    create(data: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealEntry> {
      created.push(data);
      return Promise.resolve({ ...data, id: 'm-1', createdAt: new Date(), updatedAt: new Date() });
    },
  } as unknown as MealEntryRepository;
  return { repo, created };
}

function savedMeal(overrides: Partial<SavedMeal> = {}): SavedMeal {
  return {
    id: 's-1',
    name: 'Arepa con queso',
    caloriesPerBase: 215,
    proteinPerBase: 8,
    carbohydratesPerBase: 30,
    fatPerBase: 7,
    unitGrams: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('logSavedMeal', () => {
  it('registra por gramos escalando desde la base de 100 g', async () => {
    // Arrange
    const { repo, created } = fakeRepo();
    const log = logSavedMeal(repo);

    // Act
    await log(savedMeal(), { mode: QUANTITY_MODE.GRAMS, amount: 150, date: '2026-07-20' });

    // Assert
    expect(created[0]).toMatchObject({
      date: '2026-07-20',
      foodName: 'Arepa con queso',
      quantity: 150,
      unit: 'gr',
      protein: 12,
      carbohydrates: 45,
      fat: 10.5,
      calories: 323,
    });
  });

  it('registra por unidades convirtiendo a gramos', async () => {
    // Arrange
    const { repo, created } = fakeRepo();
    const log = logSavedMeal(repo);

    // Act
    await log(savedMeal(), { mode: QUANTITY_MODE.UNITS, amount: 3, date: '2026-07-20' });

    // Assert
    expect(created[0]).toMatchObject({
      quantity: 225,
      protein: 18,
      carbohydrates: 67.5,
      fat: 15.8,
      calories: 484,
    });
  });

  it('rechaza el modo unidades si la comida no define gramos por unidad', async () => {
    // Arrange
    const { repo } = fakeRepo();
    const log = logSavedMeal(repo);

    // Act
    const result = log(savedMeal({ unitGrams: null }), {
      mode: QUANTITY_MODE.UNITS,
      amount: 2,
      date: '2026-07-20',
    });

    // Assert
    await expect(result).rejects.toThrow('unidad');
  });

  it('rechaza cantidades menores o iguales a cero', async () => {
    // Arrange
    const { repo } = fakeRepo();
    const log = logSavedMeal(repo);

    // Act
    const result = log(savedMeal(), { mode: QUANTITY_MODE.GRAMS, amount: 0, date: '2026-07-20' });

    // Assert
    await expect(result).rejects.toThrow('mayor a cero');
  });
});
