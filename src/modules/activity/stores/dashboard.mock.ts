import type { DashboardInput } from '../use-cases/buildDashboardSummary';
import { makeEntry, makeGoal, makeSession, makeSet } from '../use-cases/fixtures';

const lastWorkoutDate = new Date();
lastWorkoutDate.setHours(8, 30, 0, 0);

export const dashboardMockInput: DashboardInput = {
  sessions: [makeSession({ duration: 65 })],
  sets: [
    makeSet({ reps: 10, weight: 80, isCompleted: true }),
    makeSet({ reps: 8, weight: 85, isCompleted: true }),
    makeSet({ reps: 8, weight: 85, isCompleted: true }),
  ],
  entries: [
    makeEntry({ mealId: 'breakfast', calories: 520, protein: 40, carbohydrates: 60, fat: 12 }),
    makeEntry({ mealId: 'lunch', calories: 740, protein: 55, carbohydrates: 90, fat: 18 }),
    makeEntry({ mealId: 'dinner', calories: 580, protein: 47, carbohydrates: 60, fat: 15 }),
  ],
  goal: makeGoal({ calorieGoal: 2200, proteinGoal: 180, carbohydrateGoal: 320, fatGoal: 75 }),
  lastWorkout: {
    routineName: 'Push A: Pecho & Hombros',
    performedAt: lastWorkoutDate,
    durationMinutes: 65,
    exercises: [
      { name: 'Press de Banca Inclinado', sets: 4 },
      { name: 'Press Militar con Mancuernas', sets: 3 },
      { name: 'Aperturas en Polea', sets: 3 },
    ],
  },
  weeklyStats: {
    workoutFrequency: 4,
    averageWeight: 84.5,
  },
};
