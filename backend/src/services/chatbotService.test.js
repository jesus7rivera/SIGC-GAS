import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  procesarMensajeChatbot,
} from "./chatbotService.js";

describe(
  "Servicio principal del chatbot",
  () => {
    test(
      "construye una respuesta de saludo",
      async () => {
        const resultado =
          await procesarMensajeChatbot(
            "Hola",
          );

        assert.deepEqual(
          resultado,
          {
            intencion: "saludo",
            parametros: {},
            respuesta:
              "Hola. Soy el asistente de SIGC-GAS. Puedo ayudarte a consultar cilindros, clientes, movimientos e historiales.",
            datos: null,
          },
        );
      },
    );

    test(
      "construye una respuesta de ayuda",
      async () => {
        const resultado =
          await procesarMensajeChatbot(
            "¿Qué puedes hacer?",
          );

        assert.equal(
          resultado.intencion,
          "ayuda",
        );

        assert.equal(
          resultado.parametros
            instanceof Object,
          true,
        );

        assert.equal(
          Array.isArray(
            resultado.datos.ejemplos,
          ),
          true,
        );

        assert.equal(
          resultado.datos.ejemplos.length,
          6,
        );
      },
    );

    test(
      "rechaza una solicitud de modificación",
      async () => {
        const resultado =
          await procesarMensajeChatbot(
            "Registra una salida del cilindro CIL-001",
          );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "solicitud_modificacion_restringida",
            parametros: {},
            respuesta:
              "La primera versión del chatbot solo permite consultas. Para modificar información, utiliza el módulo correspondiente de SIGC-GAS.",
            datos: null,
          },
        );
      },
    );

    test(
      "responde de forma controlada ante una consulta desconocida",
      async () => {
        const resultado =
          await procesarMensajeChatbot(
            "¿Cuál es la capital de Francia?",
          );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "consulta_no_reconocida",
            parametros: {},
            respuesta:
              "No pude comprender la consulta. Puedes preguntarme por cilindros disponibles, clientes activos, movimientos recientes o el historial de un cilindro.",
            datos: null,
          },
        );
      },
    );

    test(
      "solicita el código cuando falta en una consulta de historial",
      async () => {
        const resultado =
          await procesarMensajeChatbot(
            "Muéstrame el historial del cilindro",
          );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "consultar_historial_cilindro",
            parametros: {},
            respuesta:
              "Indica el código del cilindro que deseas consultar, por ejemplo CIL-001.",
            datos: null,
          },
        );
      },
    );

    test(
      "delega una consulta de cilindros con sus parámetros",
      async () => {
        let solicitudRecibida = null;

        const ejecutarConsulta = async (
          solicitud,
        ) => {
          solicitudRecibida = solicitud;

          return {
            respuesta:
              "Actualmente hay 8 cilindros disponibles.",
            datos: {
              estado: "Disponible",
              cantidad: 8,
            },
          };
        };

        const resultado =
          await procesarMensajeChatbot(
            "¿Cuántos cilindros están disponibles?",
            {
              ejecutarConsulta,
            },
          );

        assert.deepEqual(
          solicitudRecibida,
          {
            intencion:
              "contar_cilindros_estado",
            parametros: {
              estado: "Disponible",
            },
          },
        );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "contar_cilindros_estado",
            parametros: {
              estado: "Disponible",
            },
            respuesta:
              "Actualmente hay 8 cilindros disponibles.",
            datos: {
              estado: "Disponible",
              cantidad: 8,
            },
          },
        );
      },
    );

    test(
      "delega la cantidad solicitada de movimientos recientes",
      async () => {
        let solicitudRecibida = null;

        const ejecutarConsulta = async (
          solicitud,
        ) => {
          solicitudRecibida = solicitud;

          return {
            respuesta:
              "Estos son los 7 movimientos más recientes.",
            datos: [],
          };
        };

        await procesarMensajeChatbot(
          "Dame los últimos siete movimientos",
          {
            ejecutarConsulta,
          },
        );

        assert.deepEqual(
          solicitudRecibida,
          {
            intencion:
              "consultar_movimientos_recientes",
            parametros: {
              cantidad: 7,
            },
          },
        );
      },
    );

    test(
      "detecta una configuración incompleta del servicio de consultas",
      async () => {
        await assert.rejects(
          () =>
            procesarMensajeChatbot(
              "¿Cuántos cilindros están disponibles?",
            ),
          {
            message:
              "El servicio de consultas del chatbot no está configurado.",
          },
        );
      },
    );
  },
);