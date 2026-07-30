import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  crearProcesarMensajeChatbot,
} from "./chatbotController.js";

const crearRespuestaSimulada = () => {
  const registro = {
    estado: null,
    contenido: null,
  };

  const res = {
    status(codigo) {
      registro.estado = codigo;

      return res;
    },

    json(contenido) {
      registro.contenido =
        contenido;

      return res;
    },
  };

  return {
    res,
    registro,
  };
};

describe(
  "Controlador del chatbot",
  () => {
    test(
      "procesa el mensaje y devuelve HTTP 200",
      async () => {
        let mensajeRecibido = null;

        const procesarMensaje =
          async (mensaje) => {
            mensajeRecibido =
              mensaje;

            return {
              intencion: "saludo",
              parametros: {},
              respuesta:
                "Hola. Soy el asistente de SIGC-GAS.",
              datos: null,
            };
          };

        const controlador =
          crearProcesarMensajeChatbot({
            procesarMensaje,
          });

        const req = {
          body: {
            mensaje: "Hola",
          },
        };

        const {
          res,
          registro,
        } = crearRespuestaSimulada();

        let errorRecibido = null;

        const next = (error) => {
          errorRecibido = error;
        };

        await controlador(
          req,
          res,
          next,
        );

        assert.equal(
          mensajeRecibido,
          "Hola",
        );

        assert.equal(
          registro.estado,
          200,
        );

        assert.deepEqual(
          registro.contenido,
          {
            intencion: "saludo",
            parametros: {},
            respuesta:
              "Hola. Soy el asistente de SIGC-GAS.",
            datos: null,
          },
        );

        assert.equal(
          errorRecibido,
          null,
        );
      },
    );

    test(
      "envía los errores al middleware global",
      async () => {
        const errorEsperado =
          new Error(
            "Error controlado de prueba",
          );

        const procesarMensaje =
          async () => {
            throw errorEsperado;
          };

        const controlador =
          crearProcesarMensajeChatbot({
            procesarMensaje,
          });

        const req = {
          body: {
            mensaje:
              "Dame un resumen del sistema",
          },
        };

        const {
          res,
          registro,
        } = crearRespuestaSimulada();

        let errorRecibido = null;

        const next = (error) => {
          errorRecibido = error;
        };

        await controlador(
          req,
          res,
          next,
        );

        assert.equal(
          errorRecibido,
          errorEsperado,
        );

        assert.equal(
          registro.estado,
          null,
        );

        assert.equal(
          registro.contenido,
          null,
        );
      },
    );
  },
);