import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  crearProcesadorChatbot,
} from "./chatbotApplicationService.js";

const crearRepositorio = (
  modificaciones = {},
) => ({
  contarClientesPorEstado:
    async () => 0,

  contarCilindrosPorEstado:
    async () => 0,

  listarCilindrosPorEstado:
    async () => [],

  buscarCilindroPorCodigo:
    async () => null,

  buscarClientePorDni:
    async () => null,

  listarMovimientosRecientes:
    async () => [],

  listarMovimientosPorRango:
    async () => [],

  listarMovimientosPorCilindro:
    async () => [],

  ...modificaciones,
});

describe(
  "Integración de las capas del chatbot",
  () => {
    test(
      "procesa una consulta completa de cilindros",
      async () => {
        const repositorio =
          crearRepositorio({
            contarCilindrosPorEstado:
              async (estado) => {
                assert.equal(
                  estado,
                  "Disponible",
                );

                return 8;
              },
          });

        const procesarMensaje =
          crearProcesadorChatbot({
            repositorio,
          });

        const resultado =
          await procesarMensaje(
            "¿Cuántos cilindros están disponibles?",
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
      "procesa una búsqueda de cliente",
      async () => {
        const repositorio =
          crearRepositorio({
            buscarClientePorDni:
              async (dni) => {
                assert.equal(
                  dni,
                  "12345678",
                );

                return {
                  dni: "12345678",
                  nombre: "Juan Pérez",
                  telefono: "900000001",
                  estado: "Activo",
                };
              },
          });

        const procesarMensaje =
          crearProcesadorChatbot({
            repositorio,
          });

        const resultado =
          await procesarMensaje(
            "Busca al cliente con DNI 12345678",
          );

        assert.equal(
          resultado.intencion,
          "buscar_cliente",
        );

        assert.equal(
          resultado.respuesta,
          "Se encontró al cliente Juan Pérez.",
        );

        assert.deepEqual(
          resultado.datos,
          {
            dni: "12345678",
            nombre: "Juan Pérez",
            telefono: "900000001",
            estado: "Activo",
          },
        );
      },
    );

    test(
      "no consulta el repositorio para una solicitud restringida",
      async () => {
        let repositorioConsultado =
          false;

        const repositorio =
          crearRepositorio({
            buscarCilindroPorCodigo:
              async () => {
                repositorioConsultado =
                  true;

                return null;
              },
          });

        const procesarMensaje =
          crearProcesadorChatbot({
            repositorio,
          });

        const resultado =
          await procesarMensaje(
            "Elimina el cilindro CIL-001",
          );

        assert.equal(
          resultado.intencion,
          "solicitud_modificacion_restringida",
        );

        assert.equal(
          repositorioConsultado,
          false,
        );
      },
    );

    test(
      "procesa movimientos del día usando una fecha controlada",
      async () => {
        let rangoRecibido = null;

        const repositorio =
          crearRepositorio({
            listarMovimientosPorRango:
              async (
                desde,
                hasta,
                limite,
              ) => {
                rangoRecibido = {
                  desde,
                  hasta,
                  limite,
                };

                return [];
              },
          });

        const ahora =
          new Date(
            "2026-07-28T15:30:00.000Z",
          );

        const procesarMensaje =
          crearProcesadorChatbot({
            repositorio,
            ahora,
          });

        const resultado =
          await procesarMensaje(
            "¿Qué movimientos se realizaron hoy?",
          );

        assert.equal(
          rangoRecibido.limite,
          11,
        );

        assert.equal(
          rangoRecibido.desde
            instanceof Date,
          true,
        );

        assert.equal(
          rangoRecibido.hasta
            instanceof Date,
          true,
        );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "consultar_movimientos_hoy",
            parametros: {},
            respuesta:
              "No se registraron movimientos durante el día de hoy.",
            datos: [],
          },
        );
      },
    );
  },
);