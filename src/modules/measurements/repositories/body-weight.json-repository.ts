import { JsonRepository } from 'src/core/repositories/json.repository';
import type { BodyWeightLog } from '../types/measurements.types';
import type { BodyWeightLogRepository } from './measurements.repository.port';

export class BodyWeightLogJsonRepository
  extends JsonRepository<BodyWeightLog>
  implements BodyWeightLogRepository
{
  protected storageKey = 'icarapp:body_weight_logs';

  async findByDate(date: string): Promise<BodyWeightLog | null> {
    const all = await this.findAll();
    return all.find((log) => log.date === date) ?? null;
  }
}
