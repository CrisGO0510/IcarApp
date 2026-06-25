# Deuda Técnica

Registro de atajos temporales que deben reemplazarse. Lo pendiente se rastrea aquí, no como comentarios en el código.

## Dashboard alimentado con datos mock

- **Qué:** `src/modules/activity/stores/dashboard.mock.ts` provee `dashboardMockInput` (reusa las factories de test `use-cases/fixtures.ts`). `activity.store.ts` → `loadDashboard()` lo usa para poblar la primera pantalla.
- **Por qué:** Los módulos `training` y `nutrition` todavía no tienen capa de datos (solo tipos + ports), así que no hay datos reales del día para mostrar.
- **Reemplazo:** Cuando existan los adapters/stores de `training` y `nutrition`, crear el use-case orquestador `getDashboardSummary(trainingRepo, nutritionRepo)` que traiga los datos reales del día y pasarlos a `buildDashboardSummary`. Luego eliminar `dashboard.mock.ts` y su import en el store.
- **Estado:** Resuelto. `getDashboardSummary` (en `activity/use-cases`) arma `DashboardInput` desde los repos reales de training, nutrition y measurements; `dashboard.mock.ts` eliminado.

## Pantalla de Progreso alimentada con datos mock

- **Qué:** `src/modules/progress/stores/progress.mock.ts` genera `progressMockInput` (bitácora de peso corporal + volúmenes por sesión). `progress.store.ts` lo pasa a `buildProgressSummary` para alimentar la pantalla de Progreso (métricas, gráfica de peso y de volumen) y sus controles (rango, filtros Rutina/Tipo).
- **Por qué:** No existe persistencia de peso corporal (el perfil solo guarda un peso único, no histórico) ni capa de datos de `training` (solo tipos + ports), así que no hay series reales.
- **Reemplazo:** Crear una entidad/bitácora de peso corporal persistida y los adapters/stores de `training`; reemplazar `progressMockInput` por un orquestador que arme `ProgressInput` desde datos reales y pasarlo a `buildProgressSummary`. Luego eliminar `progress.mock.ts` y su import en el store.
- **Estado:** Resuelto. Nuevo módulo `measurements` (`BodyWeightLog`) + `getProgressInput` (en `progress/use-cases`) arma `ProgressInput` desde peso corporal y sesiones+sets reales; `progress.mock.ts` eliminado. Ver deuda nueva sobre el `type` del volumen.

## Track de MacroProgressBar usa `$dark` en vez de `$surface-variant`

- **Qué:** `MacroProgressBar.vue` usa `track-color="dark"` (#111316) en su `q-linear-progress`. El design system pide que el track de las barras sea `$surface-variant` (#17191C).
- **Por qué:** Quasar solo genera clases de color utilitarias (`bg-*`/`track-color`) para su paleta de marca; las variables custom como `$surface-variant` no resuelven. La diferencia visual es mínima (6 unidades de luminancia).
- **Reemplazo:** Registrar `surface-variant` en el sistema de colores de Quasar (o aplicar el color del track vía clase CSS en `app.scss` sobre `.q-linear-progress__track`) para usar el token exacto del spec.
- **Estado:** Pendiente (cosmético).

## Navegación e interacciones del dashboard sin cablear

- **Qué:** En el tab bar inferior (`src/components/layout/AppTabBar/AppTabBar.vue`) "Entreno" y "Progreso" ya navegan vía `q-route-tab`; "Nutrición" y "Ajustes" siguen siendo `q-tab` sin ruta (no navegan). El botón "+" de la tarjeta de frecuencia (`StatCard` con `action-icon`) emite `action` pero nadie lo escucha.
- **Por qué:** Los módulos/vistas de Nutrición y Ajustes aún no existen; el diseño los muestra pero no hay flujos detrás.
- **Reemplazo:** Crear las rutas/vistas de Nutrición y Ajustes y convertir esos `q-tab` en `q-route-tab`, y dar comportamiento al `action` del `StatCard`.
- **Estado:** Resuelto. Las cuatro pestañas son `q-route-tab`; el `+` de "Peso medio" abre `WeightLogDialog` (módulo `measurements`).

## Entrenamiento en vivo: cierre de sesión y metadatos de rutina (Slice C parcial)

- **Qué:** Ya están: registro de series por swipe (desliza derecha→izquierda en el detalle de la rutina → diálogo peso/reps → `ExerciseSet` en la sesión "de hoy"), timer de descanso regresivo, el punto verde/rojo por ejercicio (24h), y el **detalle de ejercicio** (resumen de rendimiento con deltas vs sesión anterior + historial por día). **Falta:** cierre explícito de sesión / `completedAt` / duración; derivar "Realizada hace X días · 65 min" en las cards de rutina y el estado "EN PROGRESO"; el swipe inverso (izquierda→derecha = eliminar ejercicio de la rutina).
- **Por qué:** La sesión es por día (sin botón finalizar): las series del mismo día se acumulan en la sesión de esa fecha; un día sin series nuevas cierra la sesión implícitamente.
- **Reemplazo:** Derivar metadatos de sesión (última fecha, duración) para las cards de rutina; agregar el swipe de borrado de ejercicio en el detalle de rutina.
- **Estado:** Resuelto (sesión sin cierre explícito por diseño). `routineSessionMeta` deriva "Realizada hace X días · N min" + estado "EN PROGRESO" (en `RoutineCard`/`RoutineDetailPage`); la duración se estima del lapso entre series. Swipe der→izq elimina el ejercicio; editar/eliminar serie registrada vía `SetEditDialog`. No hay botón "Finalizar"; `completedAt` queda para una futura UX de cierre.

## Pestañas Nutrición y Ajustes sin ruta

- **Qué:** En `AppTabBar` "Entreno" (`/entreno`) y "Progreso" (`/progreso`) navegan vía `q-route-tab`; "Nutrición" y "Ajustes" siguen siendo `q-tab` sin ruta.
- **Por qué:** Esos módulos/vistas aún no existen.
- **Reemplazo:** Crear sus rutas/vistas y convertirlos en `q-route-tab`.
- **Estado:** Resuelto. `/nutricion` y `/ajustes` existen y sus pestañas son `q-route-tab`.

## "Agregar actividad" (gasto calórico) sin implementar

- **Qué:** En `NutritionPage` la sección "Actividad" muestra un empty state y el botón "Añadir actividad" solo notifica "próximamente"; no persiste nada.
- **Por qué:** El gasto calórico por actividad no existe en los tipos de `nutrition` ni en el dashboard; se dejó fuera de alcance para no introducir un concepto a medias (decisión D2 del spec de 2026-06-24).
- **Reemplazo:** Definir una entidad de actividad (tipo, calorías quemadas, duración), su adapter/use-cases/store y un form; restar el gasto del balance energético del día si aplica.
- **Estado:** Pendiente.

## Volumen de Progreso usa nombre de ejercicio como `type`

- **Qué:** `getProgressInput` arma `SessionVolume.type` con el **nombre del ejercicio**, porque `Exercise` no tiene taxonomía de grupo muscular. El filtro "Tipo" de la pantalla de Progreso lista ejercicios, no grupos (Torso/Pierna…).
- **Por qué:** No existe un campo de categoría/grupo muscular en `Exercise`; el diseño de Visily muestra grupos, pero no hay datos para derivarlos.
- **Reemplazo:** Agregar `category`/`muscleGroup` a `Exercise` (con UI para asignarlo) y usarlo como `type` del volumen.
- **Estado:** Pendiente.

## Plataforma Android de Capacitor sin reconfigurar

- **Qué:** Tras migrar de Quasar CLI a Vite + `@quasar/vite-plugin`, Capacitor se maneja con su propia CLI (`capacitor.config.ts` en la raíz, `webDir: dist`). La plataforma Android todavía no está agregada en la raíz del repo; el `src-capacitor/` que gestionaba Quasar (con `appId com.crisg0510.icar`, `webDir www` y su carpeta `android/`) quedó huérfano.
- **Por qué:** La migración cambió la ubicación y el modo de gestionar Capacitor; re-agregar la plataforma requiere el Android SDK instalado.
- **Reemplazo:** Ejecutar `npx cap add android` en la raíz (con Android SDK disponible), verificar `pnpm build && pnpm cap:sync` y `pnpm cap:android`, y luego eliminar el `src-capacitor/` huérfano.
- **Estado:** Pendiente.
