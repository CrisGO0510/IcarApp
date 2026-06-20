import {
  ALL_FILTER,
  type ProgressRange,
  type SessionVolume,
  type VolumeFilters,
  type VolumeOptions,
  type VolumePoint,
} from '../types/progress.types';
import { inRange, weekIndex } from './range';

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function volumeOptions(volumes: SessionVolume[]): VolumeOptions {
  return {
    routines: [ALL_FILTER, ...unique(volumes.map((v) => v.routine))],
    types: [ALL_FILTER, ...unique(volumes.map((v) => v.type))],
  };
}

export function computeAttendance(
  volumes: SessionVolume[],
  range: ProgressRange,
  now: Date,
): number {
  const sessions = new Set(
    volumes.filter((v) => inRange(v.date, range, now)).map((v) => v.sessionId),
  );
  return sessions.size;
}

export function buildTrainingVolume(
  volumes: SessionVolume[],
  range: ProgressRange,
  filters: VolumeFilters,
  now: Date,
): VolumePoint[] {
  const filtered = volumes.filter(
    (v) =>
      inRange(v.date, range, now) &&
      (filters.routine === ALL_FILTER || v.routine === filters.routine) &&
      (filters.type === ALL_FILTER || v.type === filters.type),
  );

  const buckets = new Map<number, { sets: number; weight: number }>();
  for (const v of filtered) {
    const key = weekIndex(v.date, now);
    const bucket = buckets.get(key) ?? { sets: 0, weight: 0 };
    bucket.sets += v.sets;
    bucket.weight += v.weight;
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, bucket], index) => ({
      label: `Sem ${index + 1}`,
      sets: bucket.sets,
      weight: bucket.weight,
    }));
}
