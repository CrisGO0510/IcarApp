import { JsonRepository } from 'src/core/repositories/json.repository';
import type { MacroGoal } from '../types/nutrition.types';
import type { MacroGoalRepository } from './nutrition.repository.port';

export class MacroGoalJsonRepository
  extends JsonRepository<MacroGoal>
  implements MacroGoalRepository
{
  protected storageKey = 'icarapp:macro_goals';

  async findActive(): Promise<MacroGoal | null> {
    const all = await this.findAll();
    return all.find((goal) => goal.isActive) ?? null;
  }

  async findByDate(date: string): Promise<MacroGoal | null> {
    const all = await this.findAll();
    return all.find((goal) => goal.date === date) ?? null;
  }
}
