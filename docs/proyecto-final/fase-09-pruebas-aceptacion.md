# Fase 09 - Pruebas de Aceptación

## 1. Objetivo

Validar manualmente que las principales funcionalidades de SIGC-GAS satisfacen los escenarios operativos definidos para los usuarios Administrador y Operador.

Las pruebas fueron realizadas sobre la aplicación web mediante escenarios de aceptación, registrando evidencia gráfica de los resultados obtenidos.

---

## 2. Entorno de ejecución

- Frontend: React + Vite.
- URL del frontend: http://localhost:5173
- Backend de la aplicación: http://localhost:5000
- Tipo de prueba: Manual basada en escenarios.
- Evidencias: Capturas de pantalla almacenadas en `docs/proyecto-final/evidencias/aceptacion`.

---

## 3. Resultados

| ID | Caso de aceptación | Resultado esperado | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|
| PA-01 | Inicio de sesión del Administrador | El Administrador inicia sesión y accede al Dashboard. | El Administrador inició sesión correctamente y el Dashboard cargó la información del sistema. | APROBADO | `PA-01-login-administrador.png` |
| PA-02 | Restricción del Operador | El Operador no visualiza Gestión de Usuarios y no puede acceder directamente a `/usuarios`. | La opción Gestión de Usuarios no apareció en el menú. Al ingresar manualmente a `/usuarios`, el sistema redirigió al Operador a su página principal. | APROBADO | `PA-02a-menu-operador.png` |
| PA-03 | Registro de cliente | El cliente se almacena y aparece en la tabla de resultados. | Se registró correctamente un cliente de prueba y posteriormente apareció en la tabla de clientes. | APROBADO | `PA-03-registro-cliente.png` |
| PA-04 | Préstamo y devolución de cilindro | Una Salida cambia el cilindro a Prestado y una Devolución lo devuelve a Disponible. | El cilindro cambió de Disponible a Prestado después de la Salida y volvió a Disponible después de la Devolución. | APROBADO | `PA-04a-cilindro-prestado.png`, `PA-04b-cilindro-devuelto.png` |
| PA-05 | Ciclo de mantenimiento | El cilindro cambia a Mantenimiento y, al finalizar, vuelve a Disponible. | El cilindro cambió correctamente a Mantenimiento y posteriormente volvió a Disponible mediante Fin de mantenimiento. | APROBADO | `PA-05a-cilindro-mantenimiento.png`, `PA-05b-fin-mantenimiento.png` |
| PA-06 | Bloqueo por intentos fallidos | La cuenta queda temporalmente bloqueada después de cinco intentos fallidos. | Después de cinco intentos con contraseña incorrecta, el sistema bloqueó temporalmente la cuenta. | APROBADO | `PA-06-bloqueo-intentos-fallidos.png` |
| PA-07 | Recuperación administrativa de cuenta | El Administrador desbloquea la cuenta, restablece la contraseña y el usuario puede volver a ingresar. | La cuenta fue desbloqueada, se restableció la contraseña y el Operador pudo iniciar sesión nuevamente. | APROBADO | `PA-07-recuperacion-cuenta.png` |
| PA-08 | Consulta mediante chatbot | El chatbot interpreta una consulta operacional válida y responde con información del sistema. | Ante la consulta sobre la cantidad de cilindros prestados, el chatbot respondió correctamente utilizando los datos registrados en el sistema. | APROBADO | `PA-08-chatbot-cilindros-prestados.png` |

---

## 4. Resumen

Se ejecutaron 8 casos de aceptación.

- Casos ejecutados: 8
- Casos aprobados: 8
- Casos rechazados: 0
- Tasa de aprobación: 100 %

Las funciones principales evaluadas cumplen con los escenarios de aceptación establecidos para SIGC-GAS.

---

## 5. Observaciones detectadas

### 5.1 Cliente obligatorio en movimientos de mantenimiento

Durante PA-05 se observó que el formulario exige seleccionar un cliente para registrar los movimientos de Mantenimiento y Fin de mantenimiento.

Desde el punto de vista operativo, el mantenimiento corresponde principalmente al cilindro y no necesariamente a un cliente.

Se propone como mejora permitir que el campo Cliente sea opcional o no aplicable cuando el tipo de movimiento sea:

- Mantenimiento.
- Fin de mantenimiento.

Esta observación no impidió completar satisfactoriamente el caso PA-05.

### 5.2 Contexto conversacional del chatbot

Durante PA-08 el chatbot respondió correctamente consultas explícitas como:

`¿Cuántos cilindros prestados hay?`

Sin embargo, se observó una limitación ante expresiones posteriores demasiado breves, como:

`Muéstrame`

El chatbot puede perder el contexto de la consulta anterior en determinadas expresiones de seguimiento.

Se propone fortalecer la resolución de contexto conversacional para consultas anafóricas o dependientes del mensaje anterior.

Esta observación no invalida PA-08, debido a que el escenario definido exige interpretar y responder correctamente una consulta operacional válida, condición que fue satisfecha.

---

## 6. Conclusión

Las pruebas de aceptación permitieron comprobar manualmente los principales flujos funcionales y de seguridad de SIGC-GAS.

Los ocho escenarios definidos fueron ejecutados satisfactoriamente y cuentan con evidencia gráfica almacenada en el repositorio.

Los hallazgos adicionales identificados durante las pruebas se registran como oportunidades de mejora y no representan incumplimientos de los criterios de aceptación evaluados.
