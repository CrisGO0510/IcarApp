import { JsonRepository } from 'src/core/repositories/json.repository';
import type { Exercise } from '../types/training.types';
import type { ExerciseRepository } from './training.repository.port';

export class ExerciseJsonRepository
  extends JsonRepository<Exercise>
  implements ExerciseRepository
{
  protected storageKey = 'icarapp:exercises';

  async searchByName(query: string): Promise<Exercise[]> {
    const all = await this.findAll();
    const normalized = query.trim().toLowerCase();
    if (!normalized) return all;
    return all.filter((exercise) => exercise.name.toLowerCase().includes(normalized));
  }
}
