import { JsonRepository } from 'src/core/repositories/json.repository';
import type { MealEntry } from '../types/nutrition.types';
import type { MealEntryRepository } from './nutrition.repository.port';
import { round1 } from '../use-cases/scaleMealFromReference';

export class MealEntryJsonRepository
  extends JsonRepository<MealEntry>
  implements MealEntryRepository
{
  protected storageKey = 'icarapp:meal_entries';

  async findByMeal(mealId: string): Promise<MealEntry[]> {
    const all = await this.findAll();
    return all.filter((entry) => entry.mealId === mealId);
  }

  async findByDate(date: string): Promise<MealEntry[]> {
    const all = await this.findAll({ orderBy: 'loggedAt', orderDirection: 'ASC' });
    return all.filter((entry) => entry.date === date);
  }

  protected override deserialize(raw: unknown): MealEntry {
    const base = super.deserialize(raw);
    const obj = raw as Record<string, unknown>;
    return {
      ...base,
      loggedAt: new Date(obj.loggedAt as string),
      protein: round1(base.protein),
      carbohydrates: round1(base.carbohydrates),
      fat: round1(base.fat),
      calories: Math.round(base.calories),
    };
  }
}
