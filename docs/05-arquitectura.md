# 05 - Arquitectura Técnica

## 1. Visión General

IcarApp es una aplicación móvil híbrida desarrollada con:

* Vue 3
* Quasar Framework
* Capacitor
* Capacitor Preferences como almacén local de JSON (web → localStorage, nativo → NSUserDefaults / SharedPreferences)

La aplicación adopta un enfoque **offline-first**, priorizando:

* Versatilidad en cálculos
* Libertad estructural en registros
* Simplicidad de uso
* Acceso gratuito y permanente
* Escalabilidad futura

La arquitectura está diseñada para:

* Separar responsabilidades claramente
* Evitar acoplamientos innecesarios
* Facilitar mantenimiento
* Permitir futura integración con backend sin reescribir el núcleo

---

## 2. Enfoque Arquitectónico

Se adopta una arquitectura en capas simplificada:

```
Presentation Layer
        ↓
State Layer (Pinia)
        ↓
Domain / Business Logic Layer
        ↓
Repository Layer
        ↓
JSON Storage Adapter (Capacitor Preferences)
```

Cada capa tiene responsabilidades claramente definidas.

---

## 3. Capas del Sistema

### 3.1 Presentation Layer (UI)

Ubicación:

```
src/pages/
src/components/
src/layouts/
```

Responsabilidades:

* Renderizar datos
* Gestionar interacción del usuario
* Emitir eventos
* Consumir estado desde Pinia

Restricciones:

* No contiene lógica de negocio
* No ejecuta operaciones de persistencia
* No accede directamente al storage

---

### 3.2 State Layer (Pinia)

Ubicación:

```
src/stores/
```

Responsabilidades:

* Mantener estado reactivo global
* Exponer acciones públicas
* Coordinar operaciones de alto nivel
* Invocar servicios

Ejemplos:

* workout.store.ts
* nutrition.store.ts
* config.store.ts

Restricción:

* No contiene operaciones de persistencia
* No contiene lógica compleja de negocio

---

### 3.3 Domain / Business Logic Layer (Services)

Ubicación:

```
src/services/
```

Responsabilidades:

* Reglas de negocio
* Validaciones
* Cálculos de macros y calorías
* Transformaciones de datos
* Coordinación entre entidades

Ejemplos:

* workout.service.ts
* nutrition.service.ts
* calculation.service.ts

Esta capa contiene la inteligencia real del sistema.

---

### 3.4 Repository Layer

Ubicación:

```
src/repositories/
```

Responsabilidades:

* Encapsular acceso a datos
* Operar sobre colecciones JSON (carga, filtrado, escritura)
* Mapear estructuras serializadas a modelos de dominio (rehidratar `Date`, etc.)

Ejemplos:

* workout.json-repository.ts
* routine.json-repository.ts
* nutrition.json-repository.ts

Principio clave:

> Ninguna otra capa conoce detalles del storage.

Cada repositorio implementa el port `Repository<T>`. La implementación actual (`JsonRepository`) puede reemplazarse por una `HttpRepository` cuando llegue el backend, sin tocar UI, stores ni use cases.

---

### 3.5 JSON Storage Adapter

Ubicación:

```
src/core/repositories/json.repository.ts
```

Responsabilidades:

* Persistir cada entidad como un array JSON bajo una clave de Capacitor Preferences
* Implementar CRUD genérico (`create`, `findById`, `findAll`, `update`, `delete`, `count`)
* Aplicar borrado lógico (`deletedAt`) y filtrarlo en lecturas
* Serializar / deserializar tipos no nativos de JSON (`Date` ↔ ISO string)

Las clases concretas extienden `JsonRepository<T>` y solo declaran su `storageKey`.
El plugin `@capacitor/preferences` provee la misma API en web (localStorage) y nativo (NSUserDefaults / SharedPreferences), eliminando código condicional por plataforma.

---

## 4. Diseño de Persistencia

La aplicación persiste cada entidad como un documento JSON local.

### Principios de diseño:

* Una clave de Preferences por colección (ej. `icarapp:user_profile`, `icarapp:exercises`)
* Cada clave almacena un array de entidades del mismo tipo
* Uso de UUID como identificador primario (`crypto.randomUUID()`)
* Campos de auditoría en cada entidad:

  * createdAt
  * updatedAt
  * deletedAt (opcional, soft delete)
* Las relaciones se modelan por referencia de UUID; los joins se hacen en memoria al nivel de use case
* La forma de los documentos JSON imita la respuesta esperada de un futuro endpoint REST, para que la migración a `HttpRepository` sea mecánica

---

## 5. Modelo de Datos (MVP)

### 5.1 Entrenamiento

Colecciones principales:

* routines
* exercises
* routine_exercises
* workout_sessions
* exercise_sets

Relaciones (por referencia de UUID):

* Una rutina tiene muchos ejercicios
* Una sesión de entrenamiento pertenece a una rutina
* Una sesión contiene múltiples series
* Cada serie pertenece a un ejercicio

---

### 5.2 Nutrición

Colecciones principales:

* macro_goals
* meals
* meal_entries

Relaciones:

* Un día puede tener múltiples comidas
* Una comida puede tener múltiples entradas nutricionales
* Se calcula el total diario a partir de meal_entries

---

## 6. Flujo de Datos

Ejemplo de flujo de registro de una serie:

```
Vue Component
    ↓
workout.store.addSet()
    ↓
addSetUseCase()
    ↓
workout.json-repository.create()
    ↓
JsonRepository (load → mutate → save)
    ↓
Capacitor Preferences (localStorage / NSUserDefaults / SharedPreferences)
```

Luego:

* El store actualiza el estado reactivo
* La UI se actualiza automáticamente

---

## 7. Estrategia de Evolución del Esquema

Sin tablas ni migraciones SQL, la evolución del modelo se maneja al nivel del documento JSON:

* Cada entidad puede incluir un campo opcional `schemaVersion` cuando deba diferenciarse de versiones previas.
* La rehidratación (`deserialize` en `JsonRepository`) puede normalizar campos al cargar — por ejemplo, asignar valores por defecto a propiedades nuevas o renombrar claves obsoletas.
* Una operación destructiva (drop / rename masivo) se materializa como una migración puntual en código que se ejecuta una sola vez al iniciar la app, gobernada por una clave dedicada en Preferences (`icarapp:schema_version`).

Esto es suficiente para un esquema en evolución lenta y mantiene la simplicidad del storage.

---

## 8. Principios Técnicos

1. Separación estricta de responsabilidades
2. Ningún componente accede al storage directamente
3. Ningún store contiene lógica compleja
4. Use cases concentran la lógica del dominio
5. Repositorios encapsulan persistencia
6. Diseño preparado para futura sincronización

---

## 9. Preparación para Backend Futuro

Aunque la aplicación es actualmente offline-only, el diseño considera:

* Identificadores UUID
* Campos de auditoría
* Estructura relacional clara
* Encapsulamiento del acceso a datos

Esto permitirá en el futuro:

* Implementar sincronización
* Migrar a backend REST
* Reemplazar el adapter JSON por un `HttpRepository` sin modificar UI ni lógica de negocio

---

## 10. Nivel de Complejidad

La arquitectura busca equilibrio entre:

* Profesionalismo
* Simplicidad
* Escalabilidad
* Mantenibilidad

No se implementan patrones innecesarios ni sobreingeniería para el MVP.

