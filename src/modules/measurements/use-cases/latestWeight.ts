import type { BodyWeightLogRepository } from '../repositories/measurements.repository.port';
import type { BodyWeightLog } from '../types/measurements.types';

export function latestWeight(repository: BodyWeightLogRepository) {
  return async (): Promise<BodyWeightLog | null> => {
    const all = await repository.findAll();
    if (all.length === 0) return null;
    return all.reduce((latest, log) => (log.date > latest.date ? log : latest));
  };
}
