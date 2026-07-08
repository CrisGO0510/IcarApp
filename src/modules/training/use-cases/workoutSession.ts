import type {
  WorkoutSessionRepository,
  ExerciseSetRepository,
  RoutineExerciseRepository,
} from '../repositories/training.repository.port';
import type { ExerciseSet, WorkoutSession } from '../types/training.types';

export interface SetInput {
  reps: number;
  weight: number;
}

const SET_NOT_FOUND_MESSAGE = 'No se encontró la serie a actualizar.';

function nextSetNumber(sets: ExerciseSet[], routineExerciseId: string): number {
  const numbers = sets
    .filter((set) => set.routineExerciseId === routineExerciseId)
    .map((set) => set.setNumber);
  return Math.max(0, ...numbers) + 1;
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

async function findSessionOnDay(
  sessionRepository: WorkoutSessionRepository,
  routineId: string,
  day: Date,
): Promise<WorkoutSession | null> {
  const sessions = await sessionRepository.findByRoutine(routineId);
  return sessions.find((session) => isSameDay(session.startedAt, day)) ?? null;
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
    const existing = await findSessionOnDay(sessionRepository, routineId, now);
    const session =
      existing ??
      (await sessionRepository.create({ routineId, startedAt: now, isCompleted: false }));

    const sessionSets = await setRepository.findBySession(session.id);
    const setNumber = nextSetNumber(sessionSets, routineExerciseId);

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
  performedAt: Date;
}

export function updateSet(
  sessionRepository: WorkoutSessionRepository,
  setRepository: ExerciseSetRepository,
  pivotRepository: RoutineExerciseRepository,
) {
  return async (id: string, input: SetEditInput): Promise<ExerciseSet> => {
    const current = await setRepository.findById(id);
    if (!current) {
      throw new Error(SET_NOT_FOUND_MESSAGE);
    }

    const changes: Partial<ExerciseSet> = {
      reps: input.reps,
      weight: input.weight,
      notes: input.notes?.trim() || null,
      createdAt: input.performedAt,
    };

    if (!isSameDay(current.createdAt, input.performedAt)) {
      const pivot = await pivotRepository.findById(current.routineExerciseId);
      if (!pivot) {
        throw new Error('No se encontró el ejercicio de la serie.');
      }
      const target =
        (await findSessionOnDay(sessionRepository, pivot.routineId, input.performedAt)) ??
        (await sessionRepository.create({
          routineId: pivot.routineId,
          startedAt: input.performedAt,
          isCompleted: false,
        }));
      const targetSets = await setRepository.findBySession(target.id);
      changes.workoutSessionId = target.id;
      changes.setNumber = nextSetNumber(targetSets, current.routineExerciseId);
    }

    const updated = await setRepository.update(id, changes);
    if (!updated) {
      throw new Error(SET_NOT_FOUND_MESSAGE);
    }

    if (updated.workoutSessionId !== current.workoutSessionId) {
      const remaining = await setRepository.findBySession(current.workoutSessionId);
      if (remaining.length === 0) {
        await sessionRepository.delete(current.workoutSessionId);
      }
    }

    return updated;
  };
}

export function deleteSet(
  sessionRepository: WorkoutSessionRepository,
  setRepository: ExerciseSetRepository,
) {
  return async (id: string): Promise<void> => {
    const current = await setRepository.findById(id);
    if (!current) return;

    await setRepository.delete(id);

    const remaining = await setRepository.findBySession(current.workoutSessionId);
    if (remaining.length === 0) {
      await sessionRepository.delete(current.workoutSessionId);
    }
  };
}
