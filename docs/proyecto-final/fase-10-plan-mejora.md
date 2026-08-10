# Fase 10 - Plan de mejora

## 1. Objetivo

Definir un plan de mejora para el sistema SIGC-GAS a partir de los resultados obtenidos durante la auditoría integral de calidad.

El plan considera las incidencias detectadas mediante pruebas automatizadas, análisis estático, pruebas de carga y revisión del código fuente, diferenciando las mejoras que ya fueron implementadas de aquellas que constituyen deuda técnica o trabajo futuro.

---

## 2. Criterios de priorización

Las mejoras se clasifican considerando:

- Impacto sobre la calidad del sistema.
- Riesgo para seguridad y confiabilidad.
- Esfuerzo estimado de implementación.
- Urgencia.
- Beneficio técnico.
- Dependencias con otros componentes.

Se utilizan las siguientes prioridades:

| Prioridad | Interpretación |
|---|---|
| Crítica | Debe corregirse inmediatamente por afectar seguridad o funcionamiento |
| Alta | Debe atenderse en el corto plazo |
| Media | Mejora importante pero no bloquea el funcionamiento actual |
| Baja | Optimización o evolución futura |

---

## 3. Correcciones realizadas durante la auditoría

Durante el proyecto final se identificaron incidencias que fueron corregidas antes del cierre de la auditoría.

| ID | Hallazgo | Acción realizada | Prioridad | Estado |
|---|---|---|---|---|
| PM-01 | Exposición del encabezado `X-Powered-By` | Se deshabilitó el encabezado desde Express | Alta | Corregido |
| PM-02 | Configuración CORS demasiado permisiva | Se restringió el origen mediante `CORS_ORIGIN` | Alta | Corregido |
| PM-03 | Generación de identificadores mediante `Math.random()` | Se reemplazó por `crypto.randomUUID()` | Alta | Corregido |
| PM-04 | Ausencia de bloqueo ante intentos consecutivos de autenticación | Se implementó bloqueo después de 5 intentos fallidos durante 5 minutos | Crítica | Corregido |
| PM-05 | Falta de mecanismo administrativo para recuperar usuarios bloqueados | Se implementó desbloqueo y restablecimiento seguro de contraseña | Alta | Corregido |
| PM-06 | Riesgo de expresiones regulares con backtracking innecesario | Se modificó la validación de correo electrónico | Alta | Corregido |
| PM-07 | Incidencias de confiabilidad detectadas por SonarQube | Se corrigieron todas las incidencias de confiabilidad | Alta | Corregido |
| PM-08 | Botones sin tipo explícito | Se agregó `type="button"` donde correspondía | Media | Corregido |
| PM-09 | Etiquetas de formularios sin asociación explícita | Se agregaron identificadores y asociaciones entre `label` y controles | Media | Corregido |
| PM-10 | Manejo mejorable de errores HTTP | Se refactorizó el middleware global de errores | Alta | Corregido |

---

## 4. Refactorizaciones realizadas

### 4.1 Clasificador de intenciones del chatbot

El archivo `intentClassifier.js` presentaba una concentración elevada de condiciones lógicas.

Se realizó una refactorización mediante:

- separación de condiciones en funciones auxiliares;
- definición de constantes;
- agrupación de reglas;
- uso de una estructura de reglas de intención;
- reducción de complejidad cognitiva.

La funcionalidad existente fue conservada y posteriormente validada mediante las pruebas automatizadas del chatbot.

### 4.2 Middleware de errores

El middleware global de errores fue ajustado para:

- controlar correctamente respuestas cuyos encabezados ya fueron enviados;
- utilizar `next(error)` cuando corresponde;
- registrar información útil del método y ruta que originan el error;
- evitar código innecesario.

### 4.3 Validaciones

Se mejoraron las validaciones utilizadas por el sistema con el propósito de reducir riesgos señalados por el análisis estático y mantener reglas más claras y mantenibles.

---

## 5. Deuda técnica pendiente

Aunque los problemas críticos y de alta severidad fueron corregidos, la auditoría identificó mejoras que no impiden actualmente el funcionamiento del sistema.

Los resultados finales de SonarQube muestran:

| Métrica | Resultado |
|---|---|
| Security Rating | A |
| Reliability Rating | A |
| Maintainability Rating | A |
| Blocker | 0 |
| High | 0 |
| Medium | 12 |
| Low | 12 |
| Deuda técnica estimada | 1 h 49 min |
| Debt Ratio | 0.0 % |
| Complejidad ciclomática | 793 |
| Complejidad cognitiva | 390 |
| Duplicación | 3.1 % |
| Cobertura global | 70.7 % |
| Cobertura de código nuevo | 97.2 % |
| Quality Gate | PASSED |

Las incidencias restantes corresponden principalmente a mantenibilidad y no representan defectos críticos de seguridad o confiabilidad.

---

## 6. Plan de reducción de deuda técnica

| ID | Mejora propuesta | Área | Prioridad | Esfuerzo estimado | Estado |
|---|---|---|---|---|---|
| PM-11 | Simplificar estructuras condicionales y ternarios anidados restantes | Frontend / Backend | Media | Bajo | Pendiente |
| PM-12 | Revisar estructuras de datos sugeridas por SonarQube en validaciones del chatbot | Backend | Media | Bajo | Pendiente |
| PM-13 | Reducir selectores CSS duplicados | Frontend | Media | Bajo | Pendiente |
| PM-14 | Revisar contraste y accesibilidad adicional de la barra lateral | Frontend | Media | Bajo | Pendiente |
| PM-15 | Aplicar memoización únicamente donde genere beneficio medible | Frontend | Baja | Bajo | Pendiente |
| PM-16 | Reducir duplicación global por debajo del valor actual de 3.1 % cuando sea técnicamente conveniente | General | Baja | Medio | Pendiente |
| PM-17 | Incrementar progresivamente la cobertura global de pruebas | Backend / Frontend | Media | Medio | Pendiente |

---

## 7. Mejoras de rendimiento

Durante el proceso de compilación del frontend se detectó que el bundle principal supera los 500 KB.

También se identificó que el archivo del logotipo corporativo posee un tamaño superior a 2 MB.

Estas situaciones no provocaron fallos funcionales, pero representan oportunidades de optimización.

| ID | Mejora propuesta | Beneficio | Prioridad | Estado |
|---|---|---|---|---|
| PM-18 | Implementar división de código mediante carga diferida de módulos | Reducir el tamaño inicial descargado por el navegador | Media | Pendiente |
| PM-19 | Optimizar y comprimir el logotipo corporativo | Reducir transferencia de recursos estáticos | Media | Pendiente |
| PM-20 | Analizar dependencias incluidas en el bundle | Eliminar código innecesario | Media | Pendiente |
| PM-21 | Aplicar lazy loading en módulos que no son necesarios durante el inicio | Mejorar tiempo de carga inicial | Media | Pendiente |

Las pruebas realizadas con JMeter demostraron que el backend mantiene tiempos de respuesta adecuados bajo los escenarios evaluados, por lo que estas acciones se orientan principalmente a la optimización del frontend y recursos estáticos.

---

## 8. Mejoras de arquitectura

### 8.1 Modularización del frontend

Se propone continuar separando componentes de gran tamaño en componentes y hooks especializados.

Esto permitiría:

- reducir acoplamiento;
- facilitar pruebas unitarias;
- mejorar la legibilidad;
- simplificar mantenimiento.

### 8.2 Servicios independientes

La capa de servicios debe continuar utilizándose como punto de comunicación entre los componentes React y la API.

Debe evitarse incluir lógica de acceso HTTP directamente dentro de componentes visuales.

### 8.3 Configuración centralizada

Las variables relacionadas con:

- API;
- CORS;
- base de datos;
- autenticación;
- ambientes de pruebas;

deben permanecer externalizadas mediante variables de entorno y no incorporarse directamente al código fuente.

### 8.4 Observabilidad

Como mejora futura se recomienda incorporar un mecanismo estructurado de registro de eventos y errores que permita analizar:

- errores de aplicación;
- intentos de autenticación;
- bloqueos de usuarios;
- tiempos de respuesta;
- fallos en operaciones críticas.

### 8.5 Despliegue

El sistema actualmente ha sido validado principalmente en ambientes locales y de pruebas.

Como evolución futura se propone definir ambientes diferenciados:

`desarrollo -> pruebas -> producción`

con configuraciones independientes y un proceso de despliegue controlado.

---

## 9. Módulos pendientes de integración

Durante la revisión del sistema se identificaron los archivos asociados a:

- Reportes.
- Configuraciones.

Sin embargo, estos módulos no forman parte actualmente de las rutas funcionales principales del sistema.

Se recomienda adoptar una de las siguientes decisiones antes de una versión productiva:

1. completar su implementación e integración;
2. eliminarlos temporalmente del código productivo si no serán utilizados.

Mantener componentes sin integración definida aumenta la cantidad de código que debe mantenerse y puede generar confusión durante futuras modificaciones.

---

## 10. Mejoras de seguridad futuras

El sistema dispone actualmente de:

- autenticación mediante usuario y contraseña;
- almacenamiento de contraseñas con hash;
- roles;
- autorización;
- bloqueo por intentos fallidos;
- desbloqueo administrativo;
- restablecimiento de contraseña;
- restricciones de rutas;
- configuración CORS;
- validaciones de entrada.

Como evolución futura pueden evaluarse:

| Mejora | Prioridad |
|---|---|
| Autenticación de dos factores (2FA) para administradores | Media |
| Expiración y renovación controlada de sesiones | Media |
| Auditoría persistente de accesos administrativos | Media |
| Políticas configurables de contraseña | Media |
| Alertas ante múltiples bloqueos o intentos sospechosos | Baja |

Estas medidas se consideran propuestas futuras y no deben presentarse como funcionalidades actualmente implementadas.

---

## 11. Mejora de pruebas

El proyecto dispone de pruebas unitarias, pruebas API, Selenium, JMeter y análisis estático.

Como evolución del esquema de pruebas se propone:

| Mejora | Objetivo | Prioridad |
|---|---|---|
| Aumentar cobertura del frontend | Evaluar componentes actualmente no cubiertos | Media |
| Mantener pruebas para nuevas reglas de negocio | Evitar regresiones | Alta |
| Incorporar casos límite adicionales | Aumentar confiabilidad | Media |
| Ejecutar periódicamente pruebas JMeter | Detectar degradaciones de rendimiento | Media |
| Mantener Selenium dentro del pipeline | Detectar regresiones funcionales | Alta |

---

## 12. Mejora del proceso CI/CD

La integración continua mediante GitHub Actions permite ejecutar actualmente:

`Frontend -> Backend -> Selenium -> SonarQube`

Como mejoras posteriores se recomienda:

- conservar el Quality Gate como criterio de aceptación;
- mantener secretos fuera del repositorio;
- revisar periódicamente dependencias;
- conservar artefactos de evidencia;
- incorporar despliegue automatizado únicamente cuando exista un ambiente de producción definido.

El despliegue automático no se implementa actualmente debido a que el proyecto no dispone todavía de un ambiente productivo formal.

---

## 13. Hoja de ruta de mejora

### Corto plazo

- Reducir incidencias Medium y Low de mantenibilidad.
- Optimizar el logotipo.
- Aplicar división del bundle del frontend.
- Revisar código duplicado.
- Incrementar cobertura en módulos relevantes.

### Mediano plazo

- Mejorar observabilidad.
- Integrar o retirar Reportes y Configuraciones.
- Ampliar pruebas del frontend.
- Ejecutar pruebas de rendimiento periódicamente.
- Implementar auditoría persistente de operaciones administrativas.

### Largo plazo

- Definir infraestructura de producción.
- Implementar una estrategia formal de despliegue.
- Evaluar autenticación de dos factores.
- Incorporar monitoreo operacional.
- Evaluar mecanismos de escalabilidad según el crecimiento real de usuarios.

---

## 14. Matriz consolidada de mejora

| Área | Situación actual | Meta propuesta | Prioridad |
|---|---|---|---|
| Seguridad | Rating A, 0 incidencias | Mantener nivel A | Alta |
| Confiabilidad | Rating A, 0 incidencias | Mantener nivel A | Alta |
| Mantenibilidad | Rating A, 24 incidencias restantes | Reducir progresivamente incidencias | Media |
| Cobertura | 70.7 % global | Aumentar cobertura en módulos críticos | Media |
| Código nuevo | 97.2 % de cobertura | Mantener >= 90 % | Alta |
| Duplicación | 3.1 % | Mantener <= 5 % y reducir cuando sea viable | Media |
| Frontend | Bundle superior a 500 KB | Reducir carga inicial | Media |
| Recursos estáticos | Logo superior a 2 MB | Optimizar tamaño | Media |
| CI/CD | Pipeline funcional | Mantener ejecución automática | Alta |
| Arquitectura | Aplicación modular cliente-servidor | Mejorar separación y observabilidad | Media |

---

## 15. Conclusión

La auditoría permitió identificar y corregir incidencias importantes de seguridad, confiabilidad, validación y mantenibilidad del sistema SIGC-GAS.

Las correcciones implementadas permitieron alcanzar calificaciones A en seguridad, confiabilidad y mantenibilidad, además de un Quality Gate satisfactorio.

El sistema todavía presenta oportunidades de mejora principalmente relacionadas con mantenibilidad, optimización del frontend, reducción progresiva de deuda técnica, cobertura de pruebas y evolución arquitectónica.

El plan propuesto permite abordar estas mejoras de forma priorizada sin confundir funcionalidades ya implementadas con mejoras futuras.

**Estado de la Fase 10: CUMPLE.**