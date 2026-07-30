# Contrato de la API del chatbot de SIGC-GAS

## 1. Objetivo

Definir el contrato de comunicación entre el frontend y el backend para la primera versión del chatbot de SIGC-GAS.

El contrato establece:

- Endpoint.
- Método HTTP.
- Autenticación.
- Formato de solicitud.
- Reglas de validación.
- Formato de respuesta.
- Intenciones admitidas.
- Códigos HTTP.
- Manejo de errores.
- Restricciones de seguridad.

## 2. Endpoint principal

```text
POST /api/chatbot/mensaje
```

La primera versión utilizará un único endpoint para procesar mensajes.

## 3. Autenticación

La ruta será protegida mediante JWT.

La solicitud deberá incluir:

```http
Authorization: Bearer <token-jwt>
Content-Type: application/json
```

Los roles autorizados serán:

```text
Administrador
Operador
```

Una solicitud sin token válido no será procesada por el chatbot.

## 4. Solicitud

### 4.1. Estructura permitida

```json
{
  "mensaje": "¿Cuántos cilindros están disponibles?"
}
```

### 4.2. Campos

| Campo | Tipo | Obligatorio | Restricciones |
|---|---|---:|---|
| `mensaje` | String | Sí | Entre 1 y 300 caracteres útiles |

### 4.3. Reglas de validación

El cuerpo de la solicitud deberá:

1. Ser un objeto JSON.
2. Contener únicamente el campo `mensaje`.
3. No ser un arreglo.
4. No contener campos adicionales.
5. Contener una cadena de texto.
6. Tener contenido después de eliminar espacios.
7. No superar los 300 caracteres.
8. No contener el token JWT dentro del mensaje.
9. Ser tratado como texto y nunca como código ejecutable.

### 4.4. Solicitudes inválidas

Campo adicional:

```json
{
  "mensaje": "Muéstrame los cilindros disponibles",
  "rol": "Administrador"
}
```

Mensaje vacío:

```json
{
  "mensaje": "   "
}
```

Tipo incorrecto:

```json
{
  "mensaje": {
    "consulta": "cilindros"
  }
}
```

Arreglo en lugar de texto:

```json
{
  "mensaje": [
    "cilindros disponibles"
  ]
}
```

## 5. Respuesta exitosa

Todas las consultas conversacionales correctamente procesadas utilizarán HTTP `200`.

La estructura general será:

```json
{
  "intencion": "contar_cilindros_estado",
  "parametros": {
    "estado": "Disponible"
  },
  "respuesta": "Actualmente hay 8 cilindros disponibles.",
  "datos": {
    "cantidad": 8
  }
}
```

## 6. Campos de la respuesta

| Campo | Tipo | Descripción |
|---|---|---|
| `intencion` | String | Intención identificada por el chatbot |
| `parametros` | Object | Entidades extraídas del mensaje |
| `respuesta` | String | Texto que se mostrará al usuario |
| `datos` | Object, Array o null | Información estructurada que respalda la respuesta |

## 7. Intenciones permitidas

El campo `intencion` podrá contener uno de los siguientes valores:

```text
saludo
ayuda
consultar_resumen
contar_cilindros_estado
listar_cilindros_estado
buscar_cilindro_codigo
contar_clientes_estado
buscar_cliente
consultar_movimientos_recientes
consultar_movimientos_hoy
consultar_historial_cilindro
solicitud_modificacion_restringida
consulta_no_reconocida
```

No se admitirán valores enviados por el frontend para seleccionar directamente la intención.

La intención será determinada exclusivamente por el backend.

## 8. Respuestas por intención

### 8.1. Saludo

Solicitud:

```json
{
  "mensaje": "Hola"
}
```

Respuesta:

```json
{
  "intencion": "saludo",
  "parametros": {},
  "respuesta": "Hola. Soy el asistente de SIGC-GAS. Puedo ayudarte a consultar cilindros, clientes, movimientos e historiales.",
  "datos": null
}
```

### 8.2. Ayuda

Solicitud:

```json
{
  "mensaje": "¿Qué puedes hacer?"
}
```

Respuesta:

```json
{
  "intencion": "ayuda",
  "parametros": {},
  "respuesta": "Puedes preguntarme cuántos cilindros están disponibles, buscar un cilindro por código, consultar clientes activos, revisar movimientos recientes o ver el historial de un cilindro.",
  "datos": {
    "ejemplos": [
      "¿Cuántos cilindros están disponibles?",
      "Busca el cilindro CIL-001",
      "¿Cuántos clientes activos existen?",
      "Muéstrame los últimos movimientos",
      "Historial del cilindro CIL-001"
    ]
  }
}
```

### 8.3. Resumen general

Solicitud:

```json
{
  "mensaje": "Dame un resumen del sistema"
}
```

Respuesta:

```json
{
  "intencion": "consultar_resumen",
  "parametros": {},
  "respuesta": "El sistema registra 12 clientes activos, 8 cilindros disponibles, 4 prestados y 2 en mantenimiento.",
  "datos": {
    "clientesActivos": 12,
    "disponibles": 8,
    "prestados": 4,
    "mantenimiento": 2
  }
}
```

### 8.4. Contar cilindros por estado

Solicitud:

```json
{
  "mensaje": "¿Cuántos cilindros están prestados?"
}
```

Respuesta:

```json
{
  "intencion": "contar_cilindros_estado",
  "parametros": {
    "estado": "Prestado"
  },
  "respuesta": "Actualmente hay 4 cilindros prestados.",
  "datos": {
    "estado": "Prestado",
    "cantidad": 4
  }
}
```

### 8.5. Listar cilindros por estado

Solicitud:

```json
{
  "mensaje": "Muéstrame los cilindros disponibles"
}
```

Respuesta:

```json
{
  "intencion": "listar_cilindros_estado",
  "parametros": {
    "estado": "Disponible"
  },
  "respuesta": "Se encontraron 2 cilindros disponibles.",
  "datos": [
    {
      "codigo": "CIL-001",
      "tipo": "Doméstico",
      "capacidad": "10 Kg",
      "estado": "Disponible"
    },
    {
      "codigo": "CIL-002",
      "tipo": "Industrial",
      "capacidad": "45 Kg",
      "estado": "Disponible"
    }
  ]
}
```

La cantidad de resultados devueltos deberá estar limitada para evitar respuestas excesivas.

### 8.6. Buscar cilindro por código

Solicitud:

```json
{
  "mensaje": "Busca el cilindro CIL-001"
}
```

Respuesta:

```json
{
  "intencion": "buscar_cilindro_codigo",
  "parametros": {
    "codigo": "CIL-001"
  },
  "respuesta": "El cilindro CIL-001 está disponible.",
  "datos": {
    "codigo": "CIL-001",
    "tipo": "Doméstico",
    "capacidad": "10 Kg",
    "estado": "Disponible"
  }
}
```

### 8.7. Cilindro no encontrado

Cuando la intención sea válida, pero no exista un cilindro coincidente, la respuesta será HTTP `200`:

```json
{
  "intencion": "buscar_cilindro_codigo",
  "parametros": {
    "codigo": "CIL-999"
  },
  "respuesta": "No se encontró un cilindro con el código CIL-999.",
  "datos": null
}
```

La ausencia de resultados no se tratará como un error técnico.

### 8.8. Contar clientes

Solicitud:

```json
{
  "mensaje": "¿Cuántos clientes activos existen?"
}
```

Respuesta:

```json
{
  "intencion": "contar_clientes_estado",
  "parametros": {
    "estado": "Activo"
  },
  "respuesta": "Actualmente existen 12 clientes activos.",
  "datos": {
    "estado": "Activo",
    "cantidad": 12
  }
}
```

### 8.9. Buscar cliente por DNI

Solicitud:

```json
{
  "mensaje": "Busca al cliente con DNI 12345678"
}
```

Respuesta:

```json
{
  "intencion": "buscar_cliente",
  "parametros": {
    "dni": "12345678"
  },
  "respuesta": "Se encontró al cliente Juan Pérez.",
  "datos": {
    "dni": "12345678",
    "nombre": "Juan Pérez",
    "telefono": "900000001",
    "estado": "Activo"
  }
}
```

### 8.10. Movimientos recientes

Solicitud:

```json
{
  "mensaje": "Muéstrame los últimos cinco movimientos"
}
```

Respuesta:

```json
{
  "intencion": "consultar_movimientos_recientes",
  "parametros": {
    "cantidad": 5
  },
  "respuesta": "Estos son los 5 movimientos más recientes.",
  "datos": [
    {
      "fecha": "2026-07-28T15:30:00.000Z",
      "cliente": "Juan Pérez",
      "cilindro": "CIL-001",
      "tipo": "Salida",
      "observacion": "Entrega registrada"
    }
  ]
}
```

La cantidad predeterminada será `5`.

El límite máximo será `10`.

Cuando el usuario solicite una cantidad superior, se aplicará el límite máximo.

### 8.11. Movimientos de hoy

Solicitud:

```json
{
  "mensaje": "¿Qué movimientos se realizaron hoy?"
}
```

Respuesta:

```json
{
  "intencion": "consultar_movimientos_hoy",
  "parametros": {},
  "respuesta": "Durante el día de hoy se registraron 3 movimientos.",
  "datos": [
    {
      "fecha": "2026-07-28T15:30:00.000Z",
      "cliente": "Juan Pérez",
      "cilindro": "CIL-001",
      "tipo": "Salida",
      "observacion": "Entrega registrada"
    }
  ]
}
```

### 8.12. Historial de cilindro

Solicitud:

```json
{
  "mensaje": "Muéstrame el historial del cilindro CIL-001"
}
```

Respuesta:

```json
{
  "intencion": "consultar_historial_cilindro",
  "parametros": {
    "codigo": "CIL-001"
  },
  "respuesta": "El cilindro CIL-001 tiene 3 movimientos registrados.",
  "datos": {
    "cilindro": {
      "codigo": "CIL-001",
      "estado": "Disponible"
    },
    "movimientos": [
      {
        "fecha": "2026-07-28T15:30:00.000Z",
        "cliente": "Juan Pérez",
        "tipo": "Devolución",
        "observacion": "Cilindro devuelto"
      }
    ]
  }
}
```

## 9. Solicitudes de modificación restringidas

Las solicitudes de escritura serán reconocidas, pero no ejecutadas.

Solicitud:

```json
{
  "mensaje": "Registra una salida del cilindro CIL-001"
}
```

Respuesta HTTP `200`:

```json
{
  "intencion": "solicitud_modificacion_restringida",
  "parametros": {},
  "respuesta": "La primera versión del chatbot solo permite consultas. Para modificar información, utiliza el módulo correspondiente de SIGC-GAS.",
  "datos": null
}
```

No se realizará ninguna operación `POST`, `PUT`, `PATCH` o `DELETE` sobre los datos del sistema.

## 10. Consulta desconocida

Solicitud:

```json
{
  "mensaje": "¿Cuál es la capital de Francia?"
}
```

Respuesta HTTP `200`:

```json
{
  "intencion": "consulta_no_reconocida",
  "parametros": {},
  "respuesta": "No pude comprender la consulta. Puedes preguntarme por cilindros disponibles, clientes activos, movimientos recientes o el historial de un cilindro.",
  "datos": null
}
```

Una consulta desconocida no producirá una respuesta inventada.

## 11. Parámetro requerido ausente

Cuando se identifique una intención específica, pero falte un parámetro obligatorio, la API responderá HTTP `200` con una solicitud de aclaración.

Ejemplo:

```json
{
  "mensaje": "Muéstrame el historial del cilindro"
}
```

Respuesta:

```json
{
  "intencion": "consultar_historial_cilindro",
  "parametros": {},
  "respuesta": "Indica el código del cilindro que deseas consultar, por ejemplo CIL-001.",
  "datos": null
}
```

La ausencia de un parámetro conversacional no se tratará como error de transporte.

## 12. Errores de validación

Una solicitud con estructura inválida responderá HTTP `400`.

Ejemplo:

```json
{
  "mensaje": ""
}
```

Respuesta:

```json
{
  "mensaje": "Datos de entrada inválidos",
  "errores": [
    "El mensaje debe contener entre 1 y 300 caracteres."
  ]
}
```

Campo adicional:

```json
{
  "mensaje": "Hola",
  "admin": true
}
```

Respuesta:

```json
{
  "mensaje": "Datos de entrada inválidos",
  "errores": [
    "Campos no permitidos: admin"
  ]
}
```

## 13. Códigos HTTP

| Código | Uso |
|---:|---|
| `200` | Mensaje procesado, consulta reconocida, desconocida, sin resultados o restringida |
| `400` | Cuerpo JSON o mensaje inválido |
| `401` | Token ausente, inválido o vencido |
| `403` | Rol no autorizado |
| `404` | Ruta de la API inexistente |
| `409` | Reservado para conflictos futuros; no previsto en las consultas de la versión 1 |
| `500` | Error interno controlado |

## 14. Respuesta ante token ausente

```json
{
  "mensaje": "Token no proporcionado."
}
```

Código esperado:

```text
HTTP 401
```

## 15. Respuesta ante token inválido

```json
{
  "mensaje": "Token inválido o expirado."
}
```

Código esperado:

```text
HTTP 401
```

Las frases exactas podrán conservar las respuestas actuales del middleware de autenticación, pero nunca incluirán detalles del token.

## 16. Error interno

Ante un fallo inesperado:

```json
{
  "mensaje": "Error interno del servidor."
}
```

Código esperado:

```text
HTTP 500
```

No se devolverán:

- Trazas del servidor.
- Rutas locales.
- Mensajes completos de MongoDB.
- Consultas internas.
- Variables de entorno.
- Tokens.
- Contraseñas.

## 17. Límites de resultados

Para evitar respuestas excesivas:

| Consulta | Límite inicial |
|---|---:|
| Listado de cilindros | 10 |
| Movimientos recientes | 10 |
| Movimientos de hoy | 10 |
| Historial de cilindro | 10 |
| Resultados de búsqueda de clientes | 5 |

Cuando existan más resultados, el texto deberá indicarlo:

```text
Se muestran los primeros 10 resultados.
```

## 18. Tratamiento de fechas

Las fechas serán enviadas por la API en formato ISO 8601:

```text
2026-07-28T15:30:00.000Z
```

El frontend podrá presentarlas en formato local.

El backend utilizará una comparación controlada para determinar los movimientos correspondientes al día actual.

## 19. Tratamiento de datos sensibles

El chatbot no devolverá:

- Contraseñas.
- Hashes de contraseñas.
- Tokens JWT.
- Variables de entorno.
- Consultas internas.
- Identificadores técnicos innecesarios.
- Trazas del servidor.

Los identificadores MongoDB solo se utilizarán internamente cuando sean necesarios para consultar historiales.

## 20. Operaciones permitidas internamente

El servicio de consultas podrá utilizar operaciones de lectura como:

```text
find
findOne
findById
countDocuments
exists
aggregate
sort
limit
populate
```

No podrá utilizar operaciones de escritura como:

```text
create
insertOne
insertMany
save
updateOne
updateMany
findByIdAndUpdate
findOneAndUpdate
deleteOne
deleteMany
findByIdAndDelete
```

## 21. Compatibilidad futura

Las siguientes versiones podrán ampliar la respuesta con metadatos adicionales, siempre que no se eliminen los campos principales:

```text
intencion
parametros
respuesta
datos
```

Un futuro clasificador basado en inteligencia artificial deberá devolver estos mismos campos y respetar las mismas restricciones de seguridad.

## 22. Criterios de aceptación del contrato

La implementación será considerada correcta cuando:

1. El frontend envíe únicamente el campo `mensaje`.
2. El backend determine la intención.
3. Las respuestas respeten la estructura acordada.
4. Las consultas desconocidas no generen información inventada.
5. Las solicitudes de modificación sean rechazadas sin alterar datos.
6. Las consultas requieran JWT.
7. Los errores de validación utilicen HTTP `400`.
8. Las respuestas conversacionales utilicen HTTP `200`.
9. Los resultados estén limitados.
10. Las pruebas automatizadas verifiquen solicitudes y respuestas.