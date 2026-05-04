# Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the onboarding screen that captures user profile data on first launch and gates access to the rest of the app.

**Architecture:** Migration updates `user_profile` table → types/port updated → SQLite adapter implements port → Pinia store wraps adapter → Vue page consumes store → router guard redirects based on profile existence.

**Tech Stack:** Vue 3 Composition API, Quasar components, Pinia, SQLite via Capacitor, TypeScript strict.

---

### Task 1: Migration — update user_profile schema

**Files:**
- Create: `src/core/database/migrations/002_add_profile_preferences.ts`
- Modify: `src/core/database/migrations/index.ts`

- [ ] **Step 1: Create migration file**

```typescript
// src/core/database/migrations/002_add_profile_preferences.ts
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
```

- [ ] **Step 2: Register migration in index**

```typescript
// src/core/database/migrations/index.ts
import { migration001 } from './001_initial';
import { migration002 } from './002_add_profile_preferences';

export interface Migration {
  version: number;
  name: string;
  sql: string;
}

export const migrations: Migration[] = [migration001, migration002];
```

---

### Task 2: Update profile types

**Files:**
- Modify: `src/modules/profile/types/profile.types.ts`

- [ ] **Step 1: Rewrite types to match new schema**

```typescript
import type { BaseEntity } from 'src/core/types/base.types';

export const UNIT_SYSTEMS = ['metric', 'imperial'] as const;
export type UnitSystem = (typeof UNIT_SYSTEMS)[number];

export const REST_TIME_PRESETS = [60, 90, 120] as const;
export type RestTimePreset = (typeof REST_TIME_PRESETS)[number];

export interface UserProfile extends BaseEntity {
  name: string;
  defaultRestTime: number;
  unitSystem: UnitSystem;
  maintenanceCalories: number;
  weight: number;
  height: number;
}
```

---

### Task 3: Update repository port and create SQLite adapter

**Files:**
- Modify: `src/modules/profile/repositories/profile.repository.port.ts`
- Create: `src/modules/profile/repositories/profile.sqlite-repository.ts`

- [ ] **Step 1: Update port interface** (imports changed type)

```typescript
import type { UserProfile } from '../types/profile.types';

export interface UserProfileRepository {
  get(): Promise<UserProfile | null>;
  save(data: Partial<UserProfile>): Promise<UserProfile>;
}
```

- [ ] **Step 2: Create SQLite adapter**

```typescript
// src/modules/profile/repositories/profile.sqlite-repository.ts
import { BaseRepository } from 'src/core/repositories/base.repository';
import type { DatabaseRow, EntityRowData } from 'src/core/types/sqlite.types';
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
    if (entity.maintenanceCalories !== undefined) row.maintenance_calories = entity.maintenanceCalories;
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
```

---

### Task 4: Create profile Pinia store

**Files:**
- Create: `src/modules/profile/stores/profile.store.ts`

- [ ] **Step 1: Write store**

```typescript
// src/modules/profile/stores/profile.store.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { UserProfile } from '../types/profile.types';
import { ProfileSQLiteRepository } from '../repositories/profile.sqlite-repository';

export const useProfileStore = defineStore('profile', () => {
  const repository = new ProfileSQLiteRepository();
  const profile = ref<UserProfile | null>(null);

  const hasProfile = computed(() => profile.value !== null);

  async function loadProfile(): Promise<void> {
    profile.value = await repository.get();
  }

  async function saveProfile(data: Partial<UserProfile>): Promise<void> {
    profile.value = await repository.save(data);
  }

  return {
    profile,
    hasProfile,
    loadProfile,
    saveProfile,
  };
});
```

---

### Task 5: Create OnboardingPage.vue

**Files:**
- Create: `src/modules/profile/pages/OnboardingPage.vue`

- [ ] **Step 1: Write the onboarding page component**

Full-screen dark page with form fields matching the wireframe:
- Name input
- Rest time preset buttons (60/90/120) + custom input (mutually exclusive)
- Unit system toggle (kg/lbs)
- Maintenance calories + weight side by side
- Height with dynamic unit suffix
- "Comenzar" button disabled until valid
- On submit: `profileStore.saveProfile(formData)` then `router.push('/')`

---

### Task 6: Wire up routes and navigation guard

**Files:**
- Modify: `src/router/routes.ts`
- Modify: `src/router/index.ts`

- [ ] **Step 1: Add onboarding route**

```typescript
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/onboarding',
    component: () => import('src/modules/profile/pages/OnboardingPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
```

- [ ] **Step 2: Add navigation guard in router/index.ts**

After creating the Router, add a `beforeEach` guard that:
- Loads profile from store if not yet loaded
- Redirects to `/onboarding` if no profile and not already going there
- Redirects to `/` if profile exists and trying to access `/onboarding`

---

### Task 7: Type-check and lint

- [ ] **Step 1: Run `npx vue-tsc --noEmit`** — expect no errors
- [ ] **Step 2: Run lint** — expect no errors
