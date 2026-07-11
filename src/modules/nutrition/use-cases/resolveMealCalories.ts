import { computeCalories } from './computeCalories';

export function resolveMealCalories(
  manual: number | null | undefined,
  protein: number,
  carbohydrates: number,
  fat: number,
): number {
  return manual ?? computeCalories(protein, carbohydrates, fat);
}
