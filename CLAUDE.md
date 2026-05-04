# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IcarApp is an offline-first hybrid mobile app for workout and nutrition tracking. Built with Vue 3 + Quasar Framework + Capacitor, using SQLite for local persistence. No backend — all data stays on-device. See `docs/` for full vision, requirements, flows, and architecture decisions.

## Commands

- **Dev server:** `quasar dev`
- **Build:** `quasar build`
- **Lint:** `pnpm lint`
- **Format:** `pnpm format`
- **Capacitor dev (Android):** `quasar dev -m capacitor -T android`
- **Capacitor build (Android):** `quasar build -m capacitor -T android`

No test framework is configured yet.

## Architecture (Hexagonal + Repository Pattern)

```
Vue SFC (.vue template)
    ↓ destructures
Composable (useXxx.ts) — UI state, form handling
    ↓ calls
Pinia Store — global reactive state, coordinates use cases
    ↓ calls
Use Cases (src/modules/*/use-cases/) — one business operation per function
    ↓ depends on
Repository Port (interface) — data access contract
    ↓ implemented by
SQLite Adapter (extends BaseRepository) — concrete implementation
    ↓
SQLiteManager singleton (src/core/database/sqlite.ts)
```

**Hexagonal rules:**
- Use cases are **functions** (not classes) that receive the repository port as argument — aligns with Composition API style
- Use cases contain business logic and validations; stores only coordinate them
- Stores never call repositories directly — always through use cases
- Components/composables never contain business logic or data access
- To switch to a cloud backend: implement new adapters satisfying the same port interfaces

## Module Organization

Domain modules in `src/modules/`:
- `training/` — routines, exercises, workout sessions, sets
- `nutrition/` — meals, meal entries, foods, macro goals
- `profile/` — user profile
- `activity/` — dashboard summaries (computed, not persisted)

Each module has: `components/`, `composables/`, `use-cases/`, `views/`, `repositories/`, `stores/`, `types/`

No `entities/` (types cover this) or `services/` (use cases replace this).

## Core Layer (`src/core/`)

- `database/sqlite.ts` — SQLiteManager singleton (connection, migrations, transactions, UUID generation via `crypto.randomUUID()`)
- `database/migrations/` — numbered migration files (`001_initial.ts`, etc.) with `Migration` interface
- `repositories/base.repository.ts` — abstract BaseRepository with generic CRUD (SQLite adapter)
- `types/base.types.ts` — `BaseEntity`, `QueryOptions`, `Repository<T>` port interface
- `types/sqlite.types.ts` — SQLite-specific types (`SQLiteValue`, `DatabaseRow`, `EntityRowData`)

## Database

- All entities use UUID primary keys (`crypto.randomUUID()`)
- Audit fields: `created_at`, `updated_at`, `deleted_at` (soft deletes)
- Migrations versioned in `schema_version` table, auto-applied on init
- TypeScript entity interfaces are aligned 1:1 with SQL table columns

## Component Conventions

- **SFC + Composable pattern**: each component in its own directory with `.vue` (template inline + script setup) + `.ts` (composable) + `.scss` (optional)
- **No separated `.html` templates** — `<script setup>` does not support `src`, and eslint-plugin-vue can't lint external templates
- **Single responsibility**: split large components into child components, not more files
- **`views/`** for route-level components (not `pages/`)
- **Composables** (`useXxx()`) for extracting reusable or complex logic

## Code Conventions

- TypeScript strict mode
- ESLint enforces `consistent-type-imports` (use `import type` for type-only imports)
- Prettier: single quotes, 100 char print width
- Quasar auto-imports components
- Router uses hash mode
- pnpm with `shamefullyHoist: true`
- New repositories: define port interface in module, extend `BaseRepository<T>` for SQLite adapter
- Constants use `as const` arrays with derived union types
