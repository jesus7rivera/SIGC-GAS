import assert from "node:assert/strict";
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
  ejecutarConsultaChatbot,
} from "../services/chatbotQueryService.js";

import {
  crearProcesadorChatbot,
} from "../services/chatbotApplicationService.js";

describe(
  "Resumen de riesgo del chatbot",
  () => {
    test(
      "reconoce una solicitud de resumen de riesgos",
      () => {
        const mensaje =
          normalizarMensaje(
            "Dame un resumen de riesgos",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_resumen_riesgo",
        );
      },
    );

    test(
      "reconoce el riesgo actual del negocio",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Cómo está el riesgo del negocio?",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_resumen_riesgo",
        );
      },
    );

    test(
      "reconoce situaciones que requieren revisión",
      () => {
        const mensaje =
          normalizarMensaje(
            "Muéstrame las situaciones que requieren revisión",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_resumen_riesgo",
        );
      },
    );

    test(
      "mantiene separado el resumen general del sistema",
      () => {
        const mensaje =
          normalizarMensaje(
            "Dame un resumen del sistema",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_resumen",
        );
      },
    );
    test(
  "combina las señales operativas que requieren seguimiento",
  async () => {
    const repositorio = {
      listarPrestamosActivosParaSeguimiento:
        async () => [
          {
            cilindro: {
              codigo: "CIL-001",
            },
            salida: {
              fecha:
                "2026-06-28T12:00:00.000Z",
              cliente: {
                nombre: "Ana Torres",
              },
            },
          },
          {
            cilindro: {
              codigo: "CIL-002",
            },
            salida: {
              fecha:
                "2026-07-18T12:00:00.000Z",
              cliente: {
                nombre: "Luis Pérez",
              },
            },
          },
        ],

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
          {
            cliente: {
              nombre: "Renzo Bernedo",
              createdAt:
                "2026-01-15T12:00:00.000Z",
            },
            ultimoMovimiento: {
              fecha:
                "2026-07-10T12:00:00.000Z",
            },
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_resumen_riesgo",
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

    assert.equal(
      resultado.datos
        .prestamosProlongados.length,
      1,
    );

    assert.equal(
      resultado.datos
        .clientesSinActividad.length,
      1,
    );

    assert.equal(
      resultado.datos
        .totalSituaciones,
      2,
    );

    assert.equal(
      resultado.datos.diasMinimos,
      30,
    );

    assert.match(
      resultado.respuesta,
      /pr[eé]stamos prolongados:\s*1/i,
    );

    assert.match(
      resultado.respuesta,
      /clientes sin actividad:\s*1/i,
    );

    assert.match(
      resultado.respuesta,
      /2 situaciones/i,
    );
  },
);

test(
  "indica cuando no existen señales operativas para seguimiento",
  async () => {
    const repositorio = {
      listarPrestamosActivosParaSeguimiento:
        async () => [
          {
            cilindro: {
              codigo: "CIL-010",
            },
            salida: {
              fecha:
                "2026-07-28T12:00:00.000Z",
              cliente: {
                nombre: "Ana Torres",
              },
            },
          },
        ],

      listarClientesActivosParaSeguimiento:
        async () => [
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
            "consultar_resumen_riesgo",
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

    assert.equal(
      resultado.datos
        .totalSituaciones,
      0,
    );

    assert.deepEqual(
      resultado.datos
        .prestamosProlongados,
      [],
    );

    assert.deepEqual(
      resultado.datos
        .clientesSinActividad,
      [],
    );

    assert.match(
      resultado.respuesta,
      /no se detectaron/i,
    );
  },
);
test(
  "cuenta todas las señales aunque superen el límite de resultados mostrados",
  async () => {
    const prestamos =
      Array.from(
        {
          length: 12,
        },
        (_, indice) => ({
          cilindro: {
            codigo:
              `CIL-${String(
                indice + 1,
              ).padStart(3, "0")}`,
          },
          salida: {
            fecha:
              "2026-06-01T12:00:00.000Z",
            cliente: {
              nombre:
                `Cliente préstamo ${indice + 1}`,
            },
          },
        }),
      );

    const clientes =
      Array.from(
        {
          length: 11,
        },
        (_, indice) => ({
          cliente: {
            nombre:
              `Cliente inactivo ${indice + 1}`,
            createdAt:
              "2026-01-01T12:00:00.000Z",
          },
          ultimoMovimiento: {
            fecha:
              "2026-06-01T12:00:00.000Z",
          },
        }),
      );

    const repositorio = {
      listarPrestamosActivosParaSeguimiento:
        async () => prestamos,

      listarClientesActivosParaSeguimiento:
        async () => clientes,
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_resumen_riesgo",
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

    assert.equal(
      resultado.datos
        .totalSituaciones,
      23,
    );

    assert.match(
      resultado.respuesta,
      /pr[eé]stamos prolongados:\s*12/i,
    );

    assert.match(
      resultado.respuesta,
      /clientes sin actividad:\s*11/i,
    );

    assert.match(
      resultado.respuesta,
      /23 situaciones/i,
    );
  },
);
test(
  "integra la consulta completa del resumen de riesgo",
  async () => {
    const procesarMensaje =
      crearProcesadorChatbot({
        repositorio: {
          listarPrestamosActivosParaSeguimiento:
            async () => [
              {
                cilindro: {
                  codigo: "CIL-001",
                },
                salida: {
                  fecha:
                    "2026-06-28T12:00:00.000Z",
                  cliente: {
                    nombre: "Ana Torres",
                  },
                },
              },
              {
                cilindro: {
                  codigo: "CIL-002",
                },
                salida: {
                  fecha:
                    "2026-07-28T12:00:00.000Z",
                  cliente: {
                    nombre: "Luis Pérez",
                  },
                },
              },
            ],

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
        },

        ahora:
          new Date(
            "2026-08-07T12:00:00.000Z",
          ),
      });

    const resultado =
      await procesarMensaje(
        "Dame un resumen de riesgos",
      );

    assert.equal(
      resultado.intencion,
      "consultar_resumen_riesgo",
    );

    assert.equal(
      resultado.datos
        .prestamosProlongados.length,
      1,
    );

    assert.equal(
      resultado.datos
        .clientesSinActividad.length,
      1,
    );

    assert.equal(
      resultado.datos
        .totalSituaciones,
      2,
    );

    assert.match(
      resultado.respuesta,
      /resumen de seguimiento/i,
    );

    assert.match(
      resultado.respuesta,
      /2 situaciones/i,
    );
  },
);
  },
);