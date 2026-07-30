import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  normalizarMensaje,
} from "./textNormalizer.js";

import {
  clasificarIntencion,
} from "./intentClassifier.js";

describe(
  "Normalización de mensajes del chatbot",
  () => {
    test(
      "convierte a minúsculas y elimina acentos",
      () => {
        const resultado = normalizarMensaje(
          "¿CUÁNTOS CILINDROS ESTÁN DISPONIBLES?",
        );

        assert.equal(
          resultado,
          "cuantos cilindros estan disponibles",
        );
      },
    );

    test(
      "elimina espacios innecesarios",
      () => {
        const resultado = normalizarMensaje(
          "   Hola     asistente   ",
        );

        assert.equal(
          resultado,
          "hola asistente",
        );
      },
    );

    test(
      "conserva los guiones de códigos de cilindros",
      () => {
        const resultado = normalizarMensaje(
          "Busca el cilindro CIL-001",
        );

        assert.equal(
          resultado,
          "busca el cilindro cil-001",
        );
      },
    );

    test(
      "elimina signos de puntuación",
      () => {
        const resultado = normalizarMensaje(
          "Hola, asistente. ¿Estás disponible?",
        );

        assert.equal(
          resultado,
          "hola asistente estas disponible",
        );
      },
    );

    test(
      "devuelve una cadena vacía para valores no textuales",
      () => {
        assert.equal(
          normalizarMensaje(null),
          "",
        );

        assert.equal(
          normalizarMensaje({}),
          "",
        );
      },
    );
  },
);

describe(
  "Clasificación de intenciones del chatbot",
  () => {
    const casos = [
      {
        mensaje:
          "Registra una salida del cilindro CIL-001",
        intencion:
          "solicitud_modificacion_restringida",
      },
      {
        mensaje:
          "Elimina el cilindro CIL-001",
        intencion:
          "solicitud_modificacion_restringida",
      },
      {
        mensaje:
          "Finaliza el mantenimiento del cilindro CIL-001",
        intencion:
          "solicitud_modificacion_restringida",
      },
      {
        mensaje:
          "Muéstrame el historial del cilindro CIL-001",
        intencion:
          "consultar_historial_cilindro",
      },
      {
        mensaje:
          "Historial del cilindro",
        intencion:
          "consultar_historial_cilindro",
      },
      {
        mensaje:
          "Busca el cilindro CIL-001",
        intencion:
          "buscar_cilindro_codigo",
      },
      {
        mensaje:
          "¿Cuál es el estado del cilindro CIL-010?",
        intencion:
          "buscar_cilindro_codigo",
      },
      {
        mensaje:
          "Busca al cliente con DNI 12345678",
        intencion:
          "buscar_cliente",
      },
      {
        mensaje:
          "Consulta el DNI 87654321",
        intencion:
          "buscar_cliente",
      },
      {
        mensaje:
          "¿Qué movimientos se realizaron hoy?",
        intencion:
          "consultar_movimientos_hoy",
      },
      {
        mensaje:
          "Dame la actividad de hoy",
        intencion:
          "consultar_movimientos_hoy",
      },
      {
        mensaje:
          "Muéstrame los últimos movimientos",
        intencion:
          "consultar_movimientos_recientes",
      },
      {
        mensaje:
          "Dame los últimos cinco movimientos",
        intencion:
          "consultar_movimientos_recientes",
      },
      {
        mensaje:
          "Muéstrame los cilindros disponibles",
        intencion:
          "listar_cilindros_estado",
      },
      {
        mensaje:
          "Lista los cilindros prestados",
        intencion:
          "listar_cilindros_estado",
      },
      {
        mensaje:
          "¿Cuántos cilindros están disponibles?",
        intencion:
          "contar_cilindros_estado",
      },
      {
        mensaje:
          "Total de cilindros en mantenimiento",
        intencion:
          "contar_cilindros_estado",
      },
      {
        mensaje:
          "¿Cuántos clientes activos existen?",
        intencion:
          "contar_clientes_estado",
      },
      {
        mensaje:
          "Cantidad de clientes inactivos",
        intencion:
          "contar_clientes_estado",
      },
      {
        mensaje:
          "Dame un resumen del sistema",
        intencion:
          "consultar_resumen",
      },
      {
        mensaje:
          "¿Cómo está el inventario?",
        intencion:
          "consultar_resumen",
      },
      {
        mensaje:
          "¿Qué puedes hacer?",
        intencion:
          "ayuda",
      },
      {
        mensaje:
          "Dame ejemplos de consultas",
        intencion:
          "ayuda",
      },
      {
        mensaje:
          "Hola",
        intencion:
          "saludo",
      },
      {
        mensaje:
          "Buenas tardes",
        intencion:
          "saludo",
      },
      {
        mensaje:
          "¿Cuál es la capital de Francia?",
        intencion:
          "consulta_no_reconocida",
      },
    ];

    for (const caso of casos) {
      test(
        `clasifica: ${caso.mensaje}`,
        () => {
          const mensajeNormalizado =
            normalizarMensaje(caso.mensaje);

          const resultado =
            clasificarIntencion(
              mensajeNormalizado,
            );

          assert.equal(
            resultado,
            caso.intencion,
          );
        },
      );
    }
  },
);

describe(
  "Prioridad de intenciones",
  () => {
    test(
      "una solicitud de escritura tiene prioridad sobre una consulta",
      () => {
        const mensaje = normalizarMensaje(
          "Registra una salida y muéstrame el cilindro CIL-001",
        );

        assert.equal(
          clasificarIntencion(mensaje),
          "solicitud_modificacion_restringida",
        );
      },
    );

    test(
      "el historial tiene prioridad sobre la búsqueda general",
      () => {
        const mensaje = normalizarMensaje(
          "Busca el historial del cilindro CIL-001",
        );

        assert.equal(
          clasificarIntencion(mensaje),
          "consultar_historial_cilindro",
        );
      },
    );

    test(
      "los movimientos de hoy tienen prioridad sobre movimientos recientes",
      () => {
        const mensaje = normalizarMensaje(
          "Muéstrame los movimientos recientes de hoy",
        );

        assert.equal(
          clasificarIntencion(mensaje),
          "consultar_movimientos_hoy",
        );
      },
    );
  },
);