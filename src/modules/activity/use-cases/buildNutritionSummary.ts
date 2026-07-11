import type {
  ActivityEntry,
  MacroGoal,
  MealEntry,
} from 'src/modules/nutrition/types/nutrition.types';
import type { DailyNutritionSummary, MacroProgress } from '../types/activity.types';

export function buildMacroProgress(consumed: number, goal: number | null): MacroProgress {
  if (goal === null) {
    return { consumed, goal: null, remaining: null, percentage: null };
  }
  return {
    consumed,
    goal,
    remaining: goal - consumed,
    percentage: goal > 0 ? Math.round((consumed / goal) * 100) : null,
  };
}

export function buildNutritionSummary(
  date: string,
  entries: MealEntry[],
  goal: MacroGoal | null,
  activities: ActivityEntry[] = [],
): DailyNutritionSummary {
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
    calories: {
      ...buildMacroProgress(totals.calories, goal?.calorieGoal ?? null),
      remaining: goal === null ? null : goal.calorieGoal + burned - totals.calories,
    },
    protein: buildMacroProgress(totals.protein, goal?.proteinGoal ?? null),
    carbohydrates: buildMacroProgress(totals.carbohydrates, goal?.carbohydrateGoal ?? null),
    fat: buildMacroProgress(totals.fat, goal?.fatGoal ?? null),
    mealsCount: new Set(entries.map((entry) => entry.mealId)).size,
    burned,
  };
}
