# Spec — Nutrición, Slice C, Peso corporal, Ajustes y datos reales

> Sesión de implementación autónoma sobre `main` (rama `feat/nutricion-slicec-progreso`).
> Continúa el trabajo ya commiteado de design system + training. Pantallas de referencia:
> `docs/visily-multiscreens.pdf`. Docs en español; sin SCSS en `.vue` (design system ya hecho).

## Objetivo

Cerrar los huecos funcionales que quedan tras el design system: implementar el **módulo
Nutrición** completo, completar el **Slice C de training**, persistir **peso corporal**,
crear **Ajustes**, y reemplazar los **mocks** de Dashboard y Progreso por datos reales.

## Arquitectura

Se respeta la arquitectura hexagonal existente (port → adapter `JsonRepository<T>` →
use-cases función → store Pinia → SFC + composable). El `profile` es el template simple;
`training` el complejo (joins en use-cases). Sin backend; persistencia en Capacitor
Preferences (un array JSON por `storageKey`).

## Decisiones de diseño

- **D1 · Comida = `MealEntry` plano.** Las pantallas muestran cada comida como ítem
  (hora, nombre, cantidad, macros, kcal) sin agrupar ni catálogo. Se usa la entidad
  `MealEntry` (ya tiene `foodName/quantity/unit/calories/protein/carbohydrates/fat`),
  ampliada con `date: string (YYYY-MM-DD)` y `loggedAt: Date`, y `mealId` pasa a opcional
  (sin uso esta iteración). `Meal` y `Food` quedan como types+port sin implementar (YAGNI).
  kcal se autocalcula (4·P + 4·C + 9·G) pero es editable.
- **D2 · "Agregar actividad" (calorías quemadas) fuera de alcance.** No existe en tipos ni
  dashboard; la sección queda como empty state visible sin form. Anotado en deuda técnica.
- **D3 · Ajustes sin diseño en el PDF** → se arma con los campos del Onboarding editando el
  perfil existente (nombre, descanso por defecto, unidades, mantenimiento, peso, altura).
- **D4 · Peso corporal** → nuevo módulo `measurements` con entidad `BodyWeightLog`
  (`date: YYYY-MM-DD`, `weightKg: number`). Punto de captura: el botón "+" de la card
  "PESO MEDIO (SEMANAL)" del dashboard (hoy emite `action` sin escucha) → diálogo rápido.
- **D5 · Editar serie** (page 15: reps/peso/fecha/hora/notas + eliminar) entra en Slice C;
  `ExerciseSet` ya soporta `notes`.

## Modelo por módulo

### Nutrición (`src/modules/nutrition`)
- Tipos: ampliar `MealEntry` (`date`, `loggedAt`, `mealId?`). Adapter
  `MealEntryJsonRepository` (override `deserialize` por `loggedAt`) + `findByDate`.
  Adapter `MacroGoalJsonRepository` (`findActive`, `findByDate`).
- Use-cases: `logMeal`, `listMealsByDate`, `updateMeal`, `deleteMeal`, `computeCalories`,
  `getActiveMacroGoal`, `saveMacroGoal`, `buildNutritionDay` (totales del día vs goal,
  reutilizando el cálculo de `buildNutritionSummary` de activity sin duplicar lógica).
- Store `nutrition.store`. Pantallas: `NutritionPage` (resumen + lista + acordeones),
  `MealFormPage` (alta/edición de comida), `MacroGoalPage` (sliders %/gramos).

### Training Slice C (`src/modules/training`)
- Derivar metadatos de `WorkoutSession` (`completedAt`/`duration`) → "Realizada hace X
  días · N min" en `RoutineCard` y `RoutineSummary`; badge "EN PROGRESO" cuando hay sesión
  de hoy sin cerrar. Estos campos se exponen vía `listRoutines`/`getRoutineDetail`.
- Swipe der→izq en `RoutineDetailPage` = eliminar ejercicio de la rutina (hoy solo existe
  izq→der = nueva serie). Se verifica la dirección real en el código antes de cablear.
- Editar/eliminar serie registrada (page 15) desde el detalle de ejercicio.

### Measurements (`src/modules/measurements`)
- Entidad `BodyWeightLog`, adapter, port, use-cases `logWeight`, `listWeights(range)`,
  `latestWeight`, store. Diálogo de captura reutilizable desde el dashboard.

### Ajustes (`src/modules/profile`)
- `SettingsPage` (route-level) que edita el perfil con los campos del onboarding.

### Datos reales (Fase 5)
- `activity.store`: orquestador `getDashboardSummary(trainingRepos, mealEntryRepo,
  macroGoalRepo, bodyWeightRepo)` arma `DashboardInput` desde repos reales → elimina
  `dashboard.mock.ts`. Ajuste: `mealsCount` pasa a `entries.length`.
- `progress.store`: orquestador arma `ProgressInput` desde `BodyWeightLog` (→
  `BodyWeightEntry`) y de las sesiones+sets reales (→ `SessionVolume`, con `type` = nombre
  del ejercicio como fallback ante la falta de taxonomía de grupo muscular) → elimina
  `progress.mock.ts`.

## Verificación

Por tarea: `pnpm build` (vue-tsc + falla si falta token SCSS) · `pnpm lint` · `pnpm test`.
Tests de use-cases nuevos (Vitest, patrón fake-repo + Arrange/Act/Assert, sin comentarios
fuera de esos marcadores). Revisión visual contra el PDF la hace el usuario al volver.

## Fuera de alcance

Catálogo de alimentos (`Food`/`Meal`), gasto calórico (D2), taxonomía de grupo muscular,
reconfiguración de Capacitor Android, cambios al design system.

## Deuda técnica nueva a registrar

- "Agregar actividad" (gasto calórico) sin implementar.
- Volumen de Progreso usa nombre de ejercicio como `type` (sin grupos musculares).
