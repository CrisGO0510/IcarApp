import type { ExerciseSet, WorkoutSession } from 'src/modules/training/types/training.types';
import type { MacroGoal, MealEntry } from 'src/modules/nutrition/types/nutrition.types';

export function makeSession(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: 'session',
    createdAt: new Date(),
    updatedAt: new Date(),
    routineId: 'routine',
    startedAt: new Date(),
    isCompleted: true,
    ...overrides,
  };
}

export function makeSet(overrides: Partial<ExerciseSet> = {}): ExerciseSet {
  return {
    id: 'set',
    createdAt: new Date(),
    updatedAt: new Date(),
    workoutSessionId: 'session',
    routineExerciseId: 'routine-exercise',
    setNumber: 1,
    isCompleted: true,
    ...overrides,
  };
}

export function makeEntry(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    id: 'entry',
    createdAt: new Date(),
    updatedAt: new Date(),
    mealId: 'meal',
    foodName: 'Food',
    quantity: 1,
    unit: 'g',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    ...overrides,
  };
}

export function makeGoal(overrides: Partial<MacroGoal> = {}): MacroGoal {
  return {
    id: 'goal',
    createdAt: new Date(),
    updatedAt: new Date(),
    date: '2026-06-15',
    calorieGoal: 2000,
    proteinGoal: 150,
    carbohydrateGoal: 200,
    fatGoal: 60,
    isActive: true,
    ...overrides,
  };
}
