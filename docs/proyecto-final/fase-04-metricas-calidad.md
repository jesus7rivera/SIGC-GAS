# Fase 4 - Métricas de Calidad

## 1. Introducción

La presente fase define las métricas que serán utilizadas para
evaluar cuantitativamente la calidad del sistema SIGC-GAS.

Las métricas permitirán identificar defectos, evaluar la cobertura
de pruebas, analizar la complejidad del código, detectar
duplicidad, estimar mantenibilidad y medir la productividad del
proceso de mejora.

Los valores definitivos serán incorporados después de ejecutar
las herramientas y pruebas correspondientes.

---

# 2. Métricas evaluadas

Las métricas requeridas para el proyecto son:

- Defectos encontrados.
- Defectos críticos.
- Defectos corregidos.
- Cobertura de pruebas.
- Complejidad.
- Complejidad ciclomática.
- Código duplicado.
- Maintainability Index.
- Productividad.

---

# 3. Métricas de defectos

## 3.1 Defectos encontrados

### Definición

Cantidad total de defectos identificados durante las actividades
de prueba, revisión y análisis del sistema.

### Fórmula

Defectos encontrados = Total de defectos registrados

### Fuentes de evidencia

- Pruebas manuales.
- Selenium.
- Pruebas de API.
- ESLint.
- SonarQube.
- JMeter.
- GitHub Actions.

### Resultado

Pendiente de consolidación.

---

## 3.2 Defectos críticos

### Definición

Cantidad de defectos que comprometen funciones esenciales del
sistema, seguridad, integridad de datos o disponibilidad.

### Fórmula

Defectos críticos = Total de defectos clasificados como críticos

### Criterios de clasificación

Un defecto podrá considerarse crítico cuando provoque, por ejemplo:

- Acceso no autorizado.
- Pérdida o corrupción de información.
- Imposibilidad de iniciar sesión.
- Caída completa de una funcionalidad principal.
- Operaciones incorrectas sobre el estado de un cilindro.
- Exposición de información sensible.

### Resultado

Pendiente de consolidación.

---

## 3.3 Defectos corregidos

### Definición

Cantidad de defectos que fueron solucionados después de ser
identificados.

### Fórmula

Defectos corregidos = Total de defectos solucionados

También se calculará:

Tasa de corrección =
(Defectos corregidos / Defectos encontrados) x 100

### Resultado

Pendiente.

---

# 4. Registro preliminar de hallazgos

Durante el desarrollo y las pruebas realizadas previamente se han
identificado diferentes situaciones que pueden utilizarse como
parte del registro de defectos y mejoras.

| ID | Hallazgo | Tipo | Estado |
|---|---|---|---|
| H-01 | Pruebas Selenium dependían de textos y datos demasiado específicos | Mantenibilidad de pruebas | Corregido |
| H-02 | La cuenta no tenía inicialmente control de intentos fallidos de autenticación | Seguridad | Corregido |
| H-03 | No existía recuperación administrativa para cuentas bloqueadas | Seguridad / Usabilidad | Corregido |
| H-04 | El frontend tenía servicios con configuración de API inconsistente | Mantenibilidad / Portabilidad | Corregido |
| H-05 | El build de Vite reporta un bundle JavaScript superior a 500 kB | Rendimiento | Pendiente de mejora |
| H-06 | El logo de CORSURSA posee un tamaño aproximado superior a 2 MB | Rendimiento | Pendiente de optimización |
| H-07 | Existen componentes Reportes.jsx y Configuraciones.jsx no integrados al sistema | Deuda técnica potencial | Pendiente de análisis |

Este registro es preliminar.

Los hallazgos de SonarQube, JMeter y las siguientes pruebas podrán
ampliar esta tabla.

---

# 5. Cobertura de pruebas

## 5.1 Definición

La cobertura representa el grado en que el código y las
funcionalidades del sistema son ejercitados mediante pruebas.

Se distinguirán dos conceptos:

### Cobertura funcional

Relaciona las funcionalidades principales con casos de prueba
ejecutados.

### Cobertura de código

Representa el porcentaje de instrucciones, líneas, ramas o
funciones ejecutadas por pruebas automatizadas.

---

## 5.2 Cobertura funcional

Actualmente SIGC-GAS posee casos Selenium para:

- Login correcto.
- Login incorrecto.
- Restricción de Operador.
- CRUD de clientes.
- Cambio de estado del cilindro.
- Ciclo de mantenimiento.
- Bloqueo temporal de cuenta.
- Gestión segura de usuarios.

También existen pruebas automatizadas de:

- Seguridad de API.
- Validaciones.
- Reglas de negocio.
- Chatbot.
- Contexto conversacional.

### Fórmula propuesta

Cobertura funcional =
(Casos de uso principales con prueba /
Total de casos de uso principales) x 100

### Resultado

Pendiente de cálculo definitivo.

---

## 5.3 Cobertura de código

La cobertura de código deberá obtenerse mediante una herramienta
capaz de medir la ejecución real de las pruebas.

Se buscará obtener como mínimo:

- Cobertura de líneas.
- Cobertura de funciones.
- Cobertura de ramas.

### Resultado

Pendiente.

---

# 6. Complejidad

## 6.1 Definición

La complejidad permite estimar qué tan difícil puede resultar
comprender, probar y mantener una parte del software.

El análisis será realizado principalmente sobre el backend y los
componentes con mayor lógica del frontend.

### Fuente de evidencia

- SonarQube.
- Análisis del código.

### Resultado

Pendiente.

---

# 7. Complejidad ciclomática

## 7.1 Definición

La complejidad ciclomática estima la cantidad de caminos
independientes existentes dentro de una unidad de código.

Una mayor cantidad de condiciones, decisiones y ramificaciones
puede incrementar la complejidad y el esfuerzo necesario para
probar y mantener el código.

### Aspectos a revisar

Se prestará especial atención a:

- Controladores.
- Servicios.
- Lógica del chatbot.
- Reglas de negocio.
- Componentes React con múltiples decisiones.
- Middleware de seguridad.

### Resultado

Pendiente de análisis mediante herramienta.

---

# 8. Código duplicado

## 8.1 Definición

La duplicación mide la cantidad de código repetido dentro del
proyecto.

Un porcentaje elevado puede incrementar el costo de mantenimiento,
debido a que una misma corrección podría necesitar aplicarse en
diferentes lugares.

### Métrica

Porcentaje de código duplicado.

### Criterio definido

RNF-MAN-03 establece como objetivo:

Código duplicado <= 5 %

### Herramienta

SonarQube.

### Resultado

Pendiente.

---

# 9. Maintainability Index

## 9.1 Definición

El Maintainability Index es una métrica utilizada para estimar la
facilidad con la que un sistema puede ser comprendido y
modificado.

Su cálculo puede considerar factores como:

- Complejidad.
- Volumen del código.
- Cantidad de líneas.
- Otros indicadores relacionados con mantenibilidad.

### Método

El valor será obtenido mediante una herramienta compatible o,
cuando corresponda, mediante un cálculo documentado.

No se asignará un valor estimado sin realizar previamente la
medición.

### Resultado

Pendiente.

---

# 10. Productividad

## 10.1 Definición

Para este proyecto, la productividad será analizada como la
capacidad del equipo para implementar y validar mejoras de calidad
durante el proceso de auditoría.

No se utilizará únicamente la cantidad de líneas de código como
indicador, debido a que una mayor cantidad de código no implica
necesariamente mayor productividad.

## 10.2 Indicadores propuestos

Se podrán utilizar:

- Número de hallazgos corregidos.
- Número de pruebas automatizadas implementadas.
- Número de requisitos no funcionales verificados.
- Número de mejoras incorporadas.
- Número de ejecuciones exitosas del pipeline.

### Fórmula complementaria

Productividad de corrección =
Defectos corregidos / periodo de trabajo evaluado

### Resultado

Pendiente de consolidación.

---

# 11. Métricas actuales conocidas

| Métrica | Resultado actual | Fuente |
|---|---|---|
| Casos Selenium | 8 casos automatizados | Selenium |
| Contexto conversacional frontend | 10 pruebas aprobadas | Node Test Runner |
| Pruebas de seguridad API | PASS | Script automatizado |
| Pruebas de gestión segura de usuarios | PASS | Script automatizado |
| Errores ESLint backend | 0 en última validación | ESLint |
| Errores ESLint frontend | 0 en última validación | ESLint |
| Build frontend | Exitoso | Vite |
| Bundle JS principal | Aproximadamente 1.18 MB antes de gzip | Vite build |
| Logo CORSURSA | Aproximadamente 2.18 MB | Vite build |
| Cobertura de código | Pendiente | Herramienta por ejecutar |
| Complejidad ciclomática | Pendiente | SonarQube |
| Código duplicado | Pendiente | SonarQube |
| Maintainability Index | Pendiente | Herramienta por definir |
| Deuda técnica | Pendiente | SonarQube |


## 11.1 Resultados de pruebas de carga con JMeter

Se realizaron pruebas comparables con 10 y 20 usuarios
concurrentes.

En ambas pruebas se utilizó:

- Ramp-up: 1 segundo.
- Loop Count: 20.
- Flujo: Login + Dashboard.
- Backend de pruebas en puerto 5001.
- Base de datos: sigc_gas_test.

### Resultados

| Métrica | 10 usuarios | 20 usuarios |
|---|---:|---:|
| Solicitudes | 400 | 800 |
| Error % | 0.00 % | 0.00 % |
| Tiempo promedio | 225.37 ms | 496.22 ms |
| p95 | 389.60 ms | 732.00 ms |
| p99 | 456.97 ms | 894.81 ms |
| Tiempo máximo | 464 ms | 1075 ms |
| Throughput | 40.83 req/s | 38.93 req/s |

### Interpretación

Al duplicar la cantidad de usuarios de 10 a 20, el tiempo de
respuesta aumentó.

El promedio pasó de 225.37 ms a 496.22 ms y el percentil 95 pasó
de 389.60 ms a 732.00 ms.

A pesar del incremento de latencia, ambas pruebas mantuvieron una
tasa de errores de 0.00 %.

Con 20 usuarios concurrentes el percentil 95 permaneció por
debajo de 1 segundo, por lo que los criterios definidos para
rendimiento y escalabilidad se cumplen en este escenario.

El throughput no aumentó al duplicar la concurrencia, pasando de
40.83 a 38.93 solicitudes por segundo.

Este comportamiento será registrado como un hallazgo de
rendimiento para futuras pruebas y optimizaciones.

## 11.2 Prueba de operación de registro

Se realizó una segunda prueba de carga orientada a evaluar una
operación con escritura en la base de datos.

El flujo ejecutado por cada usuario virtual fue:

1. Inicio de sesión del Administrador.
2. Creación de un cilindro.
3. Eliminación del cilindro creado.

Cada registro utilizó un código de cilindro generado
dinámicamente para evitar conflictos por duplicidad.

El identificador generado por MongoDB fue extraído mediante
JMeter y utilizado posteriormente para eliminar el cilindro,
evitando la acumulación de datos temporales en sigc_gas_test.

### Configuración

- Usuarios concurrentes: 20.
- Ramp-up: 1 segundo.
- Loop Count: 20.
- Base de datos: sigc_gas_test.
- Backend: puerto 5001.
- Solicitudes totales: 1200.

### Resultados generales

| Métrica | Resultado |
|---|---:|
| Solicitudes | 1200 |
| Fallos | 0 |
| Error % | 0.00 % |
| Tiempo promedio | 308.35 ms |
| p95 | 477.95 ms |
| p99 | 625.98 ms |
| Tiempo máximo | 691 ms |
| Throughput | 62.58 solicitudes/s |

### Resultados de Crear Cilindro

| Métrica | Resultado |
|---|---:|
| Muestras | 400 |
| Fallos | 0 |
| Error % | 0.00 % |
| Tiempo promedio | 266.89 ms |
| Mínimo | 7 ms |
| Máximo | 448 ms |
| Mediana | 271 ms |
| p90 | 373 ms |
| p95 | 392 ms |
| p99 | 431 ms |
| Throughput | 20.97 operaciones/s |

### Evaluación de RNF-REN-03

El criterio definido establece:

p95 <= 3 segundos con 20 usuarios concurrentes.

El resultado obtenido para la operación Crear Cilindro fue:

p95 = 392 ms = 0.392 segundos.

Por lo tanto:

RNF-REN-03 = CUMPLE.

La prueba también registró una tasa de errores de 0.00 %, lo que
refuerza el cumplimiento de RNF-REN-04.
---

# 12. Herramientas y métricas relacionadas

| Herramienta | Métricas / evidencias |
|---|---|
| Selenium | Casos funcionales y fallos funcionales |
| Node Test Runner | Resultados de pruebas automatizadas |
| ESLint | Problemas estáticos de código |
| SonarQube | Bugs, vulnerabilidades, code smells, complejidad, duplicación y deuda técnica |
| JMeter | Tiempo de respuesta, throughput, errores y comportamiento bajo carga |
| GitHub Actions | Ejecuciones exitosas o fallidas del pipeline |
| Git / GitHub | Historial de correcciones y trazabilidad |
| Vite | Tamaño de artefactos generados |

---

# 13. Evidencias que deberán recopilarse

Durante las siguientes fases se deberán conservar evidencias de:

1. Resultados de SonarQube.
2. Resultados de JMeter.
3. Resultados de Selenium.
4. Resultados de pruebas automatizadas.
5. Ejecuciones de GitHub Actions.
6. Build de producción.
7. Hallazgos detectados.
8. Correcciones realizadas.

---

# 14. Estado de la Fase 4

La metodología de medición ha sido definida.

Actualmente existen resultados parciales derivados de ESLint,
Selenium, pruebas API y build del frontend.

Las métricas cuantitativas relacionadas con SonarQube, JMeter,
cobertura y Maintainability Index permanecen pendientes hasta la
ejecución de las herramientas correspondientes.

---

# 15. Conclusión

La definición de métricas permite transformar la evaluación de
SIGC-GAS en un proceso cuantificable.

La auditoría no se limitará a determinar si el sistema funciona,
sino que evaluará su calidad mediante defectos, cobertura,
complejidad, duplicidad, mantenibilidad, rendimiento y
productividad.

Los resultados obtenidos posteriormente serán comparados con los
requisitos no funcionales definidos en la Fase 3.