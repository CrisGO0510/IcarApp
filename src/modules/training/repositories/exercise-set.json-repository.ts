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
}
