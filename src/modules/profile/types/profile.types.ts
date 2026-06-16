import type { BaseEntity } from 'src/core/types/base.types';

// ── Constants ────────────────────────────────────────────────────────

export const UNIT_SYSTEMS = ['metric', 'imperial'] as const;
export type UnitSystem = (typeof UNIT_SYSTEMS)[number];

export const REST_TIME_PRESETS = [60, 90, 120] as const;
export type RestTimePreset = (typeof REST_TIME_PRESETS)[number];

// ── User Profile ─────────────────────────────────────────────────────

export interface UserProfile extends BaseEntity {
  name: string;
  defaultRestTime: number; // seconds
  unitSystem: UnitSystem;
  maintenanceCalories: number;
  weight: number; // kg or lbs depending on unitSystem
  height: number; // cm or in depending on unitSystem
}

export interface OnboardingForm {
  name: string;
  unitSystem: UnitSystem;
  maintenanceCalories: number;
  weight: number;
  height: number;
}
