import { describe, it, expect } from 'vitest';
import { logWeight } from './logWeight';
import type { BodyWeightLogRepository } from '../repositories/measurements.repository.port';
import type { BodyWeightLog } from '../types/measurements.types';

describe('logWeight', () => {
  it('rejects a non-positive weight', async () => {
    // Arrange
    const repo = {} as unknown as BodyWeightLogRepository;
    const log = logWeight(repo);

    // Act
    const result = log({ date: '2026-06-24', weightKg: 0 });

    // Assert
    await expect(result).rejects.toThrow('mayor que cero');
  });

  it('creates a log when none exists for the date', async () => {
    // Arrange
    let created: Partial<BodyWeightLog> | null = null;
    const repo = {
      findByDate: () => Promise.resolve(null),
      create: (data: Omit<BodyWeightLog, 'id' | 'createdAt' | 'updatedAt'>) => {
        created = data;
        return Promise.resolve({ ...data, id: 'w1' } as BodyWeightLog);
      },
    } as unknown as BodyWeightLogRepository;
    const log = logWeight(repo);

    // Act
    await log({ date: '2026-06-24', weightKg: 81.5 });

    // Assert
    expect(created!.weightKg).toBe(81.5);
  });

  it('updates the existing log for the same date', async () => {
    // Arrange
    let updatedId: string | null = null;
    const repo = {
      findByDate: () =>
        Promise.resolve({ id: 'w-existing', date: '2026-06-24', weightKg: 80 } as BodyWeightLog),
      update: (id: string, data: Partial<BodyWeightLog>) => {
        updatedId = id;
        return Promise.resolve({ id, date: '2026-06-24', ...data } as BodyWeightLog);
      },
    } as unknown as BodyWeightLogRepository;
    const log = logWeight(repo);

    // Act
    await log({ date: '2026-06-24', weightKg: 81.5 });

    // Assert
    expect(updatedId).toBe('w-existing');
  });
});
