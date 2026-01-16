# Flujos de Usuario – IcarApp

## 🎯 Objetivo del Documento
Definir los flujos principales de interacción del usuario dentro del MVP
de IcarApp, asegurando una experiencia simple, flexible y coherente con
la visión del producto.

Los flujos describen el recorrido lógico del usuario, independientemente
de la implementación visual o técnica.

---

## 👤 Actor Principal
- Usuario

---

## 🔐 Flujo 1: Inicio de la Aplicación

### Descripción
Permite al usuario acceder a la aplicación y a su información personal.

### Flujo
Inicio de la aplicación  
→ Dashboard principal

---

## 🏠 Flujo 2: Dashboard Principal

### Descripción
Punto central de la aplicación desde donde el usuario accede a
entrenamiento y nutrición, y visualiza un resumen general.

### Flujo
Dashboard  
→ Resumen del día (entrenamiento y nutrición)  
→ Acceso a módulo de entrenamiento  
→ Acceso a módulo de nutrición  

---

## 🏋️ Flujo 3: Gestión de Entrenamientos

### Descripción
Permite al usuario registrar, consultar y modificar su entrenamiento.

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
Permite al usuario controlar tiempos de descanso o ejecución.

### Flujo
Rutina activa  
→ Activar contador  
→ Configurar tiempo  
→ Iniciar / pausar / reiniciar  
→ Finalizar y volver al entrenamiento  

---

## 📊 Flujo 7: Visualización de Progreso de Entrenamiento

### Descripción
Visualización del historial y progreso del entrenamiento.

### Flujo
Módulo de entrenamiento  
→ Sección de progreso  
→ Seleccionar ejercicio o rango de fechas  
→ Visualizar gráficas  
→ Comparar registros  

---

## 🍽️ Flujo 8: Configuración Nutricional

### Descripción
Configuración de valores base para cálculos nutricionales.

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
Registro flexible de comidas y macronutrientes.

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
Visualización del consumo diario y comparativa con objetivos.

### Flujo
Módulo de nutrición  
→ Seleccionar día  
→ Visualizar totales diarios  
→ Comparar con objetivos  
→ Consultar días anteriores  

---

## ✏️ Flujo 11: Edición Libre de Registros

### Descripción
Permite modificar cualquier registro sin restricciones.

### Flujo
Cualquier módulo  
→ Seleccionar registro  
→ Editar valores  
→ Guardar cambios  
→ Actualizar visualización  

---

## 🧠 Consideraciones de Producto

- Todos los flujos deben minimizar la cantidad de pasos
- No existen validaciones restrictivas innecesarias
- El usuario siempre puede editar información pasada
- La visualización del progreso es parte esencial del flujo

---

## ✅ Criterio de Completitud de Flujos

Los flujos se consideran completos cuando:
- El usuario puede navegar entre módulos sin fricción
- Puede registrar y editar entrenamientos y nutrición
- Puede visualizar su progreso de forma clara
- Puede usar la app sin bloqueos funcionales
