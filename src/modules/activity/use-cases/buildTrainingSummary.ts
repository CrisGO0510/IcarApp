import type { ExerciseSet, WorkoutSession } from 'src/modules/training/types/training.types';
import type { DailyTrainingSummary } from '../types/activity.types';

export function buildTrainingSummary(
  date: string,
  sessions: WorkoutSession[],
  sets: ExerciseSet[],
): DailyTrainingSummary {
  const completed = sets.filter((set) => set.isCompleted);
  const totalVolume = completed.reduce(
    (acc, set) => acc + (set.reps ?? 0) * (set.weight ?? 0),
    0,
  );
  const durationMinutes = sessions.reduce((acc, session) => acc + (session.duration ?? 0), 0);

  return {
    date,
    hasTrained: sessions.length > 0,
    sessionsCount: sessions.length,
    completedSets: completed.length,
    totalVolume,
    durationMinutes,
  };
}
