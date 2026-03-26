import type { Migration } from './index';

export const migration001: Migration = {
  version: 1,
  name: 'Initial Schema',
  sql: `
    -- ═══════════════════════════════════════════════════════════════
    -- TRAINING TABLES
    -- ═══════════════════════════════════════════════════════════════

    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      muscle_groups TEXT,
      equipment_needed TEXT,
      instructions TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS routine_exercises (
      id TEXT PRIMARY KEY,
      routine_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      target_sets INTEGER,
      target_reps TEXT,
      target_weight REAL,
      rest_time INTEGER,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT,
      FOREIGN KEY (routine_id) REFERENCES routines(id),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      routine_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      duration INTEGER,
      notes TEXT,
      is_completed BOOLEAN DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT,
      FOREIGN KEY (routine_id) REFERENCES routines(id)
    );

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id TEXT PRIMARY KEY,
      workout_session_id TEXT NOT NULL,
      routine_exercise_id TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      reps INTEGER,
      weight REAL,
      duration INTEGER,
      distance REAL,
      rest_time INTEGER,
      rpe INTEGER,
      notes TEXT,
      is_completed BOOLEAN DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT,
      FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id),
      FOREIGN KEY (routine_exercise_id) REFERENCES routine_exercises(id)
    );

    -- ═══════════════════════════════════════════════════════════════
    -- NUTRITION TABLES
    -- ═══════════════════════════════════════════════════════════════

    CREATE TABLE IF NOT EXISTS macro_goals (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      calorie_goal REAL NOT NULL,
      protein_goal REAL NOT NULL,
      carbohydrate_goal REAL NOT NULL,
      fat_goal REAL NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS meal_entries (
      id TEXT PRIMARY KEY,
      meal_id TEXT NOT NULL,
      food_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      calories REAL NOT NULL,
      protein REAL NOT NULL,
      carbohydrates REAL NOT NULL,
      fat REAL NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT,
      FOREIGN KEY (meal_id) REFERENCES meals(id)
    );

    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT,
      barcode TEXT,
      serving_size REAL NOT NULL,
      serving_unit TEXT NOT NULL,
      calories_per_serving REAL NOT NULL,
      protein_per_serving REAL NOT NULL,
      carbohydrates_per_serving REAL NOT NULL,
      fat_per_serving REAL NOT NULL,
      is_custom BOOLEAN DEFAULT 1,
      is_favorite BOOLEAN DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT
    );

    -- ═══════════════════════════════════════════════════════════════
    -- PROFILE TABLES
    -- ═══════════════════════════════════════════════════════════════

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      name TEXT,
      age INTEGER,
      weight REAL,
      height REAL,
      activity_level TEXT,
      goal TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════════════════════════════
    -- INDEXES
    -- ═══════════════════════════════════════════════════════════════

    CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON routine_exercises(routine_id);
    CREATE INDEX IF NOT EXISTS idx_workout_sessions_routine ON workout_sessions(routine_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_sets_session ON exercise_sets(workout_session_id);
    CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
    CREATE INDEX IF NOT EXISTS idx_meal_entries_meal ON meal_entries(meal_id);
    CREATE INDEX IF NOT EXISTS idx_macro_goals_date ON macro_goals(date, is_active);
  `,
};
