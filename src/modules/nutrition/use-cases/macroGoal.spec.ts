import { describe, it, expect } from 'vitest';
import { saveMacroGoal } from './macroGoal';
import type { MacroGoalRepository } from '../repositories/nutrition.repository.port';
import type { MacroGoal, MacroGoalInput } from '../types/nutrition.types';

function input(overrides: Partial<MacroGoalInput> = {}): MacroGoalInput {
  return {
    date: '2026-06-24',
    calorieGoal: 2450,
    proteinGoal: 180,
    carbohydrateGoal: 245,
    fatGoal: 80,
    ...overrides,
  };
}

describe('saveMacroGoal', () => {
  it('creates a new active goal when none exists', async () => {
    // Arrange
    let created: Partial<MacroGoal> | null = null;
    const repo = {
      findActive: () => Promise.resolve(null),
      create: (data: Omit<MacroGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
        created = data;
        return Promise.resolve({ ...data, id: 'g-1' } as MacroGoal);
      },
    } as unknown as MacroGoalRepository;
    const save = saveMacroGoal(repo);

    // Act
    await save(input());

    // Assert
    expect(created!.isActive).toBe(true);
    expect(created!.calorieGoal).toBe(2450);
  });

  it('updates the existing active goal instead of creating another', async () => {
    // Arrange
    let updatedId: string | null = null;
    const repo = {
      findActive: () => Promise.resolve({ id: 'g-active' } as MacroGoal),
      update: (id: string, data: Partial<MacroGoal>) => {
        updatedId = id;
        return Promise.resolve({ ...data, id } as MacroGoal);
      },
    } as unknown as MacroGoalRepository;
    const save = saveMacroGoal(repo);

    // Act
    await save(input());

    // Assert
    expect(updatedId).toBe('g-active');
  });
});
