import type {
  WorkoutSessionRepository,
  ExerciseSetRepository,
} from '../repositories/training.repository.port';
import type { ExerciseSet, WorkoutSession } from '../types/training.types';

export interface SetInput {
  reps: number;
  weight: number;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function lastSetByExercise(sets: ExerciseSet[]): Record<string, ExerciseSet> {
  const latest: Record<string, ExerciseSet> = {};
  for (const set of sets) {
    const current = latest[set.routineExerciseId];
    if (!current || set.createdAt.getTime() > current.createdAt.getTime()) {
      latest[set.routineExerciseId] = set;
    }
  }
  return latest;
}

async function findTodaySession(
  sessionRepository: WorkoutSessionRepository,
  routineId: string,
  now: Date,
): Promise<WorkoutSession | null> {
  const sessions = await sessionRepository.findByRoutine(routineId);
  return sessions.find((session) => isSameDay(session.startedAt, now)) ?? null;
}

export function logSet(
  sessionRepository: WorkoutSessionRepository,
  setRepository: ExerciseSetRepository,
) {
  return async (
    routineId: string,
    routineExerciseId: string,
    input: SetInput,
    now: Date,
  ): Promise<ExerciseSet> => {
    const existing = await findTodaySession(sessionRepository, routineId, now);
    const session =
      existing ??
      (await sessionRepository.create({ routineId, startedAt: now, isCompleted: false }));

    const sessionSets = await setRepository.findBySession(session.id);
    const setNumber =
      sessionSets.filter((set) => set.routineExerciseId === routineExerciseId).length + 1;

    return setRepository.create({
      workoutSessionId: session.id,
      routineExerciseId,
      setNumber,
      reps: input.reps,
      weight: input.weight,
      isCompleted: true,
    });
  };
}

export function getLastSet(setRepository: ExerciseSetRepository) {
  return async (routineExerciseId: string): Promise<ExerciseSet | null> => {
    const sets = await setRepository.findByExercise(routineExerciseId);
    if (sets.length === 0) return null;
    return sets.reduce((latest, set) =>
      set.createdAt.getTime() > latest.createdAt.getTime() ? set : latest,
    );
  };
}

export function getLastSets(setRepository: ExerciseSetRepository) {
  return async (): Promise<Record<string, ExerciseSet>> => {
    return lastSetByExercise(await setRepository.findAll());
  };
}

export interface SetEditInput {
  reps: number;
  weight: number;
  notes?: string;
}

export function updateSet(setRepository: ExerciseSetRepository) {
  return async (id: string, input: SetEditInput): Promise<ExerciseSet> => {
    const updated = await setRepository.update(id, {
      reps: input.reps,
      weight: input.weight,
      ...(input.notes ? { notes: input.notes } : {}),
    });
    if (!updated) {
      throw new Error('No se encontró la serie a actualizar.');
    }
    return updated;
  };
}

export function deleteSet(setRepository: ExerciseSetRepository) {
  return async (id: string): Promise<void> => {
    await setRepository.delete(id);
  };
}
