import type { BodyWeightEntry, SessionVolume } from '../types/progress.types';

export function makeWeight(overrides: Partial<BodyWeightEntry> = {}): BodyWeightEntry {
  return {
    date: new Date('2026-06-20T08:00:00'),
    weight: 80,
    ...overrides,
  };
}

export function makeVolume(overrides: Partial<SessionVolume> = {}): SessionVolume {
  return {
    sessionId: 'session-1',
    date: new Date('2026-06-20T08:00:00'),
    routine: 'Push A',
    type: 'Pecho',
    sets: 3,
    weight: 300,
    ...overrides,
  };
}
