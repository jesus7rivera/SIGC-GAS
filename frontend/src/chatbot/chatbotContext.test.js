import assert
  from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  obtenerContextoChatbot,
  resolverConsultaContextual,
} from "./chatbotContext.js";

describe(
  "Contexto conversacional del chatbot",
  () => {
    test(
      "obtiene contexto de clientes activos",
      () => {
        const contexto =
          obtenerContextoChatbot({
            intencion:
              "contar_clientes_estado",
            parametros: {
              estado: "Activo",
            },
          });

        assert.deepEqual(
          contexto,
          {
            tipo: "clientes",
            estado: "Activo",
          },
        );
      },
    );

    test(
      "resuelve quiénes son los clientes activos",
      () => {
        const consulta =
          resolverConsultaContextual(
            "¿Quiénes son esos dos clientes?",
            {
              tipo: "clientes",
              estado: "Activo",
            },
          );

        assert.equal(
          consulta,
          "Muéstrame los clientes activos",
        );
      },
    );

    test(
      "resuelve clientes inactivos",
      () => {
        const consulta =
          resolverConsultaContextual(
            "Dame la lista",
            {
              tipo: "clientes",
              estado: "Inactivo",
            },
          );

        assert.equal(
          consulta,
          "Muéstrame los clientes inactivos",
        );
      },
    );

    test(
      "resuelve todos los clientes",
      () => {
        const consulta =
          resolverConsultaContextual(
            "¿Quiénes son?",
            {
              tipo: "clientes",
              estado: "Todos",
            },
          );

        assert.equal(
          consulta,
          "Muéstrame todos los clientes registrados",
        );
      },
    );

    test(
      "resuelve cilindros prestados",
      () => {
        const consulta =
          resolverConsultaContextual(
            "¿Cuáles son?",
            {
              tipo: "cilindros",
              estado: "Prestado",
            },
          );

        assert.equal(
          consulta,
          "Muéstrame los cilindros prestados",
        );
      },
    );

    test(
      "resuelve cilindros en mantenimiento",
      () => {
        const consulta =
          resolverConsultaContextual(
            "Muéstramelos",
            {
              tipo: "cilindros",
              estado:
                "Mantenimiento",
            },
          );

        assert.equal(
          consulta,
          "Muéstrame los cilindros en mantenimiento",
        );
      },
    );

    test(
      "no transforma una pregunta independiente",
      () => {
        const consulta =
          resolverConsultaContextual(
            "Dame un resumen del sistema",
            {
              tipo: "clientes",
              estado: "Activo",
            },
          );

        assert.equal(
          consulta,
          "Dame un resumen del sistema",
        );
      },
    );

    test(
      "descarta respuestas que no generan contexto",
      () => {
        const contexto =
          obtenerContextoChatbot({
            intencion: "saludo",
            parametros: {},
          });

        assert.equal(
          contexto,
          null,
        );
      },
    );
        test(
      "resuelve quién tiene los cilindros prestados",
      () => {
        const consulta =
          resolverConsultaContextual(
            "¿Quién los tiene?",
            {
              tipo: "cilindros",
              estado: "Prestado",
            },
          );

        assert.equal(
          consulta,
          "¿Quién tiene los cilindros prestados?",
        );
      },
    );

    test(
      "no atribuye responsables a cilindros disponibles",
      () => {
        const consulta =
          resolverConsultaContextual(
            "¿Quién los tiene?",
            {
              tipo: "cilindros",
              estado: "Disponible",
            },
          );

        assert.equal(
          consulta,
          "¿Quién los tiene?",
        );
      },
    );
  },
);