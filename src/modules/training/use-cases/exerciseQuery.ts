import type { Exercise } from '../types/training.types';

export const EXERCISE_SORTS = ['alpha', 'recent'] as const;

export type ExerciseSort = (typeof EXERCISE_SORTS)[number];

export function filterExercises(exercises: Exercise[], query: string): Exercise[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return exercises;
  return exercises.filter((exercise) => exercise.name.toLowerCase().includes(normalized));
}

export function sortExercises(exercises: Exercise[], sort: ExerciseSort): Exercise[] {
  const copy = [...exercises];
  if (sort === 'alpha') {
    return copy.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }
  return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
