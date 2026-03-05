# 05 - Arquitectura Técnica

## 1. Visión General

IcarApp es una aplicación móvil híbrida desarrollada con:

* Vue 3
* Quasar Framework
* Capacitor
* SQLite como motor de persistencia local

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
SQLite Adapter
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
* No ejecuta consultas SQL
* No accede directamente a SQLite

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

* No contiene queries SQL
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
* Traducir entidades a SQL
* Ejecutar consultas
* Mapear resultados a modelos de dominio

Ejemplos:

* workout.repository.ts
* routine.repository.ts
* nutrition.repository.ts

Principio clave:

> Ninguna otra capa conoce detalles de SQLite.

Esto permite que en el futuro el repositorio pueda cambiar su implementación hacia una API REST sin afectar el resto del sistema.

---

### 3.5 SQLite Adapter

Ubicación:

```
src/storage/sqlite.adapter.ts
```

Responsabilidades:

* Inicializar la base de datos
* Abrir y cerrar conexiones
* Ejecutar queries genéricas
* Gestionar transacciones
* Ejecutar migraciones

Este adaptador encapsula el uso del plugin de SQLite de Capacitor.

---

## 4. Diseño de Persistencia

La aplicación utiliza SQLite como base de datos local estructurada.

### Principios de diseño:

* Uso de UUID como identificador primario
* Estructura relacional normalizada
* Campos de auditoría:

  * created_at
  * updated_at
  * deleted_at (opcional)
* Separación clara entre entidades

No se almacenan estructuras complejas en JSON embebido.

---

## 5. Modelo de Datos (MVP)

### 5.1 Entrenamiento

Tablas principales:

* routines
* exercises
* routine_exercises
* workout_sessions
* exercise_sets

Relaciones:

* Una rutina tiene muchos ejercicios
* Una sesión de entrenamiento pertenece a una rutina
* Una sesión contiene múltiples series
* Cada serie pertenece a un ejercicio

---

### 5.2 Nutrición

Tablas principales:

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
workout.service.addSetToSession()
    ↓
workout.repository.insertSet()
    ↓
sqlite.adapter.execute()
    ↓
SQLite
```

Luego:

* El store actualiza el estado reactivo
* La UI se actualiza automáticamente

---

## 7. Estrategia de Migraciones

Se implementará control de versiones del esquema.

Elementos requeridos:

* Tabla `schema_version`
* Archivos de migración numerados
* Ejecución automática al iniciar la aplicación

Ejemplo:

* migration_001_init.sql
* migration_002_add_notes.sql

El sistema verificará la versión actual y aplicará migraciones pendientes.

---

## 8. Principios Técnicos

1. Separación estricta de responsabilidades
2. Ningún componente ejecuta SQL directamente
3. Ningún store contiene lógica compleja
4. Servicios concentran la lógica del dominio
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
* Cambiar SQLite por API sin modificar UI ni lógica de negocio

---

## 10. Nivel de Complejidad

La arquitectura busca equilibrio entre:

* Profesionalismo
* Simplicidad
* Escalabilidad
* Mantenibilidad

No se implementan patrones innecesarios ni sobreingeniería para el MVP.

