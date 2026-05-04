# Onboarding Screen — Design Spec

## Overview

First screen the user sees when opening IcarApp for the first time. Captures essential profile data and preferences before navigating to the dashboard. No authentication — purely local setup.

## Data Model

### Fields captured

| Field | Column | Type | Validation |
|-------|--------|------|------------|
| Nombre | `name` | TEXT NOT NULL | Required, non-empty |
| Descanso por serie | `default_rest_time` | INTEGER NOT NULL | Presets 60/90/120 or custom > 0 (seconds) |
| Unidad de medida | `unit_system` | TEXT NOT NULL | `'metric'` or `'imperial'`, default `'metric'` |
| Calorías de mantenimiento | `maintenance_calories` | REAL NOT NULL | Required, > 0 |
| Peso actual | `weight` | REAL NOT NULL | Required, > 0 |
| Altura | `height` | REAL NOT NULL | Required, > 0 |

### Schema changes

Migration `002_add_profile_preferences`:

- Add columns: `default_rest_time INTEGER`, `unit_system TEXT`, `maintenance_calories REAL`
- Drop columns: `age`, `activity_level`, `goal` (not in wireframe)

SQLite does not support `DROP COLUMN` on older versions. The migration recreates the table:

1. Create `user_profile_new` with the correct columns
2. Copy `id`, `name`, `weight`, `height`, `created_at`, `updated_at` from old table
3. Drop old table
4. Rename new table to `user_profile`

### TypeScript type

```typescript
export interface UserProfile extends BaseEntity {
  name: string;
  defaultRestTime: number;       // seconds
  unitSystem: UnitSystem;        // 'metric' | 'imperial'
  maintenanceCalories: number;
  weight: number;                // kg or lbs depending on unitSystem
  height: number;                // cm or in depending on unitSystem
}
```

Constants removed: `ACTIVITY_LEVELS`, `FITNESS_GOALS` and their types.

Added: `UNIT_SYSTEMS` constant with `UnitSystem` type.

## Navigation

### Router guard

A global `beforeEach` guard in `src/router/index.ts`:

- On every navigation, check `profileStore.hasProfile`
- If `false` and target is not `/onboarding` → redirect to `/onboarding`
- If `true` and target is `/onboarding` → redirect to `/`
- `hasProfile` is a computed that returns `profile !== null`

### Routes

- `/onboarding` — `OnboardingPage.vue`, no layout wrapper (fullscreen)
- `/` — `MainLayout` with `IndexPage` (future dashboard)

## Component — OnboardingPage.vue

Single fullscreen page, dark theme. Structure top to bottom:

1. **Header**: IcarApp icon + "Bienvenido a IcarApp" + brief description text
2. **Name input**: `q-input` with label "Tu nombre"
3. **Rest time selector**: Three `q-btn` toggles (60s / 90s / 120s) + `q-input` for custom value. Mutually exclusive — selecting a preset clears custom, typing custom deselects presets.
4. **Unit system toggle**: Two `q-btn-toggle` options: Kilogramos (kg) / Libras (lbs)
5. **Maintenance calories + Weight**: Side by side `q-input` number fields
6. **Height**: `q-input` number field with unit suffix (cm or in based on unitSystem)
7. **Disclaimer text**: Small text about data staying on device
8. **"Comenzar" button**: Full-width primary action

### Validation

All fields required. Button disabled until form is valid. No inline errors until first submit attempt.

### On submit

1. Call `profileStore.saveProfile(formData)`
2. Navigate to `/`

## Store — useProfileStore

Pinia composition store in `src/modules/profile/stores/profile.store.ts`:

- **State**: `profile: ref<UserProfile | null>(null)`
- **Getters**: `hasProfile: computed(() => profile.value !== null)`
- **Actions**:
  - `loadProfile()` — calls repository, sets `profile`
  - `saveProfile(data)` — calls repository create/update, sets `profile`

## Repository

### Port (interface)

Already defined in `profile.repository.port.ts`:

```typescript
export interface UserProfileRepository {
  get(): Promise<UserProfile | null>;
  save(data: Partial<UserProfile>): Promise<UserProfile>;
}
```

### SQLite adapter

New file `src/modules/profile/repositories/profile.sqlite-repository.ts`:

Extends `BaseRepository<UserProfile>` with:

- `tableName = 'user_profile'`
- `mapRowToEntity(row)` — maps snake_case DB columns to camelCase entity
- `mapEntityToRow(entity)` — maps camelCase entity to snake_case columns
- `get()` — returns first row (single-record entity)
- `save(data)` — upserts: if profile exists, update; if not, create

## File inventory

| Action | Path |
|--------|------|
| Create | `src/core/database/migrations/002_add_profile_preferences.ts` |
| Edit | `src/core/database/migrations/index.ts` |
| Edit | `src/modules/profile/types/profile.types.ts` |
| Edit | `src/modules/profile/repositories/profile.repository.port.ts` |
| Create | `src/modules/profile/repositories/profile.sqlite-repository.ts` |
| Create | `src/modules/profile/stores/profile.store.ts` |
| Create | `src/modules/profile/pages/OnboardingPage.vue` |
| Edit | `src/router/routes.ts` |
| Edit | `src/router/index.ts` |
