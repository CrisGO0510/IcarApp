import type { Repository } from 'src/core/types/base.types';
import type { BodyWeightLog } from '../types/measurements.types';

export interface BodyWeightLogRepository extends Repository<BodyWeightLog> {
  findByDate(date: string): Promise<BodyWeightLog | null>;
}
