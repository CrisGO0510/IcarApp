import type { UserProfile } from '../types/profile.types';

// ── UserProfile Port ─────────────────────────────────────────────────
// Single-record entity: no findAll/delete needed for MVP.

export interface UserProfileRepository {
  get(): Promise<UserProfile | null>;
  save(data: Partial<UserProfile>): Promise<UserProfile>;
}
