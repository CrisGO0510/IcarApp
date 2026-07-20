import type { ActivityEntryRepository } from '../repositories/nutrition.repository.port';
import type { ActivityEntry, ActivityInput } from '../types/nutrition.types';

const EMPTY_TYPE_MESSAGE = 'El tipo de actividad es obligatorio.';
const INVALID_CALORIES_MESSAGE = 'Las calorías quemadas deben ser mayores a cero.';
const INVALID_DURATION_MESSAGE = 'La duración debe ser mayor a cero.';
const NOT_FOUND_MESSAGE = 'No se encontró la actividad.';

function validate(input: ActivityInput): ActivityInput {
  const type = input.type.trim();
  if (!type) throw new Error(EMPTY_TYPE_MESSAGE);
  if (input.caloriesBurned <= 0) throw new Error(INVALID_CALORIES_MESSAGE);
  if (input.durationMinutes <= 0) throw new Error(INVALID_DURATION_MESSAGE);
  return { ...input, type, caloriesBurned: Math.round(input.caloriesBurned) };
}

export function logActivity(repository: ActivityEntryRepository) {
  return async (input: ActivityInput): Promise<ActivityEntry> => {
    return repository.create(validate(input));
  };
}

export function updateActivity(repository: ActivityEntryRepository) {
  return async (id: string, input: ActivityInput): Promise<ActivityEntry> => {
    const updated = await repository.update(id, validate(input));
    if (!updated) throw new Error(NOT_FOUND_MESSAGE);
    return updated;
  };
}

export function deleteActivity(repository: ActivityEntryRepository) {
  return async (id: string): Promise<void> => {
    await repository.delete(id);
  };
}

export function listActivitiesByDate(repository: ActivityEntryRepository) {
  return async (date: string): Promise<ActivityEntry[]> => {
    return repository.findByDate(date);
  };
}

export function getActivity(repository: ActivityEntryRepository) {
  return async (id: string): Promise<ActivityEntry | null> => {
    return repository.findById(id);
  };
}
