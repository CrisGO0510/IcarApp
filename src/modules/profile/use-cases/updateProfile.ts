import type { UserProfileRepository } from '../repositories/profile.repository.port';
import type { UserProfile } from '../types/profile.types';

export function updateProfile(repository: UserProfileRepository) {
  return async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const existing = await repository.get();
    if (!existing) {
      throw new Error('No profile found. Use createProfile first.');
    }

    return repository.save(data);
  };
}
