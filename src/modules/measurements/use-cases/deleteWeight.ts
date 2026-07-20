import type { BodyWeightLogRepository } from '../repositories/measurements.repository.port';

export function deleteWeight(repository: BodyWeightLogRepository) {
  return async (id: string): Promise<boolean> => repository.delete(id);
}
