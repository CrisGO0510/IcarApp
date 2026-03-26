import type { Repository } from 'src/core/types/base.types';
import type {
  Routine,
  Exercise,
  RoutineExercise,
  WorkoutSession,
  ExerciseSet,
} from '../types/training.types';

// ── Routine Port ─────────────────────────────────────────────────────

export interface RoutineRepository extends Repository<Routine> {
  findActive(): Promise<Routine[]>;
}

// ── Exercise Port ────────────────────────────────────────────────────

export interface ExerciseRepository extends Repository<Exercise> {
  searchByName(query: string): Promise<Exercise[]>;
}

// ── RoutineExercise Port ─────────────────────────────────────────────

export interface RoutineExerciseRepository extends Repository<RoutineExercise> {
  findByRoutine(routineId: string): Promise<RoutineExercise[]>;
  reorder(routineId: string, orderedIds: string[]): Promise<void>;
}

// ── WorkoutSession Port ──────────────────────────────────────────────

export interface WorkoutSessionRepository extends Repository<WorkoutSession> {
  findByRoutine(routineId: string): Promise<WorkoutSession[]>;
  findByDateRange(from: Date, to: Date): Promise<WorkoutSession[]>;
}

// ── ExerciseSet Port ─────────────────────────────────────────────────

export interface ExerciseSetRepository extends Repository<ExerciseSet> {
  findBySession(workoutSessionId: string): Promise<ExerciseSet[]>;
  findByExercise(routineExerciseId: string): Promise<ExerciseSet[]>;
}
