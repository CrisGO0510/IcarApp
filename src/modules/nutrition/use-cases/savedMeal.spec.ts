import { describe, it, expect } from 'vitest';
import { createSavedMeal, updateSavedMeal } from './savedMeal';
import type { SavedMealRepository } from '../repositories/nutrition.repository.port';
import type { SavedMeal, SavedMealInput } from '../types/nutrition.types';

function fakeRepo(): { repo: SavedMealRepository; writes: Partial<SavedMeal>[] } {
  const writes: Partial<SavedMeal>[] = [];
  const repo = {
    create(data: Omit<SavedMeal, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedMeal> {
      writes.push(data);
      return Promise.resolve({ ...data, id: 's-1', createdAt: new Date(), updatedAt: new Date() });
    },
    update(id: string, data: Partial<SavedMeal>): Promise<SavedMeal | null> {
      writes.push(data);
      return Promise.resolve({
        ...(data as SavedMeal),
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  } as unknown as SavedMealRepository;
  return { repo, writes };
}

function input(overrides: Partial<SavedMealInput> = {}): SavedMealInput {
  return {
    name: 'Arepa con queso',
    caloriesPerBase: 215,
    proteinPerBase: 8,
    carbohydratesPerBase: 30,
    fatPerBase: 7,
    unitGrams: 75,
    ...overrides,
  };
}

describe('createSavedMeal', () => {
  it('crea la comida con el nombre recortado', async () => {
    // Arrange
    const { repo, writes } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    await create(input({ name: '  Arepa con queso  ' }));

    // Assert
    expect(writes[0]!.name).toBe('Arepa con queso');
  });

  it('redondea los macros a un decimal y las calorías a entero', async () => {
    // Arrange
    const { repo, writes } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    await create(
      input({
        proteinPerBase: 8.456,
        carbohydratesPerBase: 30.04,
        fatPerBase: 7.35,
        caloriesPerBase: 215.6,
      }),
    );

    // Assert
    expect(writes[0]!.proteinPerBase).toBe(8.5);
    expect(writes[0]!.carbohydratesPerBase).toBe(30);
    expect(writes[0]!.fatPerBase).toBe(7.4);
    expect(writes[0]!.caloriesPerBase).toBe(216);
  });

  it('rechaza un nombre vacío', async () => {
    // Arrange
    const { repo } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    const result = create(input({ name: '   ' }));

    // Assert
    await expect(result).rejects.toThrow('obligatorio');
  });

  it('rechaza macros negativos', async () => {
    // Arrange
    const { repo } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    const result = create(input({ proteinPerBase: -1 }));

    // Assert
    await expect(result).rejects.toThrow('negativos');
  });

  it('rechaza gramos por unidad menores o iguales a cero', async () => {
    // Arrange
    const { repo } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    const result = create(input({ unitGrams: 0 }));

    // Assert
    await expect(result).rejects.toThrow('unidad');
  });

  it('deriva las kcal cuando no se proveen', async () => {
    // Arrange
    const { repo, writes } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    await create(input({ caloriesPerBase: null }));

    // Assert
    expect(writes[0]!.caloriesPerBase).toBe(215);
  });

  it('acepta unitGrams null (solo gramos)', async () => {
    // Arrange
    const { repo, writes } = fakeRepo();
    const create = createSavedMeal(repo);

    // Act
    await create(input({ unitGrams: null }));

    // Assert
    expect(writes[0]!.unitGrams).toBeNull();
  });
});

describe('updateSavedMeal', () => {
  it('valida y escribe los mismos campos que create', async () => {
    // Arrange
    const { repo, writes } = fakeRepo();
    const update = updateSavedMeal(repo);

    // Act
    await update('s-1', input({ unitGrams: null }));

    // Assert
    expect(writes[0]).toEqual({
      name: 'Arepa con queso',
      caloriesPerBase: 215,
      proteinPerBase: 8,
      carbohydratesPerBase: 30,
      fatPerBase: 7,
      unitGrams: null,
    });
  });
});
