import type {
  RoutineRepository,
  RoutineExerciseRepository,
  ExerciseRepository,
  WorkoutSessionRepository,
  ExerciseSetRepository,
} from 'src/modules/training/repositories/training.repository.port';
import type {
  MealEntryRepository,
  MacroGoalRepository,
} from 'src/modules/nutrition/repositories/nutrition.repository.port';
import type { BodyWeightLogRepository } from 'src/modules/measurements/repositories/measurements.repository.port';
import type {
  Exercise,
  ExerciseSet,
  Routine,
  RoutineExercise,
  WorkoutSession,
} from 'src/modules/training/types/training.types';
import type { BodyWeightLog } from 'src/modules/measurements/types/measurements.types';
import type { LastWorkout, WeeklyStats, WorkoutExerciseSummary } from '../types/activity.types';
import type { DashboardSummary } from '../types/activity.types';
import { sessionDuration } from 'src/modules/training/use-cases/routineSessionMeta';
import { buildDashboardSummary } from './buildDashboardSummary';

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildLastWorkout(
  sessions: WorkoutSession[],
  sets: ExerciseSet[],
  routines: Routine[],
  pivots: RoutineExercise[],
  exercises: Exercise[],
): LastWorkout | null {
  if (sessions.length === 0) return null;

  const last = sessions.reduce((a, b) =>
    a.startedAt.getTime() >= b.startedAt.getTime() ? a : b,
  );
  const routine = routines.find((item) => item.id === last.routineId);
  const sessionSets = sets.filter((set) => set.workoutSessionId === last.id);

  const setsByPivot = new Map<string, number>();
  for (const set of sessionSets) {
    setsByPivot.set(set.routineExerciseId, (setsByPivot.get(set.routineExerciseId) ?? 0) + 1);
  }

  const exerciseSummaries: WorkoutExerciseSummary[] = [];
  for (const [pivotId, count] of setsByPivot) {
    const pivot = pivots.find((item) => item.id === pivotId);
    const exercise = pivot ? exercises.find((item) => item.id === pivot.exerciseId) : undefined;
    exerciseSummaries.push({ name: exercise?.name ?? 'Ejercicio', sets: count });
  }

  return {
    routineName: routine?.name ?? 'Entrenamiento',
    performedAt: last.completedAt ?? last.startedAt,
    durationMinutes: sessionDuration(last, sets) ?? 0,
    exercises: exerciseSummaries,
  };
}

export function buildWeeklyStats(
  sessions: WorkoutSession[],
  weights: BodyWeightLog[],
  now: Date,
): WeeklyStats {
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);
  const weekAgoKey = dateKey(weekAgo);

  const recentDays = new Set(
    sessions
      .filter((session) => session.startedAt.getTime() >= weekAgo.getTime())
      .map((session) => dateKey(session.startedAt)),
  );

  const recentWeights = weights.filter((weight) => weight.date >= weekAgoKey);
  const averageWeight = recentWeights.length
    ? Math.round(
        (recentWeights.reduce((acc, weight) => acc + weight.weightKg, 0) / recentWeights.length) *
          10,
      ) / 10
    : null;

  return { workoutFrequency: recentDays.size, averageWeight };
}

export interface DashboardRepositories {
  routineRepo: RoutineRepository;
  pivotRepo: RoutineExerciseRepository;
  exerciseRepo: ExerciseRepository;
  sessionRepo: WorkoutSessionRepository;
  setRepo: ExerciseSetRepository;
  mealEntryRepo: MealEntryRepository;
  macroGoalRepo: MacroGoalRepository;
  bodyWeightRepo: BodyWeightLogRepository;
}

export function getDashboardSummary(repos: DashboardRepositories) {
  return async (now: Date = new Date()): Promise<DashboardSummary> => {
    const dateStr = dateKey(now);
    const [sessions, allSets, entries, goal, routines, pivots, exercises, weights] =
      await Promise.all([
        repos.sessionRepo.findAll(),
        repos.setRepo.findAll(),
        repos.mealEntryRepo.findByDate(dateStr),
        repos.macroGoalRepo.findActive(),
        repos.routineRepo.findAll(),
        repos.pivotRepo.findAll(),
        repos.exerciseRepo.findAll(),
        repos.bodyWeightRepo.findAll(),
      ]);

    const todaySessions = sessions.filter((session) => isSameDay(session.startedAt, now));
    const todayIds = new Set(todaySessions.map((session) => session.id));
    const todaySets = allSets.filter((set) => todayIds.has(set.workoutSessionId));

    return buildDashboardSummary(dateStr, {
      sessions: todaySessions,
      sets: todaySets,
      entries: entries.map((entry) => ({ ...entry, mealId: entry.id })),
      goal,
      lastWorkout: buildLastWorkout(sessions, allSets, routines, pivots, exercises),
      weeklyStats: buildWeeklyStats(sessions, weights, now),
    });
  };
}
