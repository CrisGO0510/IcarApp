import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { UserProfile } from '../types/profile.types';
import { ProfileJsonRepository } from '../repositories/profile.json-repository';
import { getProfile } from '../use-cases/getProfile';
import { createProfile } from '../use-cases/createProfile';
import { updateProfile } from '../use-cases/updateProfile';

export const useProfileStore = defineStore('profile', () => {
  const repository = new ProfileJsonRepository();

  const get = getProfile(repository);
  const create = createProfile(repository);
  const update = updateProfile(repository);

  const profile = ref<UserProfile | null>(null);
  const hasProfile = computed(() => profile.value !== null);

  async function loadProfile(): Promise<void> {
    profile.value = await get();
  }

  async function saveProfile(
    data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    if (profile.value) {
      profile.value = await update(data);
    } else {
      profile.value = await create(data);
    }
  }

  return {
    profile,
    hasProfile,
    loadProfile,
    saveProfile,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot));
}
