import type {
  BodyWeightEntry,
  ProgressRange,
  WeightProgression,
} from '../types/progress.types';
import { inRange } from './range';
import { dayMonthLabel, weekdayLabel } from './labels';

const SUBTITLES: Record<ProgressRange, string> = {
  '1S': 'Últimos 7 días',
  '1M': 'Últimos 30 días',
  '1A': 'Último año',
  Siempre: 'Histórico completo',
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function entriesInRange(
  log: BodyWeightEntry[],
  range: ProgressRange,
  now: Date,
): BodyWeightEntry[] {
  return log
    .filter((entry) => inRange(entry.date, range, now))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function buildWeightProgression(
  log: BodyWeightEntry[],
  range: ProgressRange,
  now: Date,
): WeightProgression {
  const useWeekday = range === '1S';
  const points = entriesInRange(log, range, now).map((entry) => ({
    label: useWeekday ? weekdayLabel(entry.date) : dayMonthLabel(entry.date),
    value: entry.weight,
  }));
  return { subtitle: SUBTITLES[range], points };
}

export function summarizeWeight(
  log: BodyWeightEntry[],
  range: ProgressRange,
  now: Date,
): { currentWeight: number | null; weightDelta: number | null } {
  const entries = entriesInRange(log, range, now);
  if (entries.length === 0) return { currentWeight: null, weightDelta: null };

  const currentWeight = entries[entries.length - 1]!.weight;
  const weightDelta = entries.length > 1 ? round1(currentWeight - entries[0]!.weight) : null;
  return { currentWeight, weightDelta };
}
