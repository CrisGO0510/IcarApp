# 06 - Decisiones Arquitectónicas

Este documento registra las decisiones técnicas y arquitectónicas relevantes del proyecto IcarApp.

El objetivo es:

* Documentar el contexto en el que se tomaron decisiones.
* Justificar técnicamente cada elección.
* Facilitar mantenimiento y evolución futura.
* Evitar rediscusión innecesaria de temas ya definidos.

Cada decisión sigue un formato simplificado inspirado en Architecture Decision Records (ADR).

---

## ADR-001 – Aplicación Offline-First

### Contexto

La aplicación busca simplicidad, acceso gratuito y disponibilidad inmediata sin depender de servicios externos ni infraestructura adicional.

### Decisión

La aplicación será completamente funcional sin conexión a internet.
No se implementará backend ni sincronización en la fase MVP.

### Justificación

* Reduce complejidad técnica inicial.
* Elimina costos de infraestructura.
* Aumenta velocidad de desarrollo.
* Garantiza acceso permanente a los datos del usuario.
* Se alinea con la visión de simplicidad y libertad.

### Consecuencias

* No existe respaldo automático en la nube.
* No hay sincronización entre dispositivos.
* Futuras integraciones requerirán diseño adicional.

---

## ADR-002 – Uso de SQLite como Base de Datos Local

> **Estado: Reemplazada por ADR-008.**

### Contexto

La aplicación requiere persistencia estructurada para entrenamiento y nutrición, con relaciones claras entre entidades.

Alternativas consideradas:

* LocalStorage
* IndexedDB
* Archivos JSON

### Decisión

Se utilizará SQLite como motor de persistencia local a través de Capacitor.

### Justificación

* Soporta modelo relacional normalizado.
* Permite migraciones de esquema.
* Escala mejor con grandes volúmenes de datos.
* Facilita futura migración conceptual a backend relacional.
* Es estándar en aplicaciones móviles reales.

### Consecuencias

* Mayor complejidad inicial comparado con LocalStorage.
* Necesidad de gestionar migraciones.
* Requiere encapsulamiento adecuado del acceso a datos.

### Motivo del reemplazo

El soporte de SQLite en browser (vía `jeep-sqlite` + WASM) introdujo fricción significativa en el dev loop (carga de WASM, paths de assets, MIME types). Se priorizó tener un único adapter cross-platform y una forma de persistencia que mimetice respuestas HTTP de cara a un futuro backend. Ver ADR-008.

---

## ADR-003 – Arquitectura en Capas con Separación de Responsabilidades

### Contexto

Se busca mantener claridad estructural y evitar acoplamientos entre interfaz y persistencia.

### Decisión

Se adopta una arquitectura en capas:

* Presentation Layer
* State Layer (Pinia)
* Domain / Use Cases
* Repository Layer
* JSON Storage Adapter (Capacitor Preferences)

### Justificación

* Facilita mantenimiento.
* Permite escalar el proyecto sin reestructuración profunda.
* Evita que componentes accedan al storage directamente.
* Permite reemplazar la fuente de datos en el futuro.

### Consecuencias

* Incrementa número de archivos.
* Requiere disciplina en separación de responsabilidades.
* Aumenta ligeramente la complejidad conceptual del proyecto.

---

## ADR-004 – Uso de UUID como Identificador Primario

### Contexto

Existe posibilidad futura de sincronización o backend remoto.

Alternativa considerada:

* IDs autoincrementales.

### Decisión

Se utilizarán identificadores UUID como clave primaria en todas las entidades principales.

### Justificación

* Permite generación de IDs sin dependencia de servidor.
* Evita colisiones en sincronización futura.
* Facilita replicación y migración de datos.

### Consecuencias

* IDs menos legibles manualmente.
* Ligero incremento en tamaño de almacenamiento.

---

## ADR-005 – Sin Autenticación en el MVP

### Contexto

La aplicación es de uso personal y opera completamente en local.

### Decisión

No se implementará autenticación de usuario en la fase MVP.

### Justificación

* No existe backend.
* Los datos son locales.
* Reduce complejidad.
* Acelera desarrollo.

### Consecuencias

* No existe protección de acceso más allá del dispositivo.
* No hay soporte multiusuario.

---

## ADR-006 – Control de Versiones del Esquema (Migraciones)

> **Estado: Modificada (ver ADR-008 para el enfoque actual basado en JSON).**

### Contexto

El modelo de datos puede evolucionar con el tiempo.

### Decisión original (SQLite)

Sistema básico de versionado de esquema mediante tabla `schema_version` y archivos de migración numerados ejecutados al iniciar.

### Decisión actual (JSON / Preferences)

Sin schema rígido, la evolución se maneja en la capa de deserialización:

* Campo opcional `schemaVersion` en entidades cuando deba diferenciarse de versiones previas.
* `JsonRepository.deserialize` normaliza al cargar (defaults para campos nuevos, renombrar claves obsoletas).
* Migraciones destructivas se ejecutan una sola vez al iniciar, gobernadas por la clave `icarapp:schema_version` en Preferences.

### Justificación

* Permite modificar estructura sin perder datos.
* Adecuado para evolución lenta del esquema sin la complejidad de un motor SQL.

### Consecuencias

* Requiere disciplina al modificar el modelo.
* Las normalizaciones residen en código y deben mantenerse junto al tipo.

---

## ADR-007 – Organización Modular por Dominio

### Contexto

La aplicación se divide en dos módulos principales: Entrenamiento y Nutrición.

### Decisión

El código se organizará por dominio funcional:

* workout
* nutrition
* shared

Cada dominio contendrá:

* store
* service
* repository (si aplica)
* modelos relacionados

### Justificación

* Facilita escalabilidad.
* Reduce acoplamiento entre módulos.
* Permite crecimiento independiente.

### Consecuencias

* Estructura más extensa.
* Requiere disciplina organizacional.

---

## ADR-008 – Persistencia local con JSON sobre Capacitor Preferences

### Contexto

ADR-002 estableció SQLite como motor de persistencia. Al habilitar el browser como plataforma de uso, el plugin `@capacitor-community/sqlite` requiere `jeep-sqlite` + WASM (sql.js), lo que introduce:

* Carga adicional de assets (`sql-wasm.wasm`, ~660KB) con paths sensibles.
* Fricción en el dev loop (MIME types, fallback SPA del dev server).
* Dos rutas de inicialización (web vs nativo) en el adapter.

Adicionalmente, está previsto un backend REST en el futuro. Modelar la persistencia local con la misma forma que tendrá la respuesta del endpoint reduce el costo de la migración.

### Decisión

Se reemplaza SQLite por un **adapter JSON sobre `@capacitor/preferences`**:

* Cada colección se guarda como un array JSON bajo una clave de Preferences (ej. `icarapp:user_profile`).
* `JsonRepository<T>` provee CRUD genérico (`create`, `findById`, `findAll`, `update`, `delete`, `count`) con soft-delete vía `deletedAt`.
* Los repositorios concretos extienden la clase y solo declaran `storageKey`.
* Mismo port `Repository<T>` que ya consumían los use cases — sin cambios upstream.

### Justificación

* `@capacitor/preferences` provee la misma API en web (localStorage) y nativo (NSUserDefaults / SharedPreferences). Un solo adapter, cero branching por plataforma.
* La forma de los documentos JSON imita la respuesta esperada del backend; el futuro `HttpRepository<T>` será un drop-in sobre el mismo port.
* Elimina dependencias pesadas (sql.js, jeep-sqlite, plugin SQLite de Capacitor) y los assets WASM asociados.
* Adecuado para el volumen esperado del MVP (cientos de sets, comidas, sesiones).

### Consecuencias

* Sin queries SQL: el filtrado y los joins se hacen en memoria sobre los arrays cargados.
* La capacidad de almacenamiento queda acotada por el backend de Preferences (en web ≈ 5MB de localStorage). Para el dominio actual no es restrictivo.
* La evolución del esquema se gestiona en código (deserializadores y migraciones puntuales), no en archivos SQL — ver ADR-006.

---

## ADR-009 – Comidas guardadas del usuario (reversa parcial de "sin catálogo de alimentos")

### Contexto

El 2026-07-10 se decidió que no habría catálogo de alimentos: toda comida se ingresa
manualmente con sus macros. En el uso real, el registro diario repite casi siempre las
mismas comidas, y re-tipear macros cada vez contradice el requerimiento de Simplicidad
de Uso.

### Decisión

Se introduce una biblioteca personal de **comidas guardadas** (`SavedMeal`): macros
normalizados por 100 g y una equivalencia opcional de gramos por unidad, con registro
rápido por gramos o por unidades. Se mantiene fuera de alcance el catálogo precargado,
las marcas y los códigos de barras: solo existen comidas creadas por el propio usuario.

### Justificación

* Experiencia de usuario: el registro repetido pasa de re-tipear 4-5 valores a elegir
  una comida y una cantidad.
* La normalización por 100 g reusa el mismo mecanismo de escalado de la pestaña
  "Calcular" (`scaleMealFromReference`), sin lógica nueva de conversión.
* La entrada registrada (`MealEntry`) no cambia de forma: los totales del día, el
  progreso y el backup quedan intactos.

### Consecuencias

* Nueva clave de persistencia `icarapp:saved_meals` (incluida automáticamente en el
  backup por prefijo).
* La decisión de 2026-07-10 queda acotada: sigue sin haber catálogo *precargado*, pero
  sí reutilización de comidas propias.

---

## Revisión de Decisiones

Este documento podrá actualizarse cuando:

* Se agregue backend.
* Se implemente sincronización.
* Se modifique el modelo de datos significativamente.
* Se introduzcan nuevas tecnologías clave.

Las decisiones previas no deben eliminarse, solo marcarse como:

* Reemplazada
* Obsoleta
* Modificada
