import type { Exercise, WeightUnit } from '../types/training.types';
import type { UnitSystem } from 'src/modules/profile/types/profile.types';

const METRIC_UNIT: WeightUnit = 'kg';
const IMPERIAL_UNIT: WeightUnit = 'lb';

export function resolveWeightUnit(
  exercise: Pick<Exercise, 'weightUnit'> | null | undefined,
  unitSystem: UnitSystem | undefined,
): WeightUnit {
  if (exercise?.weightUnit) return exercise.weightUnit;
  return unitSystem === 'imperial' ? IMPERIAL_UNIT : METRIC_UNIT;
}
