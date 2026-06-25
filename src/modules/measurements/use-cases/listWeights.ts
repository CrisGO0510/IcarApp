import type { BodyWeightLogRepository } from '../repositories/measurements.repository.port';
import type { BodyWeightLog } from '../types/measurements.types';

export function listWeights(repository: BodyWeightLogRepository) {
  return async (): Promise<BodyWeightLog[]> => {
    const all = await repository.findAll();
    return [...all].sort((a, b) => a.date.localeCompare(b.date));
  };
}
