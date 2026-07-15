import type {
  ProgressInput,
  ProgressRange,
  ProgressSummary,
  VolumeFilters,
} from '../types/progress.types';
import { buildWeightProgression, summarizeWeight } from './bodyWeight';
import { buildTrainingVolume, computeAttendance, volumeOptions } from './trainingVolume';
import { buildWeeklyCalories } from './weeklyCalories';

export function buildProgressSummary(
  input: ProgressInput,
  range: ProgressRange,
  filters: VolumeFilters,
  now: Date,
): ProgressSummary {
  return {
    range,
    filters,
    metrics: {
      ...summarizeWeight(input.bodyWeightLog, range, now),
      totalAttendance: computeAttendance(input.sessionVolumes, range, now),
    },
    weightProgression: buildWeightProgression(input.bodyWeightLog, range, now),
    volume: buildTrainingVolume(input.sessionVolumes, range, filters, now),
    volumeOptions: volumeOptions(input.sessionVolumes),
    weeklyCalories: buildWeeklyCalories(
      input.consumedCalories,
      input.burnedCalories,
      input.calorieGoal,
      now,
    ),
  };
}
