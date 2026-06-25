import type { BaseEntity } from 'src/core/types/base.types';

// ── Body Weight Log ──────────────────────────────────────────────────

export interface BodyWeightLog extends BaseEntity {
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface WeightInput {
  date: string; // YYYY-MM-DD
  weightKg: number;
}
