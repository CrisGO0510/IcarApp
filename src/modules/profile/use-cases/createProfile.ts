import type { UserProfileRepository } from '../repositories/profile.repository.port';
import type { UserProfile } from '../types/profile.types';

export function createProfile(repository: UserProfileRepository) {
  return async (
    data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserProfile> => {
    const existing = await repository.get();
    if (existing) {
      throw new Error('Profile already exists. Use updateProfile instead.');
    }

    return repository.save(data);
  };
}
