import type { Sex, UnitSystem } from '../types/profile.types';

const LBS_TO_KG = 0.453592;
const IN_TO_CM = 2.54;
const MALE_OFFSET = 5;
const FEMALE_OFFSET = -161;
const WEIGHT_COEFFICIENT = 10;
const HEIGHT_COEFFICIENT = 6.25;
const AGE_COEFFICIENT = 5;

export const TRAINING_FREQUENCIES = [
  { key: 'none', label: 'No entreno', factor: 1.2 },
  { key: 'light', label: '1–3 días / semana', factor: 1.375 },
  { key: 'moderate', label: '4–5 días / semana', factor: 1.55 },
  { key: 'high', label: '6–7 días / semana', factor: 1.725 },
] as const;

export type TrainingFrequencyKey = (typeof TRAINING_FREQUENCIES)[number]['key'];

export interface TmbInput {
  weight: number;
  height: number;
  unitSystem: UnitSystem;
  age: number;
  sex: Sex;
}

export interface MaintenanceEstimate {
  tmb: number;
  factor: number;
  calories: number;
}

export function computeTmb(input: TmbInput): number {
  const weightKg = input.unitSystem === 'imperial' ? input.weight * LBS_TO_KG : input.weight;
  const heightCm = input.unitSystem === 'imperial' ? input.height * IN_TO_CM : input.height;
  const offset = input.sex === 'male' ? MALE_OFFSET : FEMALE_OFFSET;

  return Math.round(
    WEIGHT_COEFFICIENT * weightKg +
      HEIGHT_COEFFICIENT * heightCm -
      AGE_COEFFICIENT * input.age +
      offset,
  );
}

export function computeMaintenanceEstimate(
  input: TmbInput,
  trainingFrequency: TrainingFrequencyKey,
): MaintenanceEstimate {
  const level =
    TRAINING_FREQUENCIES.find((item) => item.key === trainingFrequency) ?? TRAINING_FREQUENCIES[0];
  const tmb = computeTmb(input);

  return { tmb, factor: level.factor, calories: Math.round(tmb * level.factor) };
}
