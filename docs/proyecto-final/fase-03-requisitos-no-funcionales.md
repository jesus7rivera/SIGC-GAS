# Fase 3 - Requisitos No Funcionales

## 1. Introducción

Los requisitos no funcionales definen las características de
calidad que debe cumplir SIGC-GAS.

Para cada requisito se establece:

- Identificador.
- Descripción.
- Métrica.
- Criterio de aceptación.
- Método de verificación.
- Estado de evaluación.

Se han definido 24 requisitos no funcionales distribuidos entre
Seguridad, Rendimiento, Usabilidad, Disponibilidad, Escalabilidad
y Mantenibilidad.

---

# 2. Requisitos de Seguridad

| ID | Requisito | Métrica | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|---|
| RNF-SEG-01 | El sistema deberá bloquear temporalmente una cuenta después de intentos fallidos consecutivos de autenticación. | Número de intentos | Bloqueo al quinto intento fallido | Selenium CP-008 y prueba API | Cumple |
| RNF-SEG-02 | Una cuenta bloqueada deberá permanecer inhabilitada temporalmente. | Duración del bloqueo | 5 minutos | Prueba API de seguridad | Cumple |
| RNF-SEG-03 | Las contraseñas no deberán almacenarse en texto plano. | Tipo de almacenamiento | 100 % de contraseñas almacenadas mediante hash bcrypt | Inspección de MongoDB y prueba API | Cumple |
| RNF-SEG-04 | Las funcionalidades administrativas de gestión de usuarios deberán estar restringidas al rol Administrador. | Accesos autorizados/no autorizados | Administrador obtiene acceso y Operador recibe HTTP 403 | Selenium CP-009 y prueba API | Cumple |

## Justificación

Estos requisitos protegen el acceso al sistema y reducen el riesgo
de utilización no autorizada de funciones administrativas.

SIGC-GAS utiliza autenticación mediante JWT, autorización basada
en roles y hash bcrypt para las contraseñas.

---

# 3. Requisitos de Rendimiento

| ID | Requisito | Métrica | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|---|
| RNF-REN-01 | Las solicitudes principales de consulta de la API deberán responder en un tiempo adecuado bajo carga normal. | Tiempo de respuesta percentil 95 | p95 <= 2 segundos con 20 usuarios concurrentes | JMeter | Cumple |
| RNF-REN-02 | El proceso de autenticación deberá responder dentro de un tiempo aceptable. | Tiempo de respuesta | p95 <= 2 segundos con 20 usuarios concurrentes | JMeter | Cumple |
| RNF-REN-03 | Las operaciones principales de registro deberán mantener un tiempo de respuesta aceptable. | Tiempo de respuesta | p95 <= 3 segundos con 20 usuarios concurrentes | JMeter | Cumple |
| RNF-REN-04 | Las pruebas de carga no deberán generar una tasa elevada de errores HTTP. | Porcentaje de errores | Menos del 5 % de solicitudes fallidas atribuibles al sistema | JMeter | Cumple |

## Observación

Durante el build del frontend se ha detectado una advertencia de
Vite debido a archivos JavaScript superiores a 500 kB.

El bundle principal supera actualmente 1 MB antes de compresión,
por lo que se conserva como un hallazgo de rendimiento
registrado y priorizado en el plan de mejora.

---

# 4. Requisitos de Usabilidad

| ID | Requisito | Métrica | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|---|
| RNF-USA-01 | El sistema deberá informar al usuario cuando una operación se complete correctamente. | Presencia de retroalimentación | Mensaje visible después de operaciones críticas | Prueba manual / Selenium | Cumple parcialmente |
| RNF-USA-02 | Los formularios deberán informar cuando existan datos inválidos u obligatorios faltantes. | Validaciones mostradas | La operación no continúa y se muestra un mensaje comprensible | Pruebas funcionales | Cumple parcialmente |
| RNF-USA-03 | El menú deberá mostrar únicamente las funciones correspondientes al rol autenticado. | Opciones visibles por rol | Operador no visualiza opciones exclusivas del Administrador | Selenium CP-003 y CP-009 | Cumple |
| RNF-USA-04 | Los estados críticos de una cuenta deberán diferenciarse visualmente. | Representación visual | Estados Activo y Bloqueado se muestran de forma claramente diferenciada | Prueba manual / Selenium | Cumple |

## Justificación

La interfaz utiliza tablas, formularios, botones, mensajes,
modales y estados visuales para facilitar la interacción.

El chatbot también complementa la usabilidad al permitir consultas
operativas mediante lenguaje natural.

---

# 5. Requisitos de Disponibilidad

| ID | Requisito | Métrica | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|---|
| RNF-DIS-01 | Durante una prueba continua del sistema, la API deberá permanecer disponible. | Disponibilidad durante prueba | >= 99 % durante una ventana de prueba de 60 minutos | JMeter / monitoreo | No medido formalmente |
| RNF-DIS-02 | El servidor deberá responder correctamente a solicitudes válidas mientras MongoDB se encuentre disponible. | Solicitudes exitosas | >= 95 % de respuestas exitosas durante la prueba definida | JMeter | CUMPLE |
| RNF-DIS-03 | Un error controlado en una solicitud no deberá detener completamente el servidor. | Continuidad del servicio | El servidor continúa atendiendo solicitudes posteriores al error | Prueba de integración/API | CUMPLE |
| RNF-DIS-04 | El pipeline de calidad deberá poder ejecutarse nuevamente después de un fallo de una prueba sin requerir reconstrucción manual del proyecto. | Reejecución del pipeline | Pipeline reproducible mediante GitHub Actions | GitHub Actions | Cumple parcialmente |

## Observación

SIGC-GAS se ejecuta actualmente en un entorno local y no dispone
de infraestructura de alta disponibilidad.

Por esta razón no se define todavía un SLA de producción.

Los criterios anteriores serán utilizados como objetivos de
evaluación dentro del entorno del proyecto.

---

# 6. Requisitos de Escalabilidad

| ID | Requisito | Métrica | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|---|
| RNF-ESC-01 | La API deberá atender múltiples usuarios concurrentes sin pérdida crítica de servicio. | Usuarios concurrentes | 20 usuarios concurrentes con menos del 5 % de errores | JMeter | Cumple |
| RNF-ESC-02 | Al incrementar la carga de 10 a 20 usuarios concurrentes, el sistema deberá mantener tiempos de respuesta aceptables. | Variación de tiempo | p95 <= 3 segundos con 20 usuarios | JMeter | Cumple |
| RNF-ESC-03 | Las consultas principales deberán continuar funcionando al incrementarse el volumen de registros de prueba. | Tiempo de consulta | Consultas principales <= 3 segundos con un conjunto ampliado de datos | JMeter / pruebas API | No medido formalmente |
| RNF-ESC-04 | La arquitectura deberá permitir agregar nuevos módulos sin modificar directamente los módulos de negocio existentes. | Acoplamiento estructural | Nuevas funcionalidades integradas mediante rutas, controladores y servicios independientes | Revisión de arquitectura | Cumple parcialmente |

## Justificación

La separación del frontend, backend, rutas, controladores,
servicios y modelos facilita la ampliación del proyecto.

La capacidad bajo incremento de carga fue evaluada mediante JMeter;
RNF-ESC-03 permanece no medido formalmente porque requiere un conjunto ampliado de datos.

---

# 7. Requisitos de Mantenibilidad

| ID | Requisito | Métrica | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|---|
| RNF-MAN-01 | El código deberá superar el análisis de ESLint antes de integrarse a main. | Errores ESLint | 0 errores | ESLint / GitHub Actions | Cumple |
| RNF-MAN-02 | El código no deberá contener vulnerabilidades críticas o bloqueantes detectadas por el análisis estático definido para el proyecto. | Blocker: 0; High: 0 | 0 issues Blocker y 0 issues High | SonarQube | CUMPLE |
| RNF-MAN-03 | El porcentaje de código duplicado deberá mantenerse dentro de un nivel controlado. | Duplicación global: 3.1 % | <= 5 % | SonarQube | CUMPLE |
| RNF-MAN-04 | La deuda técnica deberá ser identificada y registrada para permitir su priorización. | Deuda técnica detectada | 100 % de los hallazgos relevantes documentados en el plan de mejora | SonarQube y documentación | CUMPLE |

## Evidencias actuales

El proyecto ya utiliza:

ESLint, Git, GitHub, ramas de trabajo, Pull Requests, GitHub
Actions, pruebas API, pruebas unitarias y Selenium.

SonarQube complementó esta evaluación con métricas de
complejidad, duplicación, incidencias y deuda técnica.

---

# 8. Matriz resumen

| Categoría | Cantidad de RNF |
|---|---:|
| Seguridad | 4 |
| Rendimiento | 4 |
| Usabilidad | 4 |
| Disponibilidad | 4 |
| Escalabilidad | 4 |
| Mantenibilidad | 4 |
| **Total** | **24** |

---

# 9. Estado general de evaluación

| Estado | Interpretación |
|---|---|
| Cumple | Existe evidencia suficiente actualmente |
| Cumple parcialmente | Existe implementación, pero falta una validación completa |
| No medido formalmente | No se obtuvo la medición específica requerida |

Los requisitos marcados como No medido formalmente no representan
necesariamente defectos.

Indican que no se obtuvo evidencia cuantitativa suficiente
para determinar su cumplimiento.

---

# 10. Trazabilidad con herramientas

| Herramienta | RNF relacionados principalmente |
|---|---|
| Selenium | Seguridad y Usabilidad |
| Pruebas API | Seguridad, Confiabilidad y Disponibilidad |
| JMeter | Rendimiento, Disponibilidad y Escalabilidad |
| SonarQube | Mantenibilidad y Seguridad |
| ESLint | Mantenibilidad |
| GitHub Actions | Mantenibilidad, Disponibilidad del proceso de calidad |
| MongoDB | Persistencia y validación de seguridad |
| Git/GitHub | Trazabilidad y mantenibilidad |

---

# 11. Conclusión

Se han definido 24 requisitos no funcionales medibles para
SIGC-GAS.

Los requisitos de Seguridad presentan actualmente el mayor nivel
de evidencia debido a las pruebas de autenticación, autorización,
bloqueo temporal y gestión de usuarios.

Los requisitos de Rendimiento y Escalabilidad cuentan con evidencia
obtenida mediante las pruebas de carga realizadas con JMeter. En
Disponibilidad queda sin medición formal únicamente para la prueba continua específica de RNF-DIS-01.

Los requisitos de Mantenibilidad fueron evaluados mediante
SonarQube, ESLint, GitHub Actions y las métricas de calidad del código.

La matriz consolidada permite identificar cuáles requisitos
cumplen, cuáles requieren mejoras y cuáles no fueron medidos
formalmente, además de la deuda técnica y los riesgos residuales del sistema.
