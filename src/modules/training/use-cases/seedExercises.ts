import type { ExerciseRepository } from '../repositories/training.repository.port';

const DEFAULT_EXERCISES = [
  'Sentadilla con Barra',
  'Prensa de Pierna',
  'Peso Muerto',
  'Press de Banca',
  'Press Militar',
  'Dominadas',
  'Remo con Barra',
  'Curl de Bíceps',
  'Extensión de Tríceps',
  'Pantorrilla de Pie',
];

export function seedExercises(repository: ExerciseRepository) {
  return async (): Promise<void> => {
    const existing = await repository.findAll();
    if (existing.length > 0) return;

    for (const name of DEFAULT_EXERCISES) {
      await repository.create({ name });
    }
  };
}
