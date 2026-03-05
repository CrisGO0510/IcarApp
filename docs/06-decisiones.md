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

---

## ADR-003 – Arquitectura en Capas con Separación de Responsabilidades

### Contexto

Se busca mantener claridad estructural y evitar acoplamientos entre interfaz y persistencia.

### Decisión

Se adopta una arquitectura en capas:

* Presentation Layer
* State Layer (Pinia)
* Domain / Services
* Repository Layer
* SQLite Adapter

### Justificación

* Facilita mantenimiento.
* Permite escalar el proyecto sin reestructuración profunda.
* Evita que componentes ejecuten SQL.
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

### Contexto

El modelo de datos puede evolucionar con el tiempo.

### Decisión

Se implementará un sistema básico de versionado de esquema mediante:

* Tabla `schema_version`
* Archivos de migración numerados
* Ejecución automática al iniciar la aplicación

### Justificación

* Permite modificar estructura sin perder datos.
* Alinea el proyecto con prácticas profesionales.
* Facilita mantenimiento a largo plazo.

### Consecuencias

* Requiere disciplina al modificar el modelo.
* Incrementa complejidad inicial mínima.

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
