import type { BaseEntity } from 'src/core/types/base.types';

// ── Constants ────────────────────────────────────────────────────────

export const UNIT_SYSTEMS = ['metric', 'imperial'] as const;
export type UnitSystem = (typeof UNIT_SYSTEMS)[number];

export const REST_TIME_PRESETS = [60, 90, 120] as const;
export type RestTimePreset = (typeof REST_TIME_PRESETS)[number];

export const SEXES = ['male', 'female'] as const;
export type Sex = (typeof SEXES)[number];

export const SEX_OPTIONS = [
  { label: 'Hombre', value: 'male' },
  { label: 'Mujer', value: 'female' },
] as const satisfies ReadonlyArray<{ label: string; value: Sex }>;

// ── User Profile ─────────────────────────────────────────────────────

export interface UserProfile extends BaseEntity {
  name: string;
  defaultRestTime: number; // seconds
  unitSystem: UnitSystem;
  weight: number; // kg or lbs depending on unitSystem
  height: number; // cm or in depending on unitSystem
  birthDate?: string; // YYYY-MM-DD
  sex?: Sex;
  restNotificationsEnabled?: boolean; // avisar al terminar el descanso (default true)
  restVibrationEnabled?: boolean; // vibrar al terminar el descanso (default true)
}

export interface OnboardingForm {
  name: string;
  unitSystem: UnitSystem;
  weight: number;
  height: number;
  birthDate?: string;
  sex?: Sex;
}
