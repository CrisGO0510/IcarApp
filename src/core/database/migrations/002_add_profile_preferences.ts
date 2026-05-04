import type { Migration } from './index';

export const migration002: Migration = {
  version: 2,
  name: 'Update profile preferences',
  sql: `
    CREATE TABLE IF NOT EXISTS user_profile_new (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      default_rest_time INTEGER NOT NULL DEFAULT 90,
      unit_system TEXT NOT NULL DEFAULT 'metric',
      maintenance_calories REAL NOT NULL DEFAULT 2000,
      weight REAL NOT NULL DEFAULT 70,
      height REAL NOT NULL DEFAULT 170,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO user_profile_new (id, name, weight, height, created_at, updated_at)
      SELECT id, COALESCE(name, ''), COALESCE(weight, 70), COALESCE(height, 170), created_at, updated_at
      FROM user_profile;

    DROP TABLE IF EXISTS user_profile;

    ALTER TABLE user_profile_new RENAME TO user_profile;
  `,
};
