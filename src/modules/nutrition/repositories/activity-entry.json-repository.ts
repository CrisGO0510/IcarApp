import { JsonRepository } from 'src/core/repositories/json.repository';
import type { ActivityEntry } from '../types/nutrition.types';
import type { ActivityEntryRepository } from './nutrition.repository.port';

export class ActivityEntryJsonRepository
  extends JsonRepository<ActivityEntry>
  implements ActivityEntryRepository
{
  protected storageKey = 'icarapp:activity_entries';

  async findByDate(date: string): Promise<ActivityEntry[]> {
    const all = await this.findAll({ orderBy: 'loggedAt', orderDirection: 'ASC' });
    return all.filter((entry) => entry.date === date);
  }

  protected override deserialize(raw: unknown): ActivityEntry {
    const base = super.deserialize(raw);
    const obj = raw as Record<string, unknown>;
    return {
      ...base,
      loggedAt: new Date(obj.loggedAt as string),
    };
  }
}
