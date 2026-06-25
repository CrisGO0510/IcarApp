import type { BodyWeightLogRepository } from '../repositories/measurements.repository.port';
import type { BodyWeightLog, WeightInput } from '../types/measurements.types';

export function logWeight(repository: BodyWeightLogRepository) {
  return async (input: WeightInput): Promise<BodyWeightLog> => {
    if (input.weightKg <= 0) {
      throw new Error('El peso debe ser mayor que cero.');
    }

    const existing = await repository.findByDate(input.date);
    if (existing) {
      const updated = await repository.update(existing.id, { weightKg: input.weightKg });
      if (!updated) {
        throw new Error('No se pudo actualizar el peso.');
      }
      return updated;
    }
    return repository.create({ date: input.date, weightKg: input.weightKg });
  };
}
