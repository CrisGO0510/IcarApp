import type { BaseEntity } from 'src/core/types/base.types';

// ── Routine ──────────────────────────────────────────────────────────

export interface Routine extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

// ── Exercise ─────────────────────────────────────────────────────────

export interface Exercise extends BaseEntity {
  name: string;
  description?: string;
  muscleGroups: string[];
  equipmentNeeded: string[];
  instructions: string[];
}

// ── Routine ↔ Exercise (pivot) ───────────────────────────────────────

export interface RoutineExercise extends BaseEntity {
  routineId: string;
  exerciseId: string;
  orderIndex: number;
  targetSets?: number;
  targetReps?: string;
  targetWeight?: number;
  restTime?: number; // seconds
  notes?: string;
}

// ── Workout Session ──────────────────────────────────────────────────

export interface WorkoutSession extends BaseEntity {
  routineId: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // minutes
  notes?: string;
  isCompleted: boolean;
}

// ── Exercise Set ─────────────────────────────────────────────────────

export interface ExerciseSet extends BaseEntity {
  workoutSessionId: string;
  routineExerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number; // kg
  duration?: number; // seconds (timed exercises)
  distance?: number; // meters (cardio)
  restTime?: number; // seconds
  rpe?: number; // 1-10
  notes?: string;
  isCompleted: boolean;
}
