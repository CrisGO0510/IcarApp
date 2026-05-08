import { JsonRepository } from 'src/core/repositories/json.repository';
import type { UserProfile } from '../types/profile.types';
import type { UserProfileRepository } from './profile.repository.port';

export class ProfileJsonRepository
  extends JsonRepository<UserProfile>
  implements UserProfileRepository
{
  protected storageKey = 'icarapp:user_profile';

  async get(): Promise<UserProfile | null> {
    const all = await this.findAll({ limit: 1 });
    return all[0] ?? null;
  }

  async save(data: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.get();
    if (existing) {
      const updated = await this.update(existing.id, data);
      return updated!;
    }
    return this.create(data as Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>);
  }
}
