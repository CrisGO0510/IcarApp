export const PROGRESS_RANGES = ['1S', '1M', '1A', 'Siempre'] as const;

export type ProgressRange = (typeof PROGRESS_RANGES)[number];

export const ALL_FILTER = 'Todas';

export interface BodyWeightEntry {
  date: Date;
  weight: number;
}

export interface SessionVolume {
  sessionId: string;
  date: Date;
  routine: string;
  type: string;
  sets: number;
  weight: number;
}

export interface ProgressInput {
  bodyWeightLog: BodyWeightEntry[];
  sessionVolumes: SessionVolume[];
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface WeightProgression {
  subtitle: string;
  points: TimeSeriesPoint[];
}

export interface VolumePoint {
  label: string;
  sets: number;
  weight: number;
}

export interface VolumeFilters {
  routine: string;
  type: string;
}

export interface VolumeOptions {
  routines: string[];
  types: string[];
}

export interface ProgressMetrics {
  currentWeight: number | null;
  weightDelta: number | null;
  totalAttendance: number;
}

export interface ProgressSummary {
  range: ProgressRange;
  filters: VolumeFilters;
  metrics: ProgressMetrics;
  weightProgression: WeightProgression;
  volume: VolumePoint[];
  volumeOptions: VolumeOptions;
}
