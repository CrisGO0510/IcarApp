# Plan — Nutrición, Slice C, Peso corporal, Ajustes y datos reales

**Spec:** `docs/superpowers/specs/2026-06-24-funcionalidad-nutricion-progreso-design.md`
**Rama:** `feat/nutricion-slicec-progreso` · **Commit por tarea** (autorizado solo este run).
**Verificación por tarea:** `pnpm build && pnpm lint && pnpm test`.

Orden por dependencia: 1 (Nutrición) y 2 (Slice C) independientes; 3 (peso) independiente;
4 (Ajustes) independiente; 5 (datos reales) depende de 1, 2 y 3.

---

## Fase 1 — Módulo Nutrición

- [ ] **1.1** Tipos + ports: ampliar `MealEntry` (`date`, `loggedAt`, `mealId?`); añadir
  `findByDate` al `MealEntryRepository`. (Compat: activity sigue compilando.)
- [ ] **1.2** Adapters: `MealEntryJsonRepository` (override `deserialize` por `loggedAt`,
  `findByDate`) y `MacroGoalJsonRepository` (`findActive`, `findByDate`). Commit.
- [ ] **1.3** Use-cases + specs: `computeCalories`, `logMeal`, `listMealsByDate`,
  `updateMeal`, `deleteMeal`, `getActiveMacroGoal`, `saveMacroGoal`, `buildNutritionDay`. Commit.
- [ ] **1.4** Store `nutrition.store`. Commit.
- [ ] **1.5** `MealFormPage` (.vue+.ts) — alta/edición comida (nombre, cantidad, macros,
  kcal autocalculada editable). Ruta. Commit.
- [ ] **1.6** `MacroGoalPage` (.vue+.ts) — sliders %/gramos, total, guardar/restablecer. Ruta. Commit.
- [ ] **1.7** `NutritionPage` (.vue+.ts) — resumen del día + lista de comidas + acordeón
  Actividad (empty state, D2). Ruta `/nutricion`. Commit.
- [ ] **1.8** Cablear tab "Nutrición" → `q-route-tab to="/nutricion"`. Verificación full. Commit.

## Fase 2 — Slice C training

- [ ] **2.1** Use-case `routineSessionMeta(sessionRepo)` → última fecha, duración, en-progreso
  por rutina; ampliar `RoutineSummary` y `getRoutineDetail`. Specs. Commit.
- [ ] **2.2** `RoutineCard` muestra "Realizada hace X días · N min · N ejercicios" + dot
  rojo/verde; header de `RoutineDetailPage` muestra badge "EN PROGRESO". Commit.
- [ ] **2.3** Swipe der→izq = eliminar ejercicio de la rutina en `RoutineDetailPage`
  (confirmar dirección real; usar `syncRoutineExercises`/`deletePivot`). Commit.
- [ ] **2.4** Editar/eliminar serie registrada (page 15) desde detalle de ejercicio:
  use-cases `updateSet`/`deleteSet` + dialog/inline. Specs. Verificación full. Commit.

## Fase 3 — Bitácora de peso corporal

- [ ] **3.1** Módulo `measurements`: tipos `BodyWeightLog`, port, `BodyWeightLogJsonRepository`
  (`findByDateRange`). Commit.
- [ ] **3.2** Use-cases + specs: `logWeight`, `listWeights`, `latestWeight`. Store. Commit.
- [ ] **3.3** Diálogo `WeightLogDialog` cableado al "+" del dashboard (StatCard `action`).
  Verificación full. Commit.

## Fase 4 — Ajustes + tabs

- [ ] **4.1** `SettingsPage` (.vue+.ts) edita perfil (campos del onboarding) vía
  `profile.store`. Ruta `/ajustes`. Commit.
- [ ] **4.2** Cablear tab "Ajustes" → `q-route-tab to="/ajustes"`. Verificación full. Commit.

## Fase 5 — Datos reales (eliminar mocks)

- [ ] **5.1** Dashboard real: orquestador en `activity.store` que arma `DashboardInput`
  desde repos de training + nutrition + measurements; `mealsCount = entries.length`
  (ajustar spec). Borrar `dashboard.mock.ts`. Specs. Commit.
- [ ] **5.2** Progreso real: orquestador que arma `ProgressInput` desde `BodyWeightLog` y
  sesiones+sets reales (`type` = nombre de ejercicio). Borrar `progress.mock.ts`. Specs. Commit.
- [ ] **5.3** Actualizar `docs/deuda-tecnica.md` (mocks resueltos; nueva deuda D2 + taxonomía).
  Verificación full. Commit.

---

## Notas
- Sin SCSS en `.vue`; clases nuevas (si hacen falta) van a `app.scss` con tokens del spec ds.
- `crypto.randomUUID()` lo genera `JsonRepository.create()`; no generar ids en use-cases.
- Tests: fake-repo en el propio spec, solo `// Arrange/Act/Assert` como comentarios.
