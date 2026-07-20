import { describe, it, expect } from 'vitest';
import { logActivity, updateActivity, deleteActivity, listActivitiesByDate } from './activityEntry';
import type { ActivityEntryRepository } from '../repositories/nutrition.repository.port';
import type { ActivityEntry, ActivityInput } from '../types/nutrition.types';

const NOW = new Date(2026, 6, 7, 10, 0);

function makeInput(overrides: Partial<ActivityInput>): ActivityInput {
  return {
    date: '2026-07-07',
    type: 'Correr',
    caloriesBurned: 300,
    durationMinutes: 30,
    loggedAt: NOW,
    ...overrides,
  };
}

function repoWith(entries: ActivityEntry[]): ActivityEntryRepository {
  return {
    create: (data: Omit<ActivityEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const entry = { ...data, id: `a${entries.length + 1}`, createdAt: NOW, updatedAt: NOW };
      entries.push(entry);
      return Promise.resolve(entry);
    },
    update: (id: string, data: Partial<ActivityEntry>) => {
      const idx = entries.findIndex((entry) => entry.id === id);
      if (idx === -1) return Promise.resolve(null);
      entries[idx] = { ...entries[idx]!, ...data };
      return Promise.resolve(entries[idx]);
    },
    delete: (id: string) => {
      const idx = entries.findIndex((entry) => entry.id === id);
      if (idx === -1) return Promise.resolve(false);
      entries.splice(idx, 1);
      return Promise.resolve(true);
    },
    findByDate: (date: string) =>
      Promise.resolve(entries.filter((entry) => entry.date === date)),
    findById: (id: string) => Promise.resolve(entries.find((entry) => entry.id === id) ?? null),
  } as unknown as ActivityEntryRepository;
}

describe('logActivity', () => {
  it('creates an activity entry', async () => {
    // Arrange
    const entries: ActivityEntry[] = [];
    const log = logActivity(repoWith(entries));

    // Act
    const result = await log(makeInput({}));

    // Assert
    expect(result.type).toBe('Correr');
    expect(entries).toHaveLength(1);
  });

  it('rounds burned calories to an integer', async () => {
    // Arrange
    const entries: ActivityEntry[] = [];
    const log = logActivity(repoWith(entries));

    // Act
    const result = await log(makeInput({ caloriesBurned: 300.6 }));

    // Assert
    expect(result.caloriesBurned).toBe(301);
  });

  it('rejects an empty type', async () => {
    // Arrange
    const log = logActivity(repoWith([]));

    // Act
    const result = log(makeInput({ type: '  ' }));

    // Assert
    await expect(result).rejects.toThrow('El tipo de actividad es obligatorio.');
  });

  it('rejects non-positive calories', async () => {
    // Arrange
    const log = logActivity(repoWith([]));

    // Act
    const result = log(makeInput({ caloriesBurned: 0 }));

    // Assert
    await expect(result).rejects.toThrow('Las calorías quemadas deben ser mayores a cero.');
  });

  it('rejects non-positive duration', async () => {
    // Arrange
    const log = logActivity(repoWith([]));

    // Act
    const result = log(makeInput({ durationMinutes: 0 }));

    // Assert
    await expect(result).rejects.toThrow('La duración debe ser mayor a cero.');
  });
});

describe('updateActivity', () => {
  it('updates and validates like log', async () => {
    // Arrange
    const entries: ActivityEntry[] = [];
    const repo = repoWith(entries);
    const created = await logActivity(repo)(makeInput({}));
    const update = updateActivity(repo);

    // Act
    const result = await update(created.id, makeInput({ caloriesBurned: 450 }));

    // Assert
    expect(result.caloriesBurned).toBe(450);
  });

  it('throws when the activity does not exist', async () => {
    // Arrange
    const update = updateActivity(repoWith([]));

    // Act
    const result = update('missing', makeInput({}));

    // Assert
    await expect(result).rejects.toThrow('No se encontró la actividad.');
  });
});

describe('deleteActivity / listActivitiesByDate', () => {
  it('deletes and lists by date', async () => {
    // Arrange
    const entries: ActivityEntry[] = [];
    const repo = repoWith(entries);
    const created = await logActivity(repo)(makeInput({}));
    await logActivity(repo)(makeInput({ date: '2026-07-06' }));

    // Act
    await deleteActivity(repo)(created.id);
    const remaining = await listActivitiesByDate(repo)('2026-07-06');

    // Assert
    expect(entries).toHaveLength(1);
    expect(remaining).toHaveLength(1);
  });
});
