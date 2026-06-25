import type { MacroGoal, MealEntry, NutritionDay } from '../types/nutrition.types';

export function buildNutritionDay(
  date: string,
  entries: MealEntry[],
  goal: MacroGoal | null,
): NutritionDay {
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbohydrates: acc.carbohydrates + entry.carbohydrates,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 },
  );

  return {
    date,
    calories: { consumed: totals.calories, goal: goal?.calorieGoal ?? null },
    protein: { consumed: totals.protein, goal: goal?.proteinGoal ?? null },
    carbohydrates: { consumed: totals.carbohydrates, goal: goal?.carbohydrateGoal ?? null },
    fat: { consumed: totals.fat, goal: goal?.fatGoal ?? null },
    entries,
  };
}
