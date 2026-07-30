# Intenciones del chatbot de SIGC-GAS

## 1. Objetivo

Definir las consultas que reconocerá la primera versión del chatbot, las expresiones que podrá recibir, los datos que deberá extraer y las fuentes autorizadas que utilizará para generar sus respuestas.

## 2. Estructura de una intención

Cada intención tendrá los siguientes elementos:

- Código único.
- Nombre técnico.
- Objetivo.
- Frases de ejemplo.
- Parámetros requeridos.
- Roles autorizados.
- Fuente de información.
- Formato de respuesta.
- Comportamiento ante errores.

## 3. Intenciones conversacionales

### INT-001: Saludo

**Nombre técnico:** `saludo`

**Objetivo:** responder cuando el usuario inicia una conversación.

**Frases de ejemplo:**

- Hola.
- Buenos días.
- Buenas tardes.
- Buenas noches.
- Hola, asistente.
- ¿Estás disponible?

**Parámetros:** ninguno.

**Roles autorizados:**

- Administrador.
- Operador.

**Fuente de información:** no requiere consultar datos.

**Respuesta esperada:**

El chatbot saludará e indicará brevemente las consultas que puede realizar.

---

### INT-002: Ayuda

**Nombre técnico:** `ayuda`

**Objetivo:** mostrar ejemplos de preguntas compatibles con el chatbot.

**Frases de ejemplo:**

- Ayuda.
- ¿Qué puedes hacer?
- ¿Qué puedo preguntarte?
- Muéstrame las opciones.
- Dame ejemplos de consultas.

**Parámetros:** ninguno.

**Roles autorizados:**

- Administrador.
- Operador.

**Fuente de información:** catálogo interno de intenciones.

**Respuesta esperada:**

El chatbot mostrará ejemplos relacionados con cilindros, clientes, movimientos e historial.

---

## 4. Intenciones sobre el resumen del sistema

### INT-003: Consultar resumen general

**Nombre técnico:** `consultar_resumen`

**Objetivo:** mostrar un resumen operativo de SIGC-GAS.

**Frases de ejemplo:**

- Dame un resumen del sistema.
- Muéstrame el estado general.
- ¿Cómo está el inventario?
- ¿Cuál es la situación actual?
- Resume la información del sistema.

**Parámetros:** ninguno.

**Roles autorizados:**

- Administrador.
- Operador.

**Fuente autorizada:**

```text
GET /api/dashboard