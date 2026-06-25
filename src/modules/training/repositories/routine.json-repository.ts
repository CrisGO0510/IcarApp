import { JsonRepository } from 'src/core/repositories/json.repository';
import type { Routine } from '../types/training.types';
import type { RoutineRepository } from './training.repository.port';

export class RoutineJsonRepository
  extends JsonRepository<Routine>
  implements RoutineRepository
{
  protected storageKey = 'icarapp:routines';

  async findActive(): Promise<Routine[]> {
    const all = await this.findAll();
    return all.filter((routine) => routine.isActive);
  }
}
