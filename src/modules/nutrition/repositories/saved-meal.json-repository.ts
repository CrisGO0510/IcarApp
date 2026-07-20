import { JsonRepository } from 'src/core/repositories/json.repository';
import type { SavedMeal } from '../types/nutrition.types';
import type { SavedMealRepository } from './nutrition.repository.port';

export class SavedMealJsonRepository
  extends JsonRepository<SavedMeal>
  implements SavedMealRepository
{
  protected storageKey = 'icarapp:saved_meals';
}
