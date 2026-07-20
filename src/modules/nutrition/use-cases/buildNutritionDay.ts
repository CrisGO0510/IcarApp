import type { ActivityEntry, MacroGoal, MealEntry, NutritionDay } from '../types/nutrition.types';
import { round1 } from './scaleMealFromReference';

export function buildNutritionDay(
  date: string,
  entries: MealEntry[],
  goal: MacroGoal | null,
  activities: ActivityEntry[] = [],
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
  const burned = activities.reduce((acc, activity) => acc + activity.caloriesBurned, 0);

  return {
    date,
    calories: { consumed: Math.round(totals.calories), goal: goal?.calorieGoal ?? null },
    protein: { consumed: round1(totals.protein), goal: goal?.proteinGoal ?? null },
    carbohydrates: { consumed: round1(totals.carbohydrates), goal: goal?.carbohydrateGoal ?? null },
    fat: { consumed: round1(totals.fat), goal: goal?.fatGoal ?? null },
    entries,
    burned: Math.round(burned),
    remaining: goal ? Math.round(goal.calorieGoal + burned - totals.calories) : null,
    activities,
  };
}
