# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IcarApp is an offline-first hybrid mobile app for workout and nutrition tracking. Built with Vue 3 + **Vite** + **Quasar as a Vite plugin** (`@quasar/vite-plugin`) + Capacitor, persisting data locally via **Capacitor Preferences** (JSON blobs). No backend — all data stays on-device. See `docs/` for full vision, requirements, flows, and architecture decisions (docs are in **Spanish**).

> The project originally targeted SQLite (migrated to Capacitor Preferences — commit "Cambiamos a capacitor preference"; no SQLite/migrations/`schema_version`), and originally used the Quasar CLI (`@quasar/app-vite`) — it was migrated to a plain **Vite + `@quasar/vite-plugin`** setup (like the `linktic/banco` project). Ignore SQLite and `quasar dev`/`quasar.config.ts` references in older docs.

## Build system (Vite + Quasar plugin)

- Entry: `index.html` → `src/main.ts` (creates the app, installs `Quasar` with `config.dark`, Pinia, and the router).
- `vite.config.ts` wires `@vitejs/plugin-vue` + `quasar({ sassVariables })` and the path aliases (`src`, `layouts`, `components`, `assets`, `boot`, `stores`).
- `tsconfig.json` is standalone (no `.quasar/`): keeps strict flags and the aliases as `paths`. Quasar global component types come from `types: ["quasar"]` + `env.d.ts`.
- Router uses `createWebHashHistory` (hash mode) directly; Pinia via `createPinia()` in `main.ts` (no `#q-app/wrappers`, no `boot/` files).

## Commands

- **Dev server:** `pnpm dev` (Vite, port 9000)
- **Build:** `pnpm build` (`vue-tsc --noEmit && vite build` → `dist/`)
- **Preview:** `pnpm preview`
- **Lint:** `pnpm lint`
- **Format:** `pnpm format`
- **Tests:** `pnpm test` (Vitest), `pnpm test:coverage`
- **Capacitor (Android):** `pnpm cap:sync` / `pnpm cap:android` (Capacitor CLI, `webDir: dist`). See `docs/deuda-tecnica.md` — the Android platform still needs re-adding at the repo root (`npx cap add android`); the old Quasar-managed `src-capacitor/` is orphaned.

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
JSON Adapter (class extends JsonRepository<T>) — concrete implementation
    ↓
Capacitor Preferences (one JSON array per storageKey)
```

The `profile` module is a fully-wired vertical slice (use-cases → store → repository adapter → view); use it as the reference template. `training` has real persistence for its **exercise library** (`ExerciseJsonRepository` + `exercise.store` + `ExerciseLibraryPage`) and **routines** (`RoutineJsonRepository` + `RoutineExerciseJsonRepository` + `routine.store` + routines list/detail/form pages, with in-memory joins of the routine↔exercise pivot at the use-case level); its workout sessions/sets parts still have only `types/` + port. `nutrition` still has only `types/` + port. `activity` and `progress` are computed/mock-fed (no persistence).

**Hexagonal rules:**
- Use cases are **functions** (not classes) that receive the repository port as argument and return an async operation — aligns with Composition API style (see `src/modules/profile/use-cases/`)
- Use cases contain business logic and validations; stores only coordinate them
- The store instantiates the concrete repository adapter, binds it to the use-case functions, and exposes reactive state (see `profile.store.ts`)
- Stores never call repositories directly — always through use cases
- Components/composables never contain business logic or data access
- To switch to a cloud backend: implement a new adapter satisfying the same `Repository<T>` port (e.g. an HTTP adapter replacing `JsonRepository`)

## Module Organization

Domain modules in `src/modules/`:
- `training/` — routines, exercises, workout sessions, sets. **Exercise library** (incl. an exercise-edit screen: rename, per-exercise rest time `Exercise.restTime`, delete — reached by tapping an exercise in the library or routine detail), **routines** and **set logging** implemented (real persistence: adapters + stores + use-cases + pages; exercise library seeds ~10 starter exercises on first run; routines have list/detail/create-edit; routine detail logs sets via right-to-left swipe → reps/weight dialog → `ExerciseSet` in the day's `WorkoutSession`, with a countdown rest timer using `exercise.restTime ?? profile.defaultRestTime`; tapping an exercise opens an **exercise-detail** screen with a performance summary (series/reps/volume deltas vs the previous session) + per-day set history, and its "Editar" leads to the exercise-edit screen; tapping a set (in the exercise-detail screen or the library's exercise history) opens a **set-edit screen** (`entreno/series/:setId/editar`: reps, weight, date/time — cross-day moves reassign the session —, notes, delete; replaced the old `SetEditDialog`), and routine-form exercises support **drag & drop ordering** (two sections: ordered "En la rutina" + alphabetical "Biblioteca", via `vuedraggable`)). Session close (`completedAt`) still pending (see `docs/deuda-tecnica.md`)
- `nutrition/` — meals, meal entries, foods, macro goals (types + port only)
- `profile/` — user profile (fully implemented)
- `activity/` — dashboard summaries (computed, not persisted)
- `progress/` — progress analytics over time: body-weight + training-volume charts via ApexCharts (computed, mock-fed — see `docs/deuda-tecnica.md`)

A module may contain any of: `components/`, `composables/`, `use-cases/`, `views/`, `repositories/`, `stores/`, `types/` — create subdirs as the module needs them, don't scaffold empties.

No `entities/` (types cover this) or `services/` (use cases replace this).

## Core Layer (`src/core/`)

- `repositories/json.repository.ts` — abstract `JsonRepository<T>` adapter: generic CRUD over Capacitor Preferences. Each "table" is a JSON array stored under a `storageKey`. Subclasses set `storageKey` and may override `serialize`/`deserialize` to handle extra `Date` fields.
- `types/base.types.ts` — `BaseEntity`, `QueryOptions`, and the `Repository<T>` port interface that all adapters satisfy.

## Persistence

- All entities use UUID primary keys (`crypto.randomUUID()`), generated in `JsonRepository.create()`
- Audit fields are **camelCase** on entities: `createdAt`, `updatedAt`, `deletedAt: Date` (these are real `Date` objects in memory, serialized to ISO strings in storage)
- Exception: for `ExerciseSet`, `createdAt` means "when the set was performed" and is editable from the set-edit screen (`ExerciseSetJsonRepository` overrides `update` to allow it; moving a set across days reassigns its `WorkoutSession`)
- **Soft deletes**: `delete()` sets `deletedAt`; all reads (`findById`, `findAll`, `count`) filter out soft-deleted rows
- Dates must round-trip through JSON: `deserialize()` rehydrates ISO strings back into `Date`. If an entity adds new `Date` fields beyond the audit ones, override `deserialize`/`serialize` in its adapter (see how `profile` could extend it).
- `QueryOptions` (`orderBy`, `orderDirection`, `limit`, `offset`) are applied in-memory in `findAll`
- A repository adapter extends `JsonRepository<T>` **and** implements its module's port interface, adding domain-specific methods (e.g. `ProfileJsonRepository` adds `get()`/`save()` for the singleton profile)

## Git

- **Nunca hagas commits.** Solo el usuario hace commits (y push). Puedes hacer staging, mostrar diffs y redactar mensajes propuestos, pero no ejecutes `git commit` / `git push` salvo que el usuario lo pida explícitamente.

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
- Router uses hash mode (`vueRouterMode: 'hash'` in `quasar.config.ts`)
- Package manager: pnpm (`pnpm-workspace.yaml`, engines require pnpm >= 10)
- New repositories: define the port interface in the module's `repositories/`, then a `*.json-repository.ts` adapter that extends `JsonRepository<T>` and implements the port
- Pinia is set up via `src/stores/index.ts`; `pinia-plugin-persistedstate` is a dependency but not currently wired in (persistence happens through repositories, not the store plugin)
- Constants use `as const` arrays with derived union types
