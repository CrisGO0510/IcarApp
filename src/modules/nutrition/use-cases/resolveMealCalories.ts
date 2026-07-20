import { computeCalories } from './computeCalories';

export function resolveMealCalories(
  manual: number | null | undefined,
  protein: number,
  carbohydrates: number,
  fat: number,
): number {
  if (manual !== null && manual !== undefined) {
    return Math.round(manual);
  }
  return computeCalories(protein, carbohydrates, fat);
}
