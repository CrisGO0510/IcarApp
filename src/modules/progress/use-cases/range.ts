import type { ProgressRange } from '../types/progress.types';

const DAY_MS = 24 * 60 * 60 * 1000;

const RANGE_DAYS: Record<Exclude<ProgressRange, 'Siempre'>, number> = {
  '1S': 7,
  '1M': 30,
  '1A': 365,
};

export function rangeStart(range: ProgressRange, now: Date): Date | null {
  if (range === 'Siempre') return null;
  return new Date(now.getTime() - RANGE_DAYS[range] * DAY_MS);
}

export function inRange(date: Date, range: ProgressRange, now: Date): boolean {
  if (date.getTime() > now.getTime()) return false;
  const start = rangeStart(range, now);
  return start === null || date.getTime() >= start.getTime();
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function weekIndex(date: Date, now: Date): number {
  const diff = startOfDay(now).getTime() - startOfDay(date).getTime();
  return Math.floor(diff / (7 * DAY_MS));
}
