import type { ExerciseSet, WorkoutSession } from '../types/training.types';

export interface RoutineSessionMeta {
  lastPerformedAt: Date | null;
  durationMinutes: number | null;
  inProgress: boolean;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function sessionDuration(session: WorkoutSession, sets: ExerciseSet[]): number | null {
  if (session.duration != null) return session.duration;
  const stamps = sets
    .filter((set) => set.workoutSessionId === session.id)
    .map((set) => set.createdAt.getTime());
  if (stamps.length < 2) return null;
  const span = Math.max(...stamps) - Math.min(...stamps);
  return Math.max(1, Math.round(span / 60000));
}

export function buildRoutineSessionMeta(
  routineId: string,
  sessions: WorkoutSession[],
  sets: ExerciseSet[],
  now: Date,
): RoutineSessionMeta {
  const routineSessions = sessions.filter((session) => session.routineId === routineId);
  if (routineSessions.length === 0) {
    return { lastPerformedAt: null, durationMinutes: null, inProgress: false };
  }

  const last = routineSessions.reduce((a, b) =>
    a.startedAt.getTime() >= b.startedAt.getTime() ? a : b,
  );

  return {
    lastPerformedAt: last.completedAt ?? last.startedAt,
    durationMinutes: sessionDuration(last, sets),
    inProgress: isSameDay(last.startedAt, now) && !last.isCompleted,
  };
}
