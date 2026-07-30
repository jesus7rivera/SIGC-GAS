import assert
  from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  extraerParametros,
} from "./entityExtractor.js";

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

import {
  procesarMensajeChatbot,
} from "../services/chatbotService.js";

describe(
  "Listado de clientes del chatbot",
  () => {
    test(
      "clasifica una solicitud de listado de clientes",
      () => {
        const mensaje =
          normalizarMensaje(
            "Muéstrame los clientes activos",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "listar_clientes_estado",
        );
      },
    );

    test(
      "extrae el estado del listado",
      () => {
        const mensaje =
          normalizarMensaje(
            "Lista los clientes inactivos",
          );

        assert.deepEqual(
          extraerParametros(
            "listar_clientes_estado",
            mensaje,
          ),
          {
            estado: "Inactivo",
          },
        );
      },
    );

    test(
      "solicita el estado cuando no fue indicado",
      async () => {
        const resultado =
          await procesarMensajeChatbot(
            "Muéstrame los clientes",
          );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "listar_clientes_estado",
            parametros: {},
            respuesta:
              "Indica si deseas consultar clientes activos, inactivos o todos los registrados.",
            datos: null,
          },
        );
      },
    );

    test(
      "lista únicamente datos permitidos",
      async () => {
        const repositorio = {
          listarClientesPorEstado:
            async (
              estado,
              limite,
            ) => {
              assert.equal(
                estado,
                "Activo",
              );

              assert.equal(
                limite,
                11,
              );

              return [
                {
                  nombre:
                    "Ana Torres",
                  estado:
                    "Activo",
                  dni:
                    "12345678",
                  telefono:
                    "900000001",
                },
                {
                  nombre:
                    "Luis Pérez",
                  estado:
                    "Activo",
                  dni:
                    "87654321",
                  telefono:
                    "900000002",
                },
              ];
            },
        };

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "listar_clientes_estado",
              parametros: {
                estado: "Activo",
              },
            },
            {
              repositorio,
            },
          );

        assert.deepEqual(
          resultado,
          {
            respuesta:
              "Se encontraron 2 clientes activos.",
            datos: [
              {
                nombre:
                  "Ana Torres",
                estado:
                  "Activo",
              },
              {
                nombre:
                  "Luis Pérez",
                estado:
                  "Activo",
              },
            ],
          },
        );
      },
    );

    test(
      "el repositorio aplica filtro proyección orden y límite",
      async () => {
        const registro = {};

        const clientes = [
          {
            nombre:
              "Ana Torres",
            estado:
              "Activo",
          },
        ];

        const consulta = {
          select(valor) {
            registro.select =
              valor;

            return this;
          },

          sort(valor) {
            registro.sort =
              valor;

            return this;
          },

          limit(valor) {
            registro.limit =
              valor;

            return this;
          },

          lean() {
            registro.lean =
              true;

            return Promise.resolve(
              clientes,
            );
          },
        };

        const clienteModel = {
          find(filtro) {
            registro.filtro =
              filtro;

            return consulta;
          },
        };

        const repositorio =
          crearChatbotRepository({
            clienteModel,
            cilindroModel: {},
            movimientoModel: {},
          });

        const resultado =
          await repositorio
            .listarClientesPorEstado(
              "Activo",
              11,
            );

        assert.deepEqual(
          registro.filtro,
          {
            estado: "Activo",
          },
        );

        assert.equal(
          registro.select,
          "nombre estado",
        );

        assert.deepEqual(
          registro.sort,
          {
            nombre: 1,
            dni: 1,
          },
        );

        assert.equal(
          registro.limit,
          11,
        );

        assert.equal(
          registro.lean,
          true,
        );

        assert.deepEqual(
          resultado,
          clientes,
        );
      },
    );

    test(
      "integra clasificación extracción y consulta",
      async () => {
        const procesarMensaje =
          crearProcesadorChatbot({
            repositorio: {
              listarClientesPorEstado:
                async () => [
                  {
                    nombre:
                      "Ana Torres",
                    estado:
                      "Activo",
                  },
                ],
            },
          });

        const resultado =
          await procesarMensaje(
            "¿Quiénes son los clientes activos?",
          );

        assert.deepEqual(
          resultado,
          {
            intencion:
              "listar_clientes_estado",
            parametros: {
              estado: "Activo",
            },
            respuesta:
              "Se encontró 1 cliente activo.",
            datos: [
              {
                nombre:
                  "Ana Torres",
                estado:
                  "Activo",
              },
            ],
          },
        );
      },
    );
  },
);