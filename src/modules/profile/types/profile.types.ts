import type { BaseEntity } from 'src/core/types/base.types';

// ── Constants ────────────────────────────────────────────────────────

export const ACTIVITY_LEVELS = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extra_active',
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export const FITNESS_GOALS = [
  'lose_weight',
  'maintain_weight',
  'gain_weight',
  'build_muscle',
  'improve_endurance',
] as const;

export type FitnessGoal = (typeof FITNESS_GOALS)[number];

// ── User Profile ─────────────────────────────────────────────────────

export interface UserProfile extends BaseEntity {
  name?: string;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  activityLevel?: ActivityLevel;
  goal?: FitnessGoal;
}
