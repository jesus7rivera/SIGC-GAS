# Arquitectura técnica del chatbot de SIGC-GAS

## 1. Objetivo

Definir la arquitectura de la primera versión del chatbot de SIGC-GAS, estableciendo las responsabilidades del frontend, el backend, la autenticación, la detección de intenciones y el acceso seguro a la información del sistema.

## 2. Enfoque de la primera versión

La primera versión utilizará un clasificador de intenciones basado en reglas controladas.

No se conectará inicialmente a un servicio externo de inteligencia artificial.

Este enfoque permitirá:

- Obtener resultados deterministas.
- Facilitar las pruebas automatizadas.
- Medir la clasificación de las intenciones.
- Reducir respuestas inventadas.
- Controlar exactamente qué consultas están permitidas.
- Evitar costos y dependencias externas durante la primera implementación.
- Integrar posteriormente un modelo de lenguaje sin modificar toda la arquitectura.

## 3. Arquitectura general

El flujo principal será:

```text
Usuario autenticado
        |
        v
Interfaz del chatbot en React
        |
        | POST /api/chatbot/mensaje
        | Authorization: Bearer <token>
        v
Ruta protegida de Express
        |
        v
Validación del mensaje
        |
        v
Servicio del chatbot
        |
        +--> Normalización del texto
        |
        +--> Detección de intención
        |
        +--> Extracción de parámetros
        |
        +--> Verificación de permisos
        |
        +--> Ejecución de consulta de lectura
        |
        +--> Construcción de respuesta
        |
        v
Respuesta JSON segura
        |
        v
Interfaz conversacional