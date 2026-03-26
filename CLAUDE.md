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
Vue Components (src/pages/, src/components/, src/layouts/)
    ↓
Pinia Stores (src/modules/*/stores/)
    ↓
Services (src/modules/*/services/) — business logic
    ↓
Repository Ports (src/modules/*/repositories/*port.ts) — interfaces
    ↓
SQLite Adapters (extend BaseRepository from src/core/repositories/)
    ↓
SQLiteManager singleton (src/core/database/sqlite.ts)
```

**Hexagonal rules:**
- Services depend on repository **interfaces** (ports), never on SQLite directly
- `BaseRepository<T>` in `src/core/repositories/` is the SQLite adapter base class
- To switch to a cloud backend: implement new adapters satisfying the same port interfaces
- Components never contain business logic or data access
- Stores coordinate high-level operations, delegate logic to services

## Module Organization

Domain modules in `src/modules/`:
- `training/` — routines, exercises, workout sessions, sets
- `nutrition/` — meals, meal entries, foods, macro goals
- `profile/` — user profile
- `activity/` — dashboard summaries (computed, not persisted)

Each module has: `components/`, `entities/`, `pages/`, `repositories/`, `services/`, `stores/`, `types/`

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

## Code Conventions

- TypeScript strict mode
- ESLint enforces `consistent-type-imports` (use `import type` for type-only imports)
- Prettier: single quotes, 100 char print width
- Quasar auto-imports components
- Router uses hash mode
- pnpm with `shamefullyHoist: true`
- New repositories: define port interface in module, extend `BaseRepository<T>` for SQLite adapter
- Constants use `as const` arrays with derived union types
