# Fase 6 - Automatización de Pruebas

## 1. Introducción

La Fase 6 evalúa SIGC-GAS mediante herramientas de automatización.

Se utilizan dos herramientas principales:

- Selenium WebDriver para pruebas funcionales del sistema.
- Apache JMeter para pruebas de rendimiento y carga.

Las pruebas se ejecutan utilizando un entorno independiente para
evitar afectar los datos normales de la aplicación.

Base de datos de pruebas:

sigc_gas_test

---

# 2. Automatización funcional con Selenium

## 2.1 Objetivo

Selenium permite automatizar acciones realizadas normalmente por
un usuario desde el navegador.

Las pruebas recorren el frontend React y validan la interacción
completa con:

- Frontend.
- Backend.
- API.
- MongoDB.
- Autenticación.
- Reglas de negocio.

---

## 2.2 Casos Selenium implementados

| Código | Caso | Resultado |
|---|---|---|
| CP-001 | Login correcto como Administrador | PASS |
| CP-002 | Login incorrecto | PASS |
| CP-003 | Operador no accede a Clientes | PASS |
| CP-004 | CRUD de Cliente | PASS |
| CP-006 | Movimiento cambia estado del cilindro | PASS |
| CP-007 | Ciclo de mantenimiento | PASS |
| CP-008 | Bloqueo temporal de cuenta | PASS |
| CP-009 | Gestión segura de usuarios | PASS |

---

## 2.3 Resultado general de Selenium

Total de casos ejecutados:

8

Casos aprobados:

8

Casos fallidos:

0

Tasa de éxito:

(8 / 8) x 100 = 100 %

---

## 2.4 Ejecución

La batería completa puede ejecutarse mediante:

npm --prefix pruebas-selenium run test:ci

---

## 2.5 Funcionalidades verificadas

Las pruebas Selenium validan:

- Inicio de sesión correcto.
- Rechazo de credenciales incorrectas.
- Restricción de opciones según rol.
- Restricción de acceso directo mediante URL.
- Registro, búsqueda, edición y eliminación de clientes.
- Cambio de estado de cilindros.
- Salida y devolución de cilindros.
- Inicio y fin de mantenimiento.
- Bloqueo después de cinco intentos fallidos.
- Rechazo de contraseña correcta mientras existe bloqueo.
- Desbloqueo administrativo.
- Restablecimiento de contraseña.
- Restricción del módulo Usuarios para el rol Operador.

---

## 2.6 RNF relacionados con Selenium

Las pruebas aportan evidencia principalmente para:

- RNF-SEG-01.
- RNF-SEG-02.
- RNF-SEG-04.
- RNF-USA-03.
- RNF-USA-04.

---

# 3. Pruebas de carga con Apache JMeter

## 3.1 Objetivo

Apache JMeter se utiliza para evaluar el comportamiento de
SIGC-GAS ante múltiples usuarios y solicitudes concurrentes.

Las pruebas permiten obtener:

- Tiempo promedio.
- Tiempo mínimo.
- Tiempo máximo.
- Mediana.
- Percentil 90.
- Percentil 95.
- Percentil 99.
- Throughput.
- Número de errores.
- Porcentaje de errores.

---

## 3.2 Entorno utilizado

Versión de JMeter:

Apache JMeter 5.6.3

Entorno Java:

OpenJDK 8 - Temurin

Backend de pruebas:

http://127.0.0.1:5001

Base de datos:

sigc_gas_test

Las pruebas de carga fueron ejecutadas mediante JMeter en modo
CLI o Non-GUI.

La interfaz gráfica fue utilizada únicamente para diseñar y
depurar los planes.

---

# 4. Autenticación utilizada por JMeter

Para acceder a recursos protegidos se implementó el siguiente
flujo:

1. JMeter realiza POST /api/auth/login.
2. El backend devuelve un JWT.
3. JSON Extractor obtiene $.token.
4. El token es almacenado en la variable ${token}.
5. Las siguientes solicitudes utilizan:

Authorization: Bearer ${token}

Este procedimiento permite simular correctamente usuarios
autenticados.

---

# 5. Prueba de carga Login + Dashboard

## 5.1 Flujo

Cada usuario virtual ejecuta:

1. Login Administrador.
2. Extracción del JWT.
3. Consulta de Dashboard.

---

## 5.2 Comparación 10 vs 20 usuarios

Para hacer válida la comparación se conservaron las mismas
condiciones y únicamente se modificó la cantidad de usuarios.

Configuración común:

- Ramp-up: 1 segundo.
- Loop Count: 20.
- Login + Dashboard.

### Resultados

| Métrica | 10 usuarios | 20 usuarios |
|---|---:|---:|
| Solicitudes | 400 | 800 |
| Fallos | 0 | 0 |
| Error % | 0.00 % | 0.00 % |
| Promedio | 225.37 ms | 496.22 ms |
| p95 | 389.60 ms | 732.00 ms |
| p99 | 456.97 ms | 894.81 ms |
| Máximo | 464 ms | 1075 ms |
| Throughput | 40.83 req/s | 38.93 req/s |

---

## 5.3 Resultados específicos con 20 usuarios

### Login Administrador

| Métrica | Resultado |
|---|---:|
| Muestras | 400 |
| Error % | 0.00 % |
| Promedio | 466.05 ms |
| p95 | 682.95 ms |
| p99 | 782.00 ms |
| Máximo | 981 ms |
| Throughput | 19.48 req/s |

### Dashboard Administrador

| Métrica | Resultado |
|---|---:|
| Muestras | 400 |
| Error % | 0.00 % |
| Promedio | 526.38 ms |
| p95 | 772.65 ms |
| p99 | 922.88 ms |
| Máximo | 1075 ms |
| Throughput | 19.56 req/s |

---

## 5.4 Interpretación

Al aumentar la cantidad de usuarios de 10 a 20 se observó un
incremento en los tiempos de respuesta.

El p95 total pasó de:

389.60 ms

a:

732.00 ms

A pesar del incremento de carga, no se registraron errores HTTP
atribuibles al sistema.

El p95 permaneció por debajo de los límites establecidos en los
requisitos no funcionales.

El throughput no aumentó al duplicar la cantidad de usuarios,
pasando de 40.83 a 38.93 solicitudes por segundo.

Este comportamiento constituye un hallazgo de rendimiento que
puede ser considerado en futuras optimizaciones.

---

# 6. Prueba de registro de cilindros

## 6.1 Objetivo

Esta prueba permite evaluar una operación que realiza escritura
real sobre MongoDB.

El flujo utilizado fue:

1. Login Administrador.
2. Extracción del JWT.
3. Generación de código único para cilindro.
4. POST /api/cilindros.
5. Extracción del identificador generado por MongoDB.
6. DELETE /api/cilindros/:id.

La eliminación permite evitar acumulación de registros temporales
en la base de pruebas.

---

## 6.2 Configuración

- Usuarios concurrentes: 20.
- Ramp-up: 1 segundo.
- Loop Count: 20.
- Operaciones por ciclo: 3.
- Solicitudes totales: 1200.

---

## 6.3 Resultados generales

| Métrica | Resultado |
|---|---:|
| Solicitudes | 1200 |
| Fallos | 0 |
| Error % | 0.00 % |
| Promedio | 308.35 ms |
| p95 | 477.95 ms |
| p99 | 625.98 ms |
| Máximo | 691 ms |
| Throughput | 62.58 req/s |

---

## 6.4 Resultados de Crear Cilindro

| Métrica | Resultado |
|---|---:|
| Muestras | 400 |
| Fallos | 0 |
| Error % | 0.00 % |
| Promedio | 266.89 ms |
| Mínimo | 7 ms |
| Máximo | 448 ms |
| Mediana | 271 ms |
| p90 | 373 ms |
| p95 | 392 ms |
| p99 | 431 ms |
| Throughput | 20.97 operaciones/s |

---

## 6.5 Evaluación

RNF-REN-03 establece:

p95 <= 3 segundos con 20 usuarios concurrentes.

Resultado:

p95 = 392 ms

Equivalente:

0.392 segundos

Por lo tanto:

RNF-REN-03 = CUMPLE.

---

# 7. RNF evaluados mediante JMeter

| RNF | Criterio | Resultado | Estado |
|---|---|---|---|
| RNF-REN-01 | p95 <= 2 s con 20 usuarios | Dashboard p95 = 772.65 ms | Cumple |
| RNF-REN-02 | Login p95 <= 2 s | 682.95 ms | Cumple |
| RNF-REN-03 | Registro p95 <= 3 s | 392 ms | Cumple |
| RNF-REN-04 | Error < 5 % | 0.00 % | Cumple |
| RNF-ESC-01 | 20 usuarios con error < 5 % | 0.00 % | Cumple |
| RNF-ESC-02 | p95 <= 3 s con 20 usuarios | 732 ms total | Cumple |

---

# 8. Evidencia de disponibilidad durante las pruebas

Durante la prueba de registro se ejecutaron:

1200 solicitudes

Resultado:

1200 solicitudes procesadas
0 fallos
0.00 % de errores

Esto constituye evidencia de que, durante la ventana de prueba y
con MongoDB disponible, la API permaneció operativa.

Este resultado no debe interpretarse como un SLA de producción,
ya que la evaluación fue realizada en un entorno local y durante
una ventana limitada.

---

# 9. Archivos JMeter

Los planes de prueba se almacenan dentro de:

pruebas-jmeter/planes/

Los resultados generados se almacenan dentro de:

pruebas-jmeter/resultados/

Los archivos .jmx constituyen los scripts reproducibles de las
pruebas de carga.

---

# 10. Buenas prácticas aplicadas

Las pruebas de carga se ejecutaron mediante modo CLI.

View Results Tree fue utilizado solamente durante la depuración y
fue deshabilitado durante las pruebas de carga.

Las operaciones de escritura fueron realizadas sobre
sigc_gas_test.

Los registros temporales generados durante la carga fueron
eliminados automáticamente.

---

# 11. Resultado de la Fase 6

Selenium:

8 de 8 casos aprobados.

JMeter:

Prueba Login + Dashboard con 20 usuarios:
0.00 % errores.

Prueba de registro de cilindros:
1200 solicitudes y 0.00 % errores.

Los RNF de rendimiento evaluados mediante JMeter cumplen los
criterios establecidos para el entorno de prueba utilizado.

---

# 12. Conclusión

La automatización permitió obtener evidencia funcional y
cuantitativa sobre SIGC-GAS.

Selenium comprobó el comportamiento del sistema desde la
perspectiva del usuario.

JMeter permitió evaluar tiempos de respuesta, percentiles,
throughput y errores bajo concurrencia.

Los resultados demuestran que SIGC-GAS mantiene tiempos de
respuesta dentro de los criterios definidos para las cargas
evaluadas, aunque se observó un incremento de latencia cuando se
duplicó la cantidad de usuarios concurrentes.