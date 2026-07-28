# Alcance del chatbot de SIGC-GAS

## 1. Nombre provisional

Asistente SIGC-GAS.

## 2. Objetivo general

Desarrollar un chatbot integrado con SIGC-GAS que permita a los usuarios autenticados consultar información operativa sobre clientes, cilindros y movimientos mediante lenguaje natural, respetando los permisos definidos para cada rol.

## 3. Problema que resolverá

Actualmente, los usuarios deben ingresar a diferentes módulos del sistema para consultar información sobre disponibilidad de cilindros, clientes activos, movimientos recientes e historial de operaciones.

El chatbot permitirá realizar estas consultas mediante preguntas escritas, reduciendo el tiempo necesario para localizar información dentro del sistema.

## 4. Usuarios

### 4.1. Administrador

Podrá consultar:

- Resumen general del sistema.
- Clientes activos e inactivos.
- Cilindros disponibles, prestados o en mantenimiento.
- Movimientos recientes.
- Historial de un cilindro.
- Información relacionada con todos los módulos autorizados.

### 4.2. Operador

Podrá consultar:

- Resumen general del sistema.
- Cilindros disponibles, prestados o en mantenimiento.
- Clientes registrados.
- Movimientos recientes.
- Historial de un cilindro.

El chatbot deberá respetar los permisos establecidos por la API y el token JWT del usuario.

## 5. Funciones de la primera versión

La primera versión será únicamente de consulta.

Permitirá responder preguntas como:

- ¿Cuántos cilindros están disponibles?
- ¿Cuántos cilindros están prestados?
- ¿Cuántos cilindros están en mantenimiento?
- Muéstrame los cilindros disponibles.
- Busca el cilindro CIL-001.
- ¿Cuántos clientes activos existen?
- Muéstrame los últimos movimientos.
- ¿Cuál es el historial del cilindro CIL-001?
- ¿Qué movimientos se realizaron hoy?
- Dame un resumen del sistema.

## 6. Funciones excluidas de la primera versión

La primera versión no podrá:

- Crear clientes.
- Editar clientes.
- Eliminar clientes.
- Crear cilindros.
- Editar cilindros.
- Eliminar cilindros.
- Registrar salidas.
- Registrar devoluciones.
- Registrar mantenimientos.
- Registrar el fin de un mantenimiento.
- Crear usuarios.
- Cambiar roles o permisos.
- Ejecutar operaciones directamente en MongoDB.

Estas funciones podrán evaluarse en una versión posterior, con confirmación explícita del usuario y controles adicionales de seguridad.

## 7. Principios de seguridad

El chatbot deberá:

- Requerir que el usuario haya iniciado sesión.
- Utilizar el token JWT existente.
- Respetar el rol del usuario.
- Consultar información mediante la API de SIGC-GAS.
- No conectarse directamente a MongoDB desde el frontend.
- No mostrar contraseñas, tokens ni datos internos del servidor.
- No inventar información cuando una consulta no pueda resolverse.
- Informar claramente cuando no encuentre resultados.
- Rechazar solicitudes que intenten modificar información en la primera versión.

## 8. Comportamiento esperado

Cuando comprenda la consulta, el chatbot deberá:

1. Identificar la intención del usuario.
2. Extraer los datos necesarios, como el código de un cilindro.
3. Consultar el endpoint correspondiente.
4. Procesar la respuesta de la API.
5. Mostrar una respuesta clara y breve.
6. Registrar el resultado técnico necesario para las pruebas, sin almacenar información sensible.

Cuando no comprenda la consulta, deberá responder con ejemplos de preguntas compatibles.

## 9. Fuentes de información

El chatbot obtendrá sus respuestas exclusivamente desde los endpoints autorizados de SIGC-GAS.

Fuentes principales:

- Dashboard.
- Clientes.
- Cilindros.
- Movimientos.
- Historial de cilindros.

## 10. Restricciones iniciales

- El chatbot no será una fuente autónoma de datos.
- No responderá con información que no exista en SIGC-GAS.
- No ejecutará operaciones de escritura.
- No sustituirá las validaciones del backend.
- No confiará únicamente en validaciones del frontend.
- Todas las consultas protegidas requerirán autenticación.

## 11. Criterios iniciales de calidad

La primera versión deberá cumplir con:

- Respuestas basadas en datos reales de la API.
- Respeto de los permisos por rol.
- Manejo seguro de errores.
- Mensajes comprensibles para el usuario.
- Pruebas automatizadas de las intenciones principales.
- Integración con GitHub Actions.
- Registro de casos exitosos y fallidos.
- Ausencia de exposición de información sensible.

## 12. Evolución prevista

### Versión 1

Chatbot de consultas seguras.

### Versión 2

Consultas más flexibles y mejor comprensión del lenguaje natural.

### Versión 3

Operaciones controladas con confirmación explícita, auditoría y permisos reforzados.