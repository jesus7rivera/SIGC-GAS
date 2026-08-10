# Fase 07 – Análisis estático con SonarQube

## 1. Objetivo

Realizar un análisis estático del código fuente del sistema SIGC-GAS utilizando SonarQube, con el propósito de identificar problemas relacionados con seguridad, confiabilidad, mantenibilidad, complejidad, duplicación, cobertura y deuda técnica.

## 2. Herramienta utilizada

- Herramienta: SonarQube Community Build
- Proyecto: SIGC-GAS
- Project Key: sigc-gas
- Scanner: SonarScanner mediante @sonar/scan
- Lenguajes principales analizados: JavaScript, JSX y CSS
- Código analizado:
  - backend/src
  - frontend/src

## 3. Estado inicial del análisis

El primer análisis realizado en SonarQube presentó los siguientes resultados:

| Métrica | Resultado inicial |
|---|---:|
| Líneas de código | 9,144 |
| Issues abiertos | 60 |
| Security Issues | 3 |
| Security Rating | C |
| Reliability Issues | 30 |
| Reliability Rating | D |
| Maintainability Issues | 28 |
| Maintainability Rating | A |
| Impactos High | 4 |
| Duplicación | 3.1 % |
| Deuda técnica | 2 h 24 min |
| Debt Ratio | 0.1 % |
| Complejidad ciclomática | 785 |
| Complejidad cognitiva | 405 |
| Cobertura | 0.0 % |

## 4. Hallazgos de seguridad

SonarQube identificó inicialmente tres incidencias de seguridad:

1. Exposición implícita de información del framework Express mediante el encabezado X-Powered-By.
2. Configuración de CORS que requería restringir explícitamente los orígenes permitidos.
3. Uso de Math.random() para la generación de identificadores del chatbot.

Se aplicaron las siguientes mejoras:

- Desactivación del encabezado X-Powered-By.
- Configuración explícita del origen permitido mediante CORS.
- Sustitución de Math.random() por crypto.randomUUID().

Después del reanálisis:

- Security Issues: 0
- Security Rating: A

## 5. Corrección de incidencias de severidad High

Inicialmente se identificaron cuatro impactos de severidad High.

Las principales acciones realizadas fueron:

- Uso explícito de localeCompare() para ordenar campos.
- Mejora del middleware global de errores.
- Eliminación de usos innecesarios del operador void.
- Refactorización del clasificador de intenciones del chatbot.

La función principal del clasificador presentaba una complejidad cognitiva de 30, superando el límite de 15 definido por SonarQube.

La lógica fue dividida en funciones más pequeñas y una colección de reglas de intención, conservando el orden y comportamiento original.

Después de las modificaciones se ejecutaron nuevamente 142 pruebas automatizadas del chatbot, obteniendo:

- Pruebas ejecutadas: 142
- Pruebas aprobadas: 142
- Pruebas fallidas: 0

El nuevo análisis mostró:

- Impactos High: 0
- Reliability Rating: C
- Maintainability Rating: A

## 6. Cobertura de código

Inicialmente SonarQube mostraba 0.0 % de cobertura debido a que todavía no se había importado un reporte de cobertura.

Se utilizó el test runner de Node.js para generar un reporte LCOV mediante las pruebas automatizadas del backend.

El archivo generado fue:

backend/coverage/lcov.info

Posteriormente se configuró SonarQube mediante:

sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info

Resultados obtenidos:

### Código nuevo

| Métrica | Resultado |
|---|---:|
| Coverage | 97.2 % |
| Lines to Cover | 347 |
| Uncovered Lines | 9 |
| Line Coverage | 97.4 % |
| Condition Coverage | 95.7 % |
| Duplications | 0.0 % |

### Código global

| Métrica | Resultado |
|---|---:|
| Coverage | 70.7 % |
| Lines to Cover | 3,894 |
| Uncovered Lines | 1,177 |
| Line Coverage | 69.8 % |
| Condition Coverage | 81.7 % |

La cobertura del código nuevo superó el umbral mínimo de 80 % requerido por el Quality Gate.

## 7. Métricas posteriores a la segunda ronda de mejora

| Métrica | Resultado |
|---|---:|
| Security Issues | 0 |
| Security Rating | A |
| Reliability Issues | 1 |
| Reliability Rating | B |
| Maintainability Issues | 25 |
| Maintainability Rating | A |
| Impactos High | 0 |
| Impactos Medium | 13 |
| Impactos Low | 13 |
| Duplicación | 3.1 % |
| Deuda técnica | 1 h 54 min |
| Overall Coverage | 70.7 % |
| Line Coverage | 69.8 % |
| Condition Coverage | 81.7 % |
| New Code Coverage | 97.2 % |
| New Code Line Coverage | 97.4 % |
| New Code Condition Coverage | 95.7 % |
| Quality Gate | PASSED |

### Segunda ronda de mejora

Durante una segunda ronda de correcciones se atendieron incidencias repetitivas de confiabilidad relacionadas con:

- botones HTML sin atributo `type` explícito;
- etiquetas de formularios no asociadas con sus controles;
- expresiones regulares con riesgo de backtracking y rendimiento superlineal.

Después de aplicar las modificaciones, compilar el frontend y ejecutar las pruebas API correspondientes, los issues de confiabilidad disminuyeron de 29 a 1 y la calificación de Reliability mejoró de C a B.

### Cierre de incidencias de confiabilidad

Se atendió la última incidencia de confiabilidad detectada por SonarQube, relacionada con espaciado ambiguo en un componente React.

Después de compilar nuevamente el frontend y ejecutar un nuevo análisis estático, se obtuvo:

- Reliability Issues: 0
- Reliability Rating: A
- Remediation Effort: 0

De esta manera, la confiabilidad evolucionó de una calificación inicial D con 30 incidencias a una calificación final A sin incidencias abiertas.

## 8. Comparación antes y después

| Métrica | Inicial | Final |
|---|---:|---:|
| Security Issues | 3 | 0 |
| Security Rating | C | A |
| Reliability Issues | 30 | 29 |
| Reliability Rating | D | C |
| Maintainability Issues | 28 | 25 |
| Issues abiertos | 60 | 53 |
| High | 4 | 0 |
| Deuda técnica | 2 h 24 min | 1 h 54 min |
| Complejidad cognitiva | 405 | 390 |
| Cobertura | 0.0 % | 70.7 % |
| New Code Coverage | 0.0 % | 97.2 % |

## 9. Interpretación

El análisis estático permitió identificar problemas reales en el código y aplicar mejoras verificables.

Se eliminaron todos los hallazgos de seguridad y todos los impactos de severidad High. Además, se redujo la deuda técnica, disminuyó la complejidad cognitiva y mejoró la calificación de confiabilidad.

La cobertura del código nuevo alcanzó 97.2 %, superando el umbral del 80 % establecido por el Quality Gate.

El Quality Gate finalmente obtuvo el estado PASSED.

## 10. Trabajo pendiente

El sistema todavía presenta incidencias Medium y Low relacionadas principalmente con:

- accesibilidad de formularios;
- botones sin atributo type explícito;
- expresiones regulares con posible backtracking;
- ternarios anidados;
- selectores CSS duplicados;
- optimizaciones de React;
- contraste visual.

Estas incidencias serán evaluadas según su prioridad y costo de corrección como parte del plan de mejora y tratamiento de deuda técnica.

## 11. Estado final de la auditoría estática

Después de las diferentes rondas de análisis, corrección, pruebas y reanálisis, SIGC-GAS obtuvo un Quality Gate PASSED.

Los resultados finales fueron:

- Security Rating: A, con 0 incidencias.
- Reliability Rating: A, con 0 incidencias.
- Maintainability Rating: A, con 24 incidencias residuales.
- Blocker: 0.
- High: 0.
- Medium: 12.
- Low: 12.
- Deuda técnica: 1 h 49 min.
- Debt Ratio: 0.0 %.
- Complejidad ciclomática: 793.
- Complejidad cognitiva: 390.
- Cobertura global: 70.7 %.
- Cobertura de código nuevo: 97.2 %.
- Duplicación global: 3.1 %.

Las 24 incidencias restantes corresponden a mejoras de mantenibilidad de severidad Medium y Low. Debido a que no existen incidencias Blocker ni High, y la calificación de mantenibilidad es A, estas observaciones se registran como deuda técnica residual y serán incorporadas al plan de mejora del sistema.