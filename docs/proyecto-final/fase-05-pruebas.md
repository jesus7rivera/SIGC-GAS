# Fase 5 - Pruebas de Software

## 1. Introducción

La presente fase organiza y clasifica las pruebas realizadas sobre
SIGC-GAS.

Para la evaluación del sistema se consideran cuatro niveles:

- Pruebas unitarias.
- Pruebas de integración.
- Pruebas del sistema.
- Pruebas de aceptación.

Cada nivel permite evaluar el software desde una perspectiva
diferente.

---

# 2. Estrategia general de pruebas

La estrategia utilizada en SIGC-GAS combina pruebas automatizadas
y pruebas manuales.

| Nivel | Herramienta principal | Estado |
|---|---|---|
| Unitarias | Node Test Runner | Implementadas |
| Integración | Scripts API + MongoDB de pruebas | Implementadas |
| Sistema | Selenium WebDriver | Implementadas |
| Aceptación | Pruebas manuales basadas en escenarios | Ejecutadas y formalizadas |

Las pruebas automatizadas se ejecutan sobre un entorno de pruebas
independiente utilizando la base:

sigc_gas_test

Esto permite evitar modificaciones accidentales sobre los datos
del entorno normal del sistema.

---

# 3. Pruebas unitarias

## 3.1 Objetivo

Las pruebas unitarias verifican unidades pequeñas de lógica de
forma aislada.

En SIGC-GAS se utilizan principalmente para comprobar la lógica
interna del chatbot y sus componentes asociados.

## 3.2 Componentes evaluados

El backend contiene pruebas relacionadas con:

- chatbotCore.
- entityExtractor.
- chatbotService.
- chatbotQueryService.
- chatbotRepository.
- chatbotApplicationService.
- chatbotValidationMiddleware.
- chatbotController.
- clientListing.
- activeLoans.
- overdueLoans.
- inactiveClients.
- riskSummary.

El frontend también contiene pruebas del contexto conversacional
del chatbot.

## 3.3 Comandos

Backend:

npm --prefix backend run test:chatbot-unit

Frontend:

npm --prefix frontend run test:chatbot-context

## 3.4 Evidencias conocidas

La última ejecución de las pruebas de contexto del frontend
obtuvo:

- 10 pruebas ejecutadas.
- 10 pruebas aprobadas.
- 0 pruebas fallidas.

## 3.5 Estado

Implementadas.

Los resultados definitivos del backend serán registrados durante
la ejecución formal de evidencias.

---

# 4. Pruebas de integración

## 4.1 Objetivo

Las pruebas de integración verifican la interacción entre varios
componentes del sistema.

En SIGC-GAS estas pruebas comprueban principalmente la integración
entre:

API REST
+
Controladores
+
Reglas de negocio
+
MongoDB
+
Autenticación y autorización

## 4.2 Scripts existentes

El backend contiene los siguientes scripts:

- securityApiTests.js
- usuarioSeguridadApiTests.js
- validationApiTests.js
- businessRulesApiTests.js
- chatbotApiTests.js

## 4.3 Comandos

npm --prefix backend run test:security-api

npm --prefix backend run test:usuarios-seguridad-api

npm --prefix backend run test:validation-api

npm --prefix backend run test:business-rules-api

npm --prefix backend run test:chatbot-api

## 4.4 Aspectos evaluados

Las pruebas permiten verificar aspectos como:

- Autenticación.
- Autorización por roles.
- Respuestas HTTP 401 y 403.
- Bloqueo temporal de cuentas.
- Desbloqueo administrativo.
- Restablecimiento de contraseñas.
- Validaciones de datos.
- Reglas de negocio.
- Consultas del chatbot.
- Persistencia en MongoDB.

## 4.5 Seguridad del entorno de pruebas

Los scripts de seguridad utilizan:

sigc_gas_test

y contienen verificaciones para evitar su ejecución accidental
contra la base de datos normal.

## 4.6 Estado

Implementadas.

Las pruebas de seguridad API y gestión de usuarios han obtenido
resultado PASS en las últimas ejecuciones.

---

# 5. Pruebas del sistema

## 5.1 Objetivo

Las pruebas del sistema verifican SIGC-GAS como una aplicación
completa desde la perspectiva del usuario.

Estas pruebas utilizan Selenium WebDriver para interactuar con el
frontend, que a su vez se comunica con el backend y MongoDB.

Por lo tanto se evalúa el flujo completo:

Navegador
→ Frontend React
→ API Express
→ MongoDB

## 5.2 Casos Selenium actuales

| Código | Caso de prueba | Resultado actual |
|---|---|---|
| CP-001 | Login correcto como Administrador | PASS |
| CP-002 | Login incorrecto | PASS |
| CP-003 | Operador no accede a Clientes | PASS |
| CP-004 | CRUD de Cliente | PASS |
| CP-006 | Movimiento cambia estado del cilindro | PASS |
| CP-007 | Ciclo de mantenimiento | PASS |
| CP-008 | Bloqueo temporal de cuenta | PASS |
| CP-009 | Gestión segura de usuarios | PASS |

## 5.3 Resultado general

Última batería ejecutada:

8 casos ejecutados
8 casos aprobados
0 casos fallidos

Tasa de éxito:

(8 / 8) x 100 = 100 %

## 5.4 Comando

npm --prefix pruebas-selenium run test:ci

## 5.5 Evidencias

Las pruebas generan capturas de pantalla que pueden ser utilizadas
como evidencia del comportamiento del sistema.

Entre las evidencias se encuentran pruebas de:

- Autenticación.
- Seguridad por rol.
- Gestión de clientes.
- Estados de cilindros.
- Mantenimiento.
- Bloqueo de cuenta.
- Gestión de usuarios.

## 5.6 Estado

Implementadas y automatizadas.

---

# 6. Pruebas de aceptación

## 6.1 Objetivo

Las pruebas de aceptación permiten determinar si las funciones
principales satisfacen las necesidades operativas definidas para
SIGC-GAS.

A diferencia de las pruebas técnicas automatizadas, estas pruebas
se realizan desde el punto de vista funcional del usuario.

## 6.2 Criterio de resultado

Cada escenario será clasificado como:

- Aceptado.
- No aceptado.

Una prueba será aceptada cuando el resultado obtenido coincida con
el comportamiento esperado.

---

# 7. Casos de aceptación propuestos

## PA-01 - Inicio de sesión del Administrador

Actor:

Administrador.

Procedimiento:

1. Ingresar correo válido.
2. Ingresar contraseña válida.
3. Seleccionar iniciar sesión.

Resultado esperado:

El sistema permite el ingreso y muestra el Dashboard.

Estado:

APROBADO.

---

## PA-02 - Restricción del Operador

Actor:

Operador.

Procedimiento:

1. Iniciar sesión como Operador.
2. Revisar el menú.
3. Intentar ingresar manualmente a /usuarios.

Resultado esperado:

El Operador no visualiza Gestión de Usuarios y no puede acceder
directamente al módulo.

Estado:

APROBADO.

---

## PA-03 - Registro de cliente

Actor:

Administrador.

Procedimiento:

1. Ingresar a Clientes.
2. Registrar un nuevo cliente.
3. Buscar el cliente registrado.

Resultado esperado:

El cliente es almacenado y aparece en la tabla de resultados.

Estado:

APROBADO.

---

## PA-04 - Préstamo y devolución de cilindro

Actor:

Administrador u Operador.

Procedimiento:

1. Seleccionar un cilindro disponible.
2. Registrar una salida.
3. Verificar el nuevo estado.
4. Registrar la devolución.

Resultado esperado:

Después de la salida el cilindro aparece Prestado.

Después de la devolución aparece Disponible.

Estado:

APROBADO.

---

## PA-05 - Ciclo de mantenimiento

Actor:

Administrador u Operador.

Procedimiento:

1. Seleccionar un cilindro disponible.
2. Registrar inicio de mantenimiento.
3. Verificar el estado.
4. Registrar fin de mantenimiento.

Resultado esperado:

El cilindro cambia a Mantenimiento y posteriormente vuelve a
Disponible.

Estado:

APROBADO.

---

## PA-06 - Bloqueo por intentos fallidos

Actor:

Usuario del sistema.

Procedimiento:

1. Ingresar una contraseña incorrecta cinco veces.
2. Intentar iniciar sesión nuevamente.

Resultado esperado:

La cuenta queda temporalmente bloqueada después del quinto intento.

Estado:

APROBADO.

---

## PA-07 - Recuperación administrativa de cuenta

Actor:

Administrador.

Procedimiento:

1. Ingresar a Gestión de Usuarios.
2. Seleccionar una cuenta bloqueada.
3. Desbloquear la cuenta.
4. Restablecer su contraseña.
5. Comprobar el acceso con la contraseña nueva.

Resultado esperado:

La cuenta vuelve al estado Activo y permite iniciar sesión con la
nueva contraseña.

Estado:

APROBADO.

---

## PA-08 - Consulta mediante chatbot

Actor:

Administrador u Operador.

Procedimiento:

1. Abrir el chatbot.
2. Realizar una consulta operativa válida.
3. Revisar la respuesta.

Ejemplos:

- Cilindros prestados.
- Clientes sin actividad.
- Resumen de riesgos.

Resultado esperado:

El chatbot interpreta la consulta y presenta información
relacionada con los datos registrados en el sistema.

Estado:

APROBADO.

---

# 8. Matriz de pruebas y funcionalidades

| Funcionalidad | Unitarias | Integración | Sistema | Aceptación |
|---|---|---|---|---|
| Login | - | Sí | Sí | PA-01 |
| Autorización por rol | - | Sí | Sí | PA-02 |
| Clientes | - | Sí | Sí | PA-03 |
| Cilindros | - | Sí | Sí | PA-04 / PA-05 |
| Movimientos | - | Sí | Sí | PA-04 / PA-05 |
| Bloqueo de cuenta | - | Sí | Sí | PA-06 |
| Gestión de usuarios | - | Sí | Sí | PA-07 |
| Chatbot | Sí | Sí | Parcial | PA-08 |

---

# 9. Relación con requisitos no funcionales

Las pruebas también proporcionan evidencia para diferentes RNF.

| Evidencia | RNF relacionados |
|---|---|
| CP-003 | RNF-SEG-04, RNF-USA-03 |
| CP-008 | RNF-SEG-01, RNF-SEG-02 |
| CP-009 | RNF-SEG-04, RNF-USA-03 |
| API Security Tests | RNF de Seguridad |
| ESLint | RNF-MAN-01 |
| Pruebas de aceptación | RNF de Usabilidad y Confiabilidad |

Las pruebas de rendimiento con JMeter y el análisis estático con SonarQube ya fueron incorporados y documentados como parte de la evaluación de calidad del sistema.

---

# 10. Resultado actual de la Fase 5

Actualmente SIGC-GAS cuenta con:

- Pruebas unitarias automatizadas.
- Pruebas de integración automatizadas.
- 8 casos Selenium de sistema.
- Pruebas de aceptación ejecutadas y formalizadas (PA-01 a PA-08).

Las pruebas de aceptación PA-01 a PA-08 fueron ejecutadas formalmente y documentadas mediante evidencias en la Fase 09.

---

# 11. Conclusión

SIGC-GAS dispone de una estrategia de pruebas que cubre diferentes
niveles del software.

Las pruebas unitarias evalúan principalmente la lógica del chatbot.

Las pruebas de integración verifican la interacción entre API,
reglas de negocio y base de datos.

Selenium permite evaluar el sistema completo desde la interfaz.

Finalmente, los escenarios de aceptación permitirán determinar si
las funciones principales satisfacen el comportamiento esperado
desde la perspectiva del usuario.