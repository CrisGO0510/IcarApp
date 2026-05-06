import type { UserProfileRepository } from '../repositories/profile.repository.port';
import type { UserProfile } from '../types/profile.types';

export function getProfile(repository: UserProfileRepository) {
  return async (): Promise<UserProfile | null> => {
    return repository.get();
  };
}
