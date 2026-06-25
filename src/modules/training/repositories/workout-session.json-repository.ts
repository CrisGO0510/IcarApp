import { JsonRepository } from 'src/core/repositories/json.repository';
import type { WorkoutSession } from '../types/training.types';
import type { WorkoutSessionRepository } from './training.repository.port';

export class WorkoutSessionJsonRepository
  extends JsonRepository<WorkoutSession>
  implements WorkoutSessionRepository
{
  protected storageKey = 'icarapp:workout_sessions';

  async findByRoutine(routineId: string): Promise<WorkoutSession[]> {
    const all = await this.findAll();
    return all.filter((session) => session.routineId === routineId);
  }

  async findByDateRange(from: Date, to: Date): Promise<WorkoutSession[]> {
    const all = await this.findAll();
    return all.filter(
      (session) =>
        session.startedAt.getTime() >= from.getTime() &&
        session.startedAt.getTime() <= to.getTime(),
    );
  }

  protected override deserialize(raw: unknown): WorkoutSession {
    const base = super.deserialize(raw);
    const obj = raw as Record<string, unknown>;
    return {
      ...base,
      startedAt: new Date(obj.startedAt as string),
      ...(obj.completedAt ? { completedAt: new Date(obj.completedAt as string) } : {}),
    };
  }
}
