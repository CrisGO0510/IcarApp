import type {
  RoutineRepository,
  RoutineExerciseRepository,
  ExerciseRepository,
  WorkoutSessionRepository,
  ExerciseSetRepository,
} from 'src/modules/training/repositories/training.repository.port';
import type { BodyWeightLogRepository } from 'src/modules/measurements/repositories/measurements.repository.port';
import type {
  ActivityEntryRepository,
  MacroGoalRepository,
  MealEntryRepository,
} from 'src/modules/nutrition/repositories/nutrition.repository.port';
import type {
  Exercise,
  ExerciseSet,
  Routine,
  RoutineExercise,
  WorkoutSession,
} from 'src/modules/training/types/training.types';
import type { BodyWeightLog } from 'src/modules/measurements/types/measurements.types';
import type { BodyWeightEntry, ProgressInput, SessionVolume } from '../types/progress.types';

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function toBodyWeightLog(weights: BodyWeightLog[]): BodyWeightEntry[] {
  return weights.map((weight) => ({ date: parseLocalDate(weight.date), weight: weight.weightKg }));
}

export function buildSessionVolumes(
  sessions: WorkoutSession[],
  sets: ExerciseSet[],
  routines: Routine[],
  pivots: RoutineExercise[],
  exercises: Exercise[],
): SessionVolume[] {
  const routineName = new Map(routines.map((routine) => [routine.id, routine.name]));
  const pivotExercise = new Map(pivots.map((pivot) => [pivot.id, pivot.exerciseId]));
  const exerciseName = new Map(exercises.map((exercise) => [exercise.id, exercise.name]));

  const volumes: SessionVolume[] = [];
  for (const session of sessions) {
    const byPivot = new Map<string, { sets: number; volume: number }>();
    for (const set of sets) {
      if (set.workoutSessionId !== session.id) continue;
      const agg = byPivot.get(set.routineExerciseId) ?? { sets: 0, volume: 0 };
      agg.sets += 1;
      agg.volume += (set.reps ?? 0) * (set.weight ?? 0);
      byPivot.set(set.routineExerciseId, agg);
    }

    for (const [pivotId, agg] of byPivot) {
      const exerciseId = pivotExercise.get(pivotId);
      volumes.push({
        sessionId: session.id,
        date: session.startedAt,
        routine: routineName.get(session.routineId) ?? 'Rutina',
        type: (exerciseId ? exerciseName.get(exerciseId) : undefined) ?? 'Ejercicio',
        sets: agg.sets,
        weight: agg.volume,
      });
    }
  }
  return volumes;
}

export interface ProgressRepositories {
  routineRepo: RoutineRepository;
  pivotRepo: RoutineExerciseRepository;
  exerciseRepo: ExerciseRepository;
  sessionRepo: WorkoutSessionRepository;
  setRepo: ExerciseSetRepository;
  bodyWeightRepo: BodyWeightLogRepository;
  mealEntryRepo: MealEntryRepository;
  activityRepo: ActivityEntryRepository;
  macroGoalRepo: MacroGoalRepository;
}

export function getProgressInput(repos: ProgressRepositories) {
  return async (): Promise<ProgressInput> => {
    const [sessions, sets, routines, pivots, exercises, weights, mealEntries, activities, goal] =
      await Promise.all([
        repos.sessionRepo.findAll(),
        repos.setRepo.findAll(),
        repos.routineRepo.findAll(),
        repos.pivotRepo.findAll(),
        repos.exerciseRepo.findAll(),
        repos.bodyWeightRepo.findAll(),
        repos.mealEntryRepo.findAll(),
        repos.activityRepo.findAll(),
        repos.macroGoalRepo.findActive(),
      ]);

    return {
      bodyWeightLog: toBodyWeightLog(weights),
      sessionVolumes: buildSessionVolumes(sessions, sets, routines, pivots, exercises),
      consumedCalories: mealEntries.map((entry) => ({
        date: entry.date,
        calories: entry.calories,
      })),
      burnedCalories: activities.map((activity) => ({
        date: activity.date,
        calories: activity.caloriesBurned,
      })),
      calorieGoal: goal?.calorieGoal ?? null,
    };
  };
}
