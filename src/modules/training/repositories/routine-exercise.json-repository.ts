import { JsonRepository } from 'src/core/repositories/json.repository';
import type { RoutineExercise } from '../types/training.types';
import type { RoutineExerciseRepository } from './training.repository.port';

export class RoutineExerciseJsonRepository
  extends JsonRepository<RoutineExercise>
  implements RoutineExerciseRepository
{
  protected storageKey = 'icarapp:routine_exercises';

  async findByRoutine(routineId: string): Promise<RoutineExercise[]> {
    const all = await this.findAll();
    return all
      .filter((pivot) => pivot.routineId === routineId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async reorder(routineId: string, orderedIds: string[]): Promise<void> {
    const pivots = await this.findByRoutine(routineId);
    for (const pivot of pivots) {
      const orderIndex = orderedIds.indexOf(pivot.id);
      if (orderIndex !== -1 && orderIndex !== pivot.orderIndex) {
        await this.update(pivot.id, { orderIndex });
      }
    }
  }
}
