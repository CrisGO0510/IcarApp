export function computeCalories(protein: number, carbohydrates: number, fat: number): number {
  return Math.round(4 * protein + 4 * carbohydrates + 9 * fat);
}
