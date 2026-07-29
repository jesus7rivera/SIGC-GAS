import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  validarMensajeChatbot,
} from "./chatbotValidationMiddleware.js";

const ejecutarMiddleware = (
  body,
) => {
  const req = {
    body,
  };

  const respuesta = {
    estado: null,
    contenido: null,
  };

  const res = {
    status(codigo) {
      respuesta.estado = codigo;

      return res;
    },

    json(contenido) {
      respuesta.contenido =
        contenido;

      return res;
    },
  };

  let siguienteEjecutado = false;

  const next = () => {
    siguienteEjecutado = true;
  };

  validarMensajeChatbot(
    req,
    res,
    next,
  );

  return {
    req,
    respuesta,
    siguienteEjecutado,
  };
};

describe(
  "Validación del mensaje del chatbot",
  () => {
    test(
      "acepta un mensaje válido y elimina espacios externos",
      () => {
        const resultado =
          ejecutarMiddleware({
            mensaje:
              "  Hola asistente  ",
          });

        assert.equal(
          resultado.siguienteEjecutado,
          true,
        );

        assert.equal(
          resultado.req.body.mensaje,
          "Hola asistente",
        );

        assert.equal(
          resultado.respuesta.estado,
          null,
        );
      },
    );

    test(
      "rechaza un cuerpo ausente",
      () => {
        const resultado =
          ejecutarMiddleware(
            undefined,
          );

        assert.equal(
          resultado.siguienteEjecutado,
          false,
        );

        assert.equal(
          resultado.respuesta.estado,
          400,
        );

        assert.deepEqual(
          resultado.respuesta.contenido,
          {
            mensaje:
              "Datos de entrada inválidos",
            errores: [
              "El cuerpo de la solicitud debe ser un objeto JSON.",
            ],
          },
        );
      },
    );

    test(
      "rechaza un arreglo como cuerpo",
      () => {
        const resultado =
          ejecutarMiddleware([
            {
              mensaje: "Hola",
            },
          ]);

        assert.equal(
          resultado.respuesta.estado,
          400,
        );
      },
    );

    test(
      "rechaza campos adicionales",
      () => {
        const resultado =
          ejecutarMiddleware({
            mensaje: "Hola",
            rol: "Administrador",
          });

        assert.equal(
          resultado.respuesta.estado,
          400,
        );

        assert.deepEqual(
          resultado.respuesta
            .contenido.errores,
          [
            "Campos no permitidos: rol",
          ],
        );
      },
    );

    test(
      "rechaza un mensaje que no es texto",
      () => {
        const resultado =
          ejecutarMiddleware({
            mensaje: {
              consulta: "cilindros",
            },
          });

        assert.equal(
          resultado.respuesta.estado,
          400,
        );

        assert.deepEqual(
          resultado.respuesta
            .contenido.errores,
          [
            "El mensaje debe ser una cadena de texto.",
          ],
        );
      },
    );

    test(
      "rechaza un mensaje vacío",
      () => {
        const resultado =
          ejecutarMiddleware({
            mensaje: "   ",
          });

        assert.equal(
          resultado.respuesta.estado,
          400,
        );

        assert.deepEqual(
          resultado.respuesta
            .contenido.errores,
          [
            "El mensaje debe contener entre 1 y 300 caracteres.",
          ],
        );
      },
    );

    test(
      "rechaza un mensaje superior a 300 caracteres",
      () => {
        const resultado =
          ejecutarMiddleware({
            mensaje: "a".repeat(301),
          });

        assert.equal(
          resultado.respuesta.estado,
          400,
        );

        assert.deepEqual(
          resultado.respuesta
            .contenido.errores,
          [
            "El mensaje debe contener entre 1 y 300 caracteres.",
          ],
        );
      },
    );

    test(
      "rechaza varios campos adicionales en una sola respuesta",
      () => {
        const resultado =
          ejecutarMiddleware({
            mensaje: "Hola",
            admin: true,
            token: "secreto",
          });

        assert.equal(
          resultado.respuesta.estado,
          400,
        );

        assert.deepEqual(
          resultado.respuesta
            .contenido.errores,
          [
            "Campos no permitidos: admin, token",
          ],
        );
      },
    );
  },
);