import { JsonRepository } from 'src/core/repositories/json.repository';
import type { ExerciseSet } from '../types/training.types';
import type { ExerciseSetRepository } from './training.repository.port';

export class ExerciseSetJsonRepository
  extends JsonRepository<ExerciseSet>
  implements ExerciseSetRepository
{
  protected storageKey = 'icarapp:exercise_sets';

  async findBySession(workoutSessionId: string): Promise<ExerciseSet[]> {
    const all = await this.findAll();
    return all
      .filter((set) => set.workoutSessionId === workoutSessionId)
      .sort((a, b) => a.setNumber - b.setNumber);
  }

  async findByExercise(routineExerciseId: string): Promise<ExerciseSet[]> {
    const all = await this.findAll();
    return all.filter((set) => set.routineExerciseId === routineExerciseId);
  }

  public override async update(
    id: string,
    data: Partial<ExerciseSet>,
  ): Promise<ExerciseSet | null> {
    const items = await this.loadAll();
    const idx = items.findIndex((set) => set.id === id && !set.deletedAt);
    if (idx === -1) return null;

    const current = items[idx]!;
    const changes = { ...data };
    delete changes.deletedAt;
    const merged: ExerciseSet = {
      ...current,
      ...changes,
      id: current.id,
      updatedAt: new Date(),
    };
    items[idx] = merged;
    await this.saveAll(items);
    return merged;
  }
}
