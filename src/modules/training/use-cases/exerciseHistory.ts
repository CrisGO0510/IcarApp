import type { ExerciseSet, SetDayGroup, ExercisePerformance } from '../types/training.types';

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function groupSetsByDay(sets: ExerciseSet[]): SetDayGroup[] {
  const byDay = new Map<string, ExerciseSet[]>();
  for (const set of sets) {
    const key = dayKey(set.createdAt);
    const list = byDay.get(key);
    if (list) list.push(set);
    else byDay.set(key, [set]);
  }

  return [...byDay.values()]
    .map((daySets) => {
      const ordered = [...daySets].sort((a, b) => a.setNumber - b.setNumber);
      return {
        date: ordered[0]!.createdAt,
        sets: ordered,
        totalSets: ordered.length,
        totalReps: ordered.reduce((sum, set) => sum + (set.reps ?? 0), 0),
        totalVolume: ordered.reduce((sum, set) => sum + (set.weight ?? 0) * (set.reps ?? 0), 0),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function summarizePerformance(groups: SetDayGroup[]): ExercisePerformance {
  const latest = groups[0];
  if (!latest) {
    return { series: 0, reps: 0, volume: 0, seriesDelta: null, repsDelta: null, volumeDelta: null };
  }
  const previous = groups[1];
  return {
    series: latest.totalSets,
    reps: latest.totalReps,
    volume: latest.totalVolume,
    seriesDelta: previous ? latest.totalSets - previous.totalSets : null,
    repsDelta: previous ? latest.totalReps - previous.totalReps : null,
    volumeDelta: previous ? latest.totalVolume - previous.totalVolume : null,
  };
}
