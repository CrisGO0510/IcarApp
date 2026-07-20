import { JsonRepository } from 'src/core/repositories/json.repository';
import type { SavedMeal } from '../types/nutrition.types';
import type { SavedMealRepository } from './nutrition.repository.port';
import { round1 } from '../use-cases/scaleMealFromReference';

export class SavedMealJsonRepository
  extends JsonRepository<SavedMeal>
  implements SavedMealRepository
{
  protected storageKey = 'icarapp:saved_meals';

  protected override deserialize(raw: unknown): SavedMeal {
    const base = super.deserialize(raw);
    return {
      ...base,
      proteinPerBase: round1(base.proteinPerBase),
      carbohydratesPerBase: round1(base.carbohydratesPerBase),
      fatPerBase: round1(base.fatPerBase),
      caloriesPerBase: Math.round(base.caloriesPerBase),
    };
  }
}
