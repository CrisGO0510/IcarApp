import { BaseRepository } from 'src/core/repositories/base.repository';
import type { EntityRowData, DatabaseRow } from 'src/core/types/sqlite.types';
import type { UserProfile } from '../types/profile.types';
import type { UnitSystem } from '../types/profile.types';
import type { UserProfileRepository } from './profile.repository.port';

export class ProfileSQLiteRepository
  extends BaseRepository<UserProfile>
  implements UserProfileRepository
{
  protected tableName = 'user_profile';

  protected mapRowToEntity(row: DatabaseRow): UserProfile {
    return {
      id: row.id as string,
      name: row.name as string,
      defaultRestTime: row.default_rest_time as number,
      unitSystem: row.unit_system as UnitSystem,
      maintenanceCalories: row.maintenance_calories as number,
      weight: row.weight as number,
      height: row.height as number,
      createdAt: this.stringToDate(row.created_at as string),
      updatedAt: this.stringToDate(row.updated_at as string),
    };
  }

  protected mapEntityToRow(entity: Partial<UserProfile>): EntityRowData {
    const row: EntityRowData = {};
    if (entity.id !== undefined) row.id = entity.id;
    if (entity.name !== undefined) row.name = entity.name;
    if (entity.defaultRestTime !== undefined) row.default_rest_time = entity.defaultRestTime;
    if (entity.unitSystem !== undefined) row.unit_system = entity.unitSystem;
    if (entity.maintenanceCalories !== undefined)
      row.maintenance_calories = entity.maintenanceCalories;
    if (entity.weight !== undefined) row.weight = entity.weight;
    if (entity.height !== undefined) row.height = entity.height;
    if (entity.createdAt !== undefined) row.created_at = this.dateToString(entity.createdAt);
    if (entity.updatedAt !== undefined) row.updated_at = this.dateToString(entity.updatedAt);
    return row;
  }

  async get(): Promise<UserProfile | null> {
    const rows = await this.executeQuery('SELECT * FROM user_profile LIMIT 1');
    return rows.length > 0 && rows[0] ? this.mapRowToEntity(rows[0]) : null;
  }

  async save(data: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.get();
    if (existing) {
      const updated = await this.update(existing.id, data);
      return updated!;
    }
    return this.create(data as Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>);
  }
}
