import { describe, it, expect } from 'vitest';
import { logMeal } from './logMeal';
import type { MealEntryRepository } from '../repositories/nutrition.repository.port';
import type { MealEntry, MealInput } from '../types/nutrition.types';

function fakeRepo(): { repo: MealEntryRepository; created: Partial<MealEntry>[] } {
  const created: Partial<MealEntry>[] = [];
  const repo = {
    create(data: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealEntry> {
      created.push(data);
      return Promise.resolve({
        ...data,
        id: 'm-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  } as unknown as MealEntryRepository;
  return { repo, created };
}

function input(overrides: Partial<MealInput> = {}): MealInput {
  return {
    date: '2026-06-24',
    foodName: 'Pollo',
    quantity: 150,
    unit: 'g',
    protein: 25,
    carbohydrates: 0,
    fat: 3,
    loggedAt: new Date('2026-06-24T08:30:00'),
    ...overrides,
  };
}

describe('logMeal', () => {
  it('rejects an empty food name', async () => {
    // Arrange
    const { repo } = fakeRepo();
    const log = logMeal(repo);

    // Act
    const result = log(input({ foodName: '   ' }));

    // Assert
    await expect(result).rejects.toThrow('obligatorio');
  });

  it('computes calories when omitted', async () => {
    // Arrange
    const { repo, created } = fakeRepo();
    const log = logMeal(repo);

    // Act
    await log(input());

    // Assert
    expect(created[0]!.calories).toBe(127);
  });

  it('rounds macros to one decimal and calories to an integer before persisting', async () => {
    // Arrange
    const { repo, created } = fakeRepo();
    const log = logMeal(repo);

    // Act
    await log(input({ protein: 25.456, carbohydrates: 10.04, fat: 3.35, calories: 199.6 }));

    // Assert
    expect(created[0]!.protein).toBe(25.5);
    expect(created[0]!.carbohydrates).toBe(10);
    expect(created[0]!.fat).toBe(3.4);
    expect(created[0]!.calories).toBe(200);
  });

  it('keeps the provided calories when given', async () => {
    // Arrange
    const { repo, created } = fakeRepo();
    const log = logMeal(repo);

    // Act
    await log(input({ calories: 200 }));

    // Assert
    expect(created[0]!.calories).toBe(200);
  });
});
