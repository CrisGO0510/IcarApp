// Activity module — minimal for MVP.
// Dashboard summaries are computed from training + nutrition stores,
// not persisted as separate entities.

export const TIME_PERIODS = ['day', 'week', 'month', 'year'] as const;

export type TimePeriod = (typeof TIME_PERIODS)[number];
