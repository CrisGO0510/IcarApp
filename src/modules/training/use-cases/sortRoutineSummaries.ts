import type { RoutineSortMode, RoutineSummary } from '../types/training.types';
import { ROUTINE_SORT_MODE } from '../types/training.types';

const NAME_LOCALE = 'es';

function byName(a: RoutineSummary, b: RoutineSummary): number {
  return a.routine.name.localeCompare(b.routine.name, NAME_LOCALE, { sensitivity: 'base' });
}

function byLastPerformed(a: RoutineSummary, b: RoutineSummary): number {
  if (a.lastPerformedAt && b.lastPerformedAt) {
    return b.lastPerformedAt.getTime() - a.lastPerformedAt.getTime();
  }
  if (a.lastPerformedAt) return -1;
  if (b.lastPerformedAt) return 1;
  return b.routine.createdAt.getTime() - a.routine.createdAt.getTime();
}

export function sortRoutineSummaries(
  summaries: RoutineSummary[],
  mode: RoutineSortMode,
): RoutineSummary[] {
  const comparator = mode === ROUTINE_SORT_MODE.ALPHABETICAL ? byName : byLastPerformed;
  return [...summaries].sort(comparator);
}
