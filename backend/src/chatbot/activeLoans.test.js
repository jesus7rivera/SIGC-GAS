import assert
  from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  clasificarIntencion,
} from "./intentClassifier.js";

import {
  normalizarMensaje,
} from "./textNormalizer.js";

import {
  crearChatbotRepository,
} from "../repositories/chatbotRepository.js";

import {
  crearProcesadorChatbot,
} from "../services/chatbotApplicationService.js";

import {
  ejecutarConsultaChatbot,
} from "../services/chatbotQueryService.js";

describe(
  "Préstamos activos del chatbot",
  () => {
    test(
      "reconoce quién tiene los cilindros prestados",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Qué cilindros están prestados y quién los tiene?",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_prestamos_activos",
        );
      },
    );

    test(
      "reconoce una consulta de préstamos activos",
      () => {
        const mensaje =
          normalizarMensaje(
            "Muéstrame los préstamos activos",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_prestamos_activos",
        );
      },
    );

    test(
      "calcula el tiempo de préstamo y devuelve datos seguros",
      async () => {
        const repositorio = {
          listarPrestamosActivos:
            async (limite) => {
              assert.equal(
                limite,
                11,
              );

              return [
                {
                  cilindro: {
                    codigo:
                      "CIL-001",
                  },
                  salida: {
                    fecha:
                      "2026-08-02T12:00:00.000Z",
                    cliente: {
                      nombre:
                        "Ana Torres",
                    },
                  },
                },
                {
                  cilindro: {
                    codigo:
                      "CIL-002",
                  },
                  salida: {
                    fecha:
                      "2026-08-06T12:00:00.000Z",
                    cliente: {
                      nombre:
                        "Luis Pérez",
                    },
                  },
                },
              ];
            },
        };

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_prestamos_activos",
              parametros: {},
            },
            {
              repositorio,
              ahora:
                new Date(
                  "2026-08-07T12:00:00.000Z",
                ),
            },
          );

        assert.deepEqual(
          resultado.datos,
          [
            {
              codigo:
                "CIL-001",
              cliente:
                "Ana Torres",
              fechaSalida:
                "2026-08-02T12:00:00.000Z",
              diasPrestado:
                5,
              requiereRevision:
                false,
            },
            {
              codigo:
                "CIL-002",
              cliente:
                "Luis Pérez",
              fechaSalida:
                "2026-08-06T12:00:00.000Z",
              diasPrestado:
                1,
              requiereRevision:
                false,
            },
          ],
        );

        assert.match(
          resultado.respuesta,
          /CIL-001.*Ana Torres.*5 días en préstamo/s,
        );

        assert.match(
          resultado.respuesta,
          /CIL-002.*Luis Pérez.*1 día en préstamo/s,
        );
      },
    );

    test(
      "marca un cilindro prestado sin salida asociada",
      async () => {
        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_prestamos_activos",
              parametros: {},
            },
            {
              repositorio: {
                listarPrestamosActivos:
                  async () => [
                    {
                      cilindro: {
                        codigo:
                          "CIL-009",
                      },
                      salida: null,
                    },
                  ],
              },

              ahora:
                new Date(
                  "2026-08-07T12:00:00.000Z",
                ),
            },
          );

        assert.equal(
          resultado
            .datos[0]
            .requiereRevision,
          true,
        );

        assert.match(
  resultado.respuesta,
  /no se encontró una salida asociada/,
);
      },
    );

        test(
      "detecta una salida cuyo cliente ya no está disponible",
      async () => {
        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_prestamos_activos",
              parametros: {},
            },
            {
              repositorio: {
                listarPrestamosActivos:
                  async () => [
                    {
                      cilindro: {
                        codigo:
                          "CIL-002",
                      },
                      salida: {
                        fecha:
                          "2026-06-25T13:30:01.126Z",
                        cliente: null,
                      },
                    },
                  ],
              },

              ahora:
                new Date(
                  "2026-08-07T13:30:01.126Z",
                ),
            },
          );

        assert.equal(
          resultado
            .datos[0]
            .requiereRevision,
          true,
        );

        assert.equal(
          resultado
            .datos[0]
            .cliente,
          null,
        );

        assert.equal(
          resultado
            .datos[0]
            .motivoRevision,
          "La salida existe, pero el cliente asociado no está disponible en el sistema.",
        );

        assert.match(
          resultado.respuesta,
          /CIL-002/,
        );

        assert.match(
          resultado.respuesta,
          /cliente asociado no está disponible/,
        );

        assert.match(
          resultado.respuesta,
          /25\/06\/2026/,
        );
      },
    );

    test(
      "el repositorio obtiene la última salida de cada cilindro prestado",
      async () => {
        const registro = {
          filtrosSalidas: [],
        };

        const cilindros = [
          {
            _id: "cil-1",
            codigo:
              "CIL-001",
            estado:
              "Prestado",
          },
          {
            _id: "cil-2",
            codigo:
              "CIL-002",
            estado:
              "Prestado",
          },
        ];

        const consultaCilindros = {
          select(valor) {
            registro
              .proyeccionCilindros =
                valor;

            return this;
          },

          sort(valor) {
            registro
              .ordenCilindros =
                valor;

            return this;
          },

          limit(valor) {
            registro
              .limiteCilindros =
                valor;

            return this;
          },

          lean() {
            return Promise.resolve(
              cilindros,
            );
          },
        };

        const cilindroModel = {
          find(filtro) {
            registro
              .filtroCilindros =
                filtro;

            return consultaCilindros;
          },
        };

        const movimientoModel = {
          findOne(filtro) {
            registro
              .filtrosSalidas
              .push(
                filtro,
              );

            const salida =
              filtro.cilindro
                === "cil-1"
                ? {
                  fecha:
                    "2026-08-01T12:00:00.000Z",
                  cliente: {
                    nombre:
                      "Ana Torres",
                  },
                }
                : {
                  fecha:
                    "2026-08-03T12:00:00.000Z",
                  cliente: {
                    nombre:
                      "Luis Pérez",
                  },
                };

            return {
              select(valor) {
                registro
                  .proyeccionSalida =
                    valor;

                return this;
              },

              populate(
                campo,
                proyeccion,
              ) {
                registro
                  .populateSalida = {
                    campo,
                    proyeccion,
                  };

                return this;
              },

              sort(valor) {
                registro
                  .ordenSalida =
                    valor;

                return this;
              },

              lean() {
                return Promise.resolve(
                  salida,
                );
              },
            };
          },
        };

        const repositorio =
          crearChatbotRepository({
            cilindroModel,
            movimientoModel,
            clienteModel: {},
          });

        const resultado =
          await repositorio
            .listarPrestamosActivos(
              11,
            );

        assert.deepEqual(
          registro.filtroCilindros,
          {
            estado: "Prestado",
          },
        );

        assert.equal(
          registro.limiteCilindros,
          11,
        );

        assert.deepEqual(
          registro.ordenSalida,
          {
            fecha: -1,
          },
        );

        assert.deepEqual(
          registro.filtrosSalidas,
          [
            {
              cilindro:
                "cil-1",
              tipo:
                "Salida",
            },
            {
              cilindro:
                "cil-2",
              tipo:
                "Salida",
            },
          ],
        );

        assert.equal(
          resultado.length,
          2,
        );

        assert.equal(
          resultado[0]
            .salida
            .cliente
            .nombre,
          "Ana Torres",
        );
      },
    );

    test(
      "integra la consulta completa de préstamos activos",
      async () => {
        const procesarMensaje =
          crearProcesadorChatbot({
            repositorio: {
              listarPrestamosActivos:
                async () => [
                  {
                    cilindro: {
                      codigo:
                        "CIL-001",
                    },
                    salida: {
                      fecha:
                        "2026-08-02T12:00:00.000Z",
                      cliente: {
                        nombre:
                          "Ana Torres",
                      },
                    },
                  },
                ],
            },

            ahora:
              new Date(
                "2026-08-07T12:00:00.000Z",
              ),
          });

        const resultado =
          await procesarMensaje(
            "¿Quién tiene los cilindros prestados?",
          );

        assert.equal(
          resultado.intencion,
          "consultar_prestamos_activos",
        );

        assert.equal(
          resultado
            .datos[0]
            .codigo,
          "CIL-001",
        );

        assert.equal(
          resultado
            .datos[0]
            .cliente,
          "Ana Torres",
        );
      },
    );
  },
);