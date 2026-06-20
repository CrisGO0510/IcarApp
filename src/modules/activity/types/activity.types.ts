export const TIME_PERIODS = ['day', 'week', 'month', 'year'] as const;

export type TimePeriod = (typeof TIME_PERIODS)[number];

export interface MacroProgress {
  consumed: number;
  goal: number | null;
  remaining: number | null;
  percentage: number | null;
}

export interface DailyNutritionSummary {
  date: string;
  calories: MacroProgress;
  protein: MacroProgress;
  carbohydrates: MacroProgress;
  fat: MacroProgress;
  mealsCount: number;
}

export interface DailyTrainingSummary {
  date: string;
  hasTrained: boolean;
  sessionsCount: number;
  completedSets: number;
  totalVolume: number;
  durationMinutes: number;
}

export interface WorkoutExerciseSummary {
  name: string;
  sets: number;
}

export interface LastWorkout {
  routineName: string;
  performedAt: Date;
  durationMinutes: number;
  exercises: WorkoutExerciseSummary[];
}

export interface WeeklyStats {
  workoutFrequency: number;
  averageWeight: number | null;
}

export interface DashboardSummary {
  date: string;
  training: DailyTrainingSummary;
  nutrition: DailyNutritionSummary;
  lastWorkout: LastWorkout | null;
  weeklyStats: WeeklyStats;
}
