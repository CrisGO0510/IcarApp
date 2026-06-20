import type { BodyWeightEntry, ProgressInput, SessionVolume } from '../types/progress.types';

const now = new Date();

function daysAgo(amount: number): Date {
  const date = new Date(now);
  date.setDate(date.getDate() - amount);
  date.setHours(8, 0, 0, 0);
  return date;
}

const bodyWeightLog: BodyWeightEntry[] = Array.from({ length: 35 }, (_, index) => {
  const wave = Math.sin(index / 4) * 0.3;
  const weight = Math.round((83 - index * 0.035 + wave) * 10) / 10;
  return { date: daysAgo(34 - index), weight };
});

const ROUTINES = [
  { name: 'Push A', types: ['Pecho', 'Hombros'] },
  { name: 'Pull B', types: ['Espalda', 'Bíceps'] },
  { name: 'Pierna', types: ['Cuádriceps', 'Femoral'] },
] as const;

const sessionVolumes: SessionVolume[] = [];
let sessionCounter = 0;
for (let week = 0; week < 5; week++) {
  for (let session = 0; session < 3; session++) {
    const routine = ROUTINES[(week + session) % ROUTINES.length]!;
    const date = daysAgo((4 - week) * 7 + session * 2);
    const sessionId = `mock-session-${sessionCounter++}`;
    routine.types.forEach((type, typeIndex) => {
      sessionVolumes.push({
        sessionId,
        date,
        routine: routine.name,
        type,
        sets: 3 + ((week + session + typeIndex) % 2),
        weight: 120 + typeIndex * 30 + week * 10,
      });
    });
  }
}

export const progressMockInput: ProgressInput = {
  bodyWeightLog,
  sessionVolumes,
};
