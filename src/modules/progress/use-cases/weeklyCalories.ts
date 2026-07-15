import { dateKey } from 'src/core/utils/dateKey';
import type { CalorieDay, DatedCalories, WeeklyCalories } from '../types/progress.types';

export const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

export const DAYS_PER_WEEK = WEEKDAY_LETTERS.length;

function sumByDate(entries: DatedCalories[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    totals.set(entry.date, (totals.get(entry.date) ?? 0) + entry.calories);
  }
  return totals;
}

export function weekStart(now: Date): Date {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const mondayOffset = (start.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  start.setDate(start.getDate() - mondayOffset);
  return start;
}

export function buildWeeklyCalories(
  consumed: DatedCalories[],
  burned: DatedCalories[],
  goal: number | null,
  now: Date,
): WeeklyCalories {
  const consumedByDate = sumByDate(consumed);
  const burnedByDate = sumByDate(burned);
  const start = weekStart(now);

  const days: CalorieDay[] = WEEKDAY_LETTERS.map((label, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = dateKey(date);
    return {
      date: key,
      label,
      consumed: consumedByDate.get(key) ?? 0,
      burned: burnedByDate.get(key) ?? 0,
    };
  });

  return { goal, days };
}
