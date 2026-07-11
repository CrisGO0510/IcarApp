import type { ExerciseSet, WorkoutSession } from 'src/modules/training/types/training.types';
import type {
  ActivityEntry,
  MacroGoal,
  MealEntry,
} from 'src/modules/nutrition/types/nutrition.types';
import type { DashboardSummary, LastWorkout, WeeklyStats } from '../types/activity.types';
import { buildTrainingSummary } from './buildTrainingSummary';
import { buildNutritionSummary } from './buildNutritionSummary';

export interface DashboardInput {
  sessions: WorkoutSession[];
  sets: ExerciseSet[];
  entries: MealEntry[];
  goal: MacroGoal | null;
  activities?: ActivityEntry[];
  lastWorkout: LastWorkout | null;
  weeklyStats: WeeklyStats;
}

export function buildDashboardSummary(date: string, input: DashboardInput): DashboardSummary {
  return {
    date,
    training: buildTrainingSummary(date, input.sessions, input.sets),
    nutrition: buildNutritionSummary(date, input.entries, input.goal, input.activities),
    lastWorkout: input.lastWorkout,
    weeklyStats: input.weeklyStats,
  };
}
