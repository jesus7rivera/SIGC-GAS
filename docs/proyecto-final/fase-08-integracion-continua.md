# Fase 08 - Integración Continua con GitHub Actions y SonarQube

## 1. Objetivo

Implementar y validar un proceso de integración continua para el sistema SIGC-GAS utilizando GitHub Actions, de manera que las principales verificaciones de calidad se ejecuten automáticamente antes y después de integrar cambios al repositorio principal.

La integración contempla análisis del frontend, análisis del backend, pruebas automatizadas con Selenium y análisis estático mediante SonarQube.

---

## 2. Herramienta de integración continua

Para la automatización del proceso se utilizó GitHub Actions.

El workflow principal se encuentra en:

`/.github/workflows/calidad.yml`

El flujo se ejecuta ante eventos configurados en el repositorio, incluyendo Pull Requests hacia la rama `main` y cambios integrados a dicha rama.

---

## 3. Etapas del pipeline

El pipeline de calidad quedó compuesto por cuatro jobs principales.

| Job | Función | Resultado |
|---|---|---|
| Analizar y compilar frontend | Ejecuta instalación de dependencias, lint, pruebas del contexto del chatbot y build del frontend | Exitoso |
| Analizar backend | Ejecuta instalación de dependencias, lint y pruebas unitarias del chatbot | Exitoso |
| Ejecutar pruebas Selenium | Ejecuta pruebas API y pruebas funcionales automatizadas del sistema | Exitoso |
| Analizar con SonarQube | Genera cobertura LCOV y realiza análisis estático del código | Exitoso |

La secuencia principal implementada es:

`Frontend + Backend -> Selenium -> SonarQube`

SonarQube se ejecuta solamente cuando las etapas anteriores han finalizado correctamente.

---

## 4. Pruebas automatizadas dentro de CI

El workflow integra diferentes niveles de verificación automatizada.

En el backend se ejecutan pruebas unitarias relacionadas con el chatbot.

Durante el job de Selenium se ejecutan adicionalmente pruebas de:

- seguridad de autenticación;
- validaciones de API;
- reglas de negocio;
- chatbot;
- gestión segura de usuarios;
- pruebas funcionales Selenium.

Las evidencias generadas por Selenium son almacenadas mediante GitHub Actions como artefactos del workflow.

---

## 5. Integración de cobertura

Antes de ejecutar el análisis de SonarQube se genera automáticamente el archivo de cobertura:

`backend/coverage/lcov.info`

Para ello se utiliza el sistema de pruebas integrado de Node.js con cobertura experimental.

El archivo LCOV es posteriormente leído por SonarQube mediante la propiedad:

`sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info`

Esto permite que las métricas de cobertura formen parte del análisis estático del proyecto.

---

## 6. Integración con SonarQube

El proyecto se encuentra configurado mediante el archivo:

`sonar-project.properties`

El identificador utilizado es:

`sonar.projectKey=sigc-gas`

El análisis incluye los directorios:

`backend/src`

`frontend/src`

Se excluyen archivos de pruebas y scripts que no forman parte del código productivo evaluado.

Las credenciales no se almacenan directamente en el repositorio.

GitHub Actions utiliza:

| Tipo | Nombre | Uso |
|---|---|---|
| Repository Secret | `SONAR_TOKEN` | Autenticación segura contra SonarQube |
| Repository Variable | `SONAR_HOST_URL` | Dirección del servidor SonarQube |

El valor del token permanece protegido y no se expone dentro del archivo YAML.

---

## 7. Self-hosted runner

Debido a que el servidor SonarQube utilizado para el proyecto se encuentra instalado localmente, fue necesario configurar un self-hosted runner de GitHub Actions en Windows.

El runner quedó correctamente registrado y conectado al repositorio.

Durante su ejecución se obtuvo:

`Connected to GitHub`

`Current runner version: 2.336.0`

`Listening for Jobs`

El job utiliza la plataforma:

`runs-on: [self-hosted, windows, x64]`

De esta forma GitHub Actions puede enviar el trabajo de análisis a la computadora local donde se encuentra disponible SonarQube.

---

## 8. Validación mediante Pull Request

La integración fue comprobada inicialmente mediante un Pull Request desde la rama:

`proyecto-final-calidad`

hacia:

`main`

Los cuatro jobs del workflow finalizaron correctamente.

El self-hosted runner registró la ejecución del análisis:

`Running job: Analizar con SonarQube`

y posteriormente:

`Job Analizar con SonarQube completed with result: Succeeded`

Por lo tanto, se comprobó que GitHub Actions pudo comunicarse correctamente con el runner Windows y ejecutar el análisis en el servidor SonarQube local.

---

## 9. Validación posterior al Merge

Después de aprobar y fusionar el Pull Request, el workflow volvió a ejecutarse sobre la rama principal.

La ejecución correspondiente al Merge Pull Request #19 presentó los siguientes resultados:

| Elemento | Resultado |
|---|---|
| Rama evaluada | `main` |
| Evento | `push` |
| Estado general | Success |
| Duración total | 3 min 55 s |
| Artefactos generados | 1 |
| Analizar y compilar frontend | Success - 22 s |
| Analizar backend | Success - 19 s |
| Ejecutar pruebas Selenium | Success - 2 min 8 s |
| Analizar con SonarQube | Success - 1 min 11 s |

Esta segunda ejecución demuestra que la versión ya integrada en la rama principal también superó correctamente el pipeline de calidad.

---

## 10. Resultados de SonarQube

Luego de las correcciones realizadas durante la auditoría estática, el proyecto presentó los siguientes indicadores:

| Métrica | Resultado |
|---|---|
| Security Rating | A |
| Incidencias de seguridad | 0 |
| Reliability Rating | A |
| Incidencias de confiabilidad | 0 |
| Maintainability Rating | A |
| Blocker | 0 |
| High | 0 |
| Medium | 12 |
| Low | 12 |
| Deuda técnica | 1 h 49 min |
| Complexity | 793 |
| Cognitive Complexity | 390 |
| Cobertura global | 70.7 % |
| Cobertura de código nuevo | 97.2 % |
| Duplicación | 3.1 % |
| Quality Gate | PASSED |

Las incidencias de mantenibilidad restantes son consideradas deuda técnica no crítica y serán registradas dentro del plan de mejora.

---

## 11. Evidencias

Como evidencias de la implementación se dispone de:

1. Captura de GitHub Actions con los cuatro jobs en estado exitoso.
2. Captura de la ejecución posterior al Merge sobre la rama `main`.
3. Registro del self-hosted runner mostrando `Succeeded`.
4. Dashboard de SonarQube con `Quality Gate PASSED`.
5. Artefactos generados por las pruebas Selenium.
6. Archivo `.github/workflows/calidad.yml`.
7. Archivo `sonar-project.properties`.

---

## 12. Resultado de la fase

La integración continua del sistema SIGC-GAS quedó implementada y validada correctamente.

El pipeline permite automatizar verificaciones del frontend, backend, pruebas funcionales y análisis estático antes de considerar una versión como satisfactoria.

La ejecución exitosa tanto durante el Pull Request como después de su integración a `main` demuestra que el flujo de calidad es reproducible y que los componentes principales del sistema pueden ser verificados automáticamente.

**Estado de la Fase 08: CUMPLE.**