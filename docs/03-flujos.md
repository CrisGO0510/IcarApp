# Flujos de Usuario – IcarApp

## 🎯 Objetivo del Documento
Definir los flujos principales de interacción del usuario dentro del MVP
de IcarApp, considerando un modelo de uso local sin autenticación,
priorizando la sencillez, la versatilidad y el acceso inmediato.

---

## 👤 Actor Principal
- Usuario

---

## 🚀 Flujo 1: Inicio de la Aplicación

### Descripción
Permite al usuario acceder directamente a la aplicación sin procesos
de registro o autenticación.

### Flujo
Inicio de la aplicación  
→ Carga de datos locales  
→ Dashboard principal  

---

## 🏠 Flujo 2: Dashboard Principal

### Descripción
Punto central de la aplicación desde donde el usuario accede a
entrenamiento y nutrición, y visualiza un resumen general del día.

### Flujo
Dashboard  
→ Resumen diario (entrenamiento y nutrición)  
→ Acceso a módulo de entrenamiento  
→ Acceso a módulo de nutrición  

---

## 🏋️ Flujo 3: Gestión de Entrenamientos

### Descripción
Permite al usuario registrar, consultar y modificar su entrenamiento
de forma completamente local.

### Flujo
Dashboard  
→ Módulo de entrenamiento  
→ Lista de rutinas  
→ Seleccionar rutina  
→ Ver ejercicios del día  
→ Registrar series y repeticiones  
→ Guardar entrenamiento  
→ Visualizar progreso  

---

## 🧱 Flujo 4: Registro de Rutina

### Descripción
Creación y edición de rutinas personalizadas.

### Flujo
Módulo de entrenamiento  
→ Crear / editar rutina  
→ Definir nombre de la rutina  
→ Agregar ejercicios  
→ Ordenar ejercicios  
→ Guardar rutina  

---

## 📝 Flujo 5: Registro de Ejercicio y Series

### Descripción
Registro detallado del desempeño en cada ejercicio.

### Flujo
Rutina activa  
→ Seleccionar ejercicio  
→ Registrar series  
→ Definir repeticiones, peso y notas  
→ Guardar cambios  
→ Volver a la rutina  

---

## ⏱️ Flujo 6: Uso del Contador de Tiempo

### Descripción
Permite al usuario controlar tiempos de descanso o ejecución durante
el entrenamiento.

### Flujo
Rutina activa  
→ Activar contador  
→ Configurar tiempo  
→ Iniciar / pausar / reiniciar  
→ Finalizar y volver al entrenamiento  

---

## 📊 Flujo 7: Visualización de Progreso de Entrenamiento

### Descripción
Visualización del historial y progreso del entrenamiento almacenado
localmente.

### Flujo
Módulo de entrenamiento  
→ Sección de progreso  
→ Seleccionar ejercicio o rango de fechas  
→ Visualizar gráficas  
→ Comparar registros  

---

## 🍽️ Flujo 8: Configuración Nutricional

### Descripción
Configuración local de valores base para cálculos nutricionales.

### Flujo
Dashboard  
→ Módulo de nutrición  
→ Configuración  
→ Definir calorías de mantenimiento  
→ Definir objetivos de macronutrientes  
→ Guardar configuración  

---

## 🥗 Flujo 9: Registro de Comidas

### Descripción
Registro local y flexible de comidas y macronutrientes.

### Flujo
Módulo de nutrición  
→ Día actual  
→ Agregar comida  
→ Definir calorías y macros  
→ Guardar comida  
→ Ver totales del día  

---

## 📈 Flujo 10: Visualización Nutricional

### Descripción
Visualización del consumo diario y comparativa con objetivos,
utilizando datos locales.

### Flujo
Módulo de nutrición  
→ Seleccionar día  
→ Visualizar totales diarios  
→ Comparar con objetivos  
→ Consultar días anteriores  

---

## ✏️ Flujo 11: Edición Libre de Registros

### Descripción
Permite modificar cualquier registro almacenado localmente sin
restricciones.

### Flujo
Cualquier módulo  
→ Seleccionar registro  
→ Editar valores  
→ Guardar cambios  
→ Actualizar visualización  

---

## 🧠 Consideraciones de Producto

- La aplicación no requiere conexión a internet para funcionar
- Todos los datos se almacenan localmente
- El usuario tiene control total sobre su información
- No existen flujos bloqueantes ni procesos obligatorios

---

## ✅ Criterio de Completitud de Flujos

Los flujos se consideran completos cuando:
- El usuario puede acceder a la app inmediatamente
- Puede registrar y editar entrenamientos y nutrición
- Puede visualizar su progreso de forma clara
- Puede usar la app completamente offline
