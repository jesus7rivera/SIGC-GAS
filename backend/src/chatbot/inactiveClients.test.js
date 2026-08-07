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
  extraerParametros,
} from "./entityExtractor.js";

import {
  ejecutarConsultaChatbot,
} from "../services/chatbotQueryService.js";

import {
  crearChatbotRepository,
} from "../repositories/chatbotRepository.js";

import {
  crearProcesadorChatbot,
} from "../services/chatbotApplicationService.js";

describe(
  "Clientes sin actividad del chatbot",
  () => {
    test(
      "reconoce clientes con más de 30 días sin actividad",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Qué clientes llevan más de 30 días sin actividad?",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_clientes_sin_actividad",
        );
      },
    );

    test(
      "reconoce clientes sin movimientos por más de 15 días",
      () => {
        const mensaje =
          normalizarMensaje(
            "Muéstrame los clientes sin movimientos hace más de 15 días",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_clientes_sin_actividad",
        );
      },
    );

    test(
      "reconoce clientes con mucho tiempo sin actividad",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Qué clientes llevan mucho tiempo sin actividad?",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_clientes_sin_actividad",
        );
      },
    );

    test(
      "mantiene separado el listado normal de clientes",
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
  "extrae 30 días como umbral de inactividad",
  () => {
    const mensaje =
      normalizarMensaje(
        "¿Qué clientes llevan más de 30 días sin actividad?",
      );

    const parametros =
      extraerParametros(
        "consultar_clientes_sin_actividad",
        mensaje,
      );

    assert.deepEqual(
      parametros,
      {
        diasMinimos: 30,
      },
    );
  },
);

test(
  "extrae 15 días como umbral de inactividad",
  () => {
    const mensaje =
      normalizarMensaje(
        "Muéstrame los clientes sin movimientos hace más de 15 días",
      );

    const parametros =
      extraerParametros(
        "consultar_clientes_sin_actividad",
        mensaje,
      );

    assert.deepEqual(
      parametros,
      {
        diasMinimos: 15,
      },
    );
  },
);

test(
  "utiliza 30 días cuando no se indica un umbral",
  () => {
    const mensaje =
      normalizarMensaje(
        "¿Qué clientes llevan mucho tiempo sin actividad?",
      );

    const parametros =
      extraerParametros(
        "consultar_clientes_sin_actividad",
        mensaje,
      );

    assert.deepEqual(
      parametros,
      {
        diasMinimos: 30,
      },
    );
  },
);

test(
  "devuelve únicamente clientes que superan el umbral de inactividad",
  async () => {
    const repositorio = {
      listarClientesActivosParaSeguimiento:
        async () => [
          {
            cliente: {
              nombre: "Ana Torres",
              createdAt:
                "2026-01-10T12:00:00.000Z",
            },
            ultimoMovimiento: {
              fecha:
                "2026-06-28T12:00:00.000Z",
            },
          },
          {
            cliente: {
              nombre: "Luis Pérez",
              createdAt:
                "2026-01-15T12:00:00.000Z",
            },
            ultimoMovimiento: {
              fecha:
                "2026-07-08T12:00:00.000Z",
            },
          },
          {
            cliente: {
              nombre: "María Soto",
              createdAt:
                "2026-06-18T12:00:00.000Z",
            },
            ultimoMovimiento: null,
          },
          {
            cliente: {
              nombre: "Carlos Rojas",
              createdAt:
                "2026-07-28T12:00:00.000Z",
            },
            ultimoMovimiento: null,
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_clientes_sin_actividad",
          parametros: {
            diasMinimos: 30,
          },
        },
        {
          repositorio,
          ahora:
            new Date(
              "2026-08-07T12:00:00.000Z",
            ),
        },
      );

    assert.equal(
      resultado.datos.length,
      2,
    );

    assert.equal(
      resultado.datos[0].nombre,
      "Ana Torres",
    );

    assert.equal(
      resultado.datos[0]
        .diasSinActividad,
      40,
    );

    assert.equal(
      resultado.datos[0]
        .sinMovimientos,
      false,
    );

    assert.equal(
      resultado.datos[1].nombre,
      "María Soto",
    );

    assert.equal(
      resultado.datos[1]
        .diasSinActividad,
      50,
    );

    assert.equal(
      resultado.datos[1]
        .sinMovimientos,
      true,
    );
  },
);

test(
  "responde cuando ningún cliente supera el umbral de inactividad",
  async () => {
    const repositorio = {
      listarClientesActivosParaSeguimiento:
        async () => [
          {
            cliente: {
              nombre: "Carlos Rojas",
              createdAt:
                "2026-01-10T12:00:00.000Z",
            },
            ultimoMovimiento: {
              fecha:
                "2026-07-28T12:00:00.000Z",
            },
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_clientes_sin_actividad",
          parametros: {
            diasMinimos: 30,
          },
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
      [],
    );

    assert.match(
      resultado.respuesta,
      /30 d[ií]as/i,
    );
  },
);
test(
  "el repositorio obtiene la última actividad de cada cliente activo",
  async () => {
    const registro = {
      filtrosMovimientos: [],
      proyeccionesMovimientos: [],
      ordenesMovimientos: [],
    };

    const clientes = [
      {
        _id: "cli-1",
        nombre: "Ana Torres",
        estado: "Activo",
        createdAt:
          "2026-01-10T12:00:00.000Z",
      },
      {
        _id: "cli-2",
        nombre: "Luis Pérez",
        estado: "Activo",
        createdAt:
          "2026-02-10T12:00:00.000Z",
      },
    ];

    const consultaClientes = {
      select(valor) {
        registro.proyeccionClientes =
          valor;

        return this;
      },

      sort(valor) {
        registro.ordenClientes =
          valor;

        return this;
      },

      lean() {
        return Promise.resolve(
          clientes,
        );
      },
    };

    const clienteModel = {
      find(filtro) {
        registro.filtroClientes =
          filtro;

        return consultaClientes;
      },
    };

    const movimientoModel = {
      findOne(filtro) {
        registro.filtrosMovimientos
          .push(
            filtro,
          );

        const movimiento =
          filtro.cliente === "cli-1"
            ? {
                fecha:
                  "2026-06-28T12:00:00.000Z",
              }
            : null;

        return {
          select(valor) {
            registro
              .proyeccionesMovimientos
              .push(
                valor,
              );

            return this;
          },

          sort(valor) {
            registro
              .ordenesMovimientos
              .push(
                valor,
              );

            return this;
          },

          lean() {
            return Promise.resolve(
              movimiento,
            );
          },
        };
      },
    };

    const repositorio =
      crearChatbotRepository({
        clienteModel,
        movimientoModel,
        cilindroModel: {},
      });

    const resultado =
      await repositorio
        .listarClientesActivosParaSeguimiento();

    assert.deepEqual(
      registro.filtroClientes,
      {
        estado: "Activo",
      },
    );

    assert.equal(
      registro.proyeccionClientes,
      "_id nombre estado createdAt",
    );

    assert.deepEqual(
      registro.ordenClientes,
      {
        nombre: 1,
      },
    );

    assert.deepEqual(
      registro.filtrosMovimientos,
      [
        {
          cliente: "cli-1",
        },
        {
          cliente: "cli-2",
        },
      ],
    );

    assert.deepEqual(
      registro.proyeccionesMovimientos,
      [
        "fecha",
        "fecha",
      ],
    );

    assert.deepEqual(
      registro.ordenesMovimientos,
      [
        {
          fecha: -1,
        },
        {
          fecha: -1,
        },
      ],
    );

    assert.deepEqual(
      resultado,
      [
        {
          cliente:
            clientes[0],
          ultimoMovimiento: {
            fecha:
              "2026-06-28T12:00:00.000Z",
          },
        },
        {
          cliente:
            clientes[1],
          ultimoMovimiento:
            null,
        },
      ],
    );
  },
);
test(
  "integra la consulta completa de clientes sin actividad",
  async () => {
    const procesarMensaje =
      crearProcesadorChatbot({
        repositorio: {
          listarClientesActivosParaSeguimiento:
            async () => [
              {
                cliente: {
                  nombre:
                    "Ana Torres",
                  createdAt:
                    "2026-01-10T12:00:00.000Z",
                },
                ultimoMovimiento: {
                  fecha:
                    "2026-06-28T12:00:00.000Z",
                },
              },
              {
                cliente: {
                  nombre:
                    "Luis Pérez",
                  createdAt:
                    "2026-01-15T12:00:00.000Z",
                },
                ultimoMovimiento: {
                  fecha:
                    "2026-07-28T12:00:00.000Z",
                },
              },
              {
                cliente: {
                  nombre:
                    "María Soto",
                  createdAt:
                    "2026-06-18T12:00:00.000Z",
                },
                ultimoMovimiento:
                  null,
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
        "¿Qué clientes llevan más de 30 días sin actividad?",
      );

    assert.equal(
      resultado.intencion,
      "consultar_clientes_sin_actividad",
    );

    assert.deepEqual(
      resultado.parametros,
      {
        diasMinimos: 30,
      },
    );

    assert.equal(
      resultado.datos.length,
      2,
    );

    assert.equal(
      resultado.datos[0].nombre,
      "Ana Torres",
    );

    assert.equal(
      resultado.datos[0]
        .diasSinActividad,
      40,
    );

    assert.equal(
      resultado.datos[1].nombre,
      "María Soto",
    );

    assert.equal(
      resultado.datos[1]
        .sinMovimientos,
      true,
    );

    assert.match(
      resultado.respuesta,
      /más de 30 días/i,
    );
  },
);
test(
  "usa singular cuando solo existe un cliente sin actividad",
  async () => {
    const repositorio = {
      listarClientesActivosParaSeguimiento:
        async () => [
          {
            cliente: {
              nombre: "Juan Pérez",
              createdAt:
                "2026-01-10T12:00:00.000Z",
            },
            ultimoMovimiento: {
              fecha:
                "2026-06-25T12:00:00.000Z",
            },
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_clientes_sin_actividad",
          parametros: {
            diasMinimos: 30,
          },
        },
        {
          repositorio,
          ahora:
            new Date(
              "2026-08-07T12:00:00.000Z",
            ),
        },
      );

    assert.match(
      resultado.respuesta,
      /1 cliente activo lleva más de 30 días/i,
    );
  },
);
  },
);