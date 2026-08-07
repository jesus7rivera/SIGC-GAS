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
  crearProcesadorChatbot,
} from "../services/chatbotApplicationService.js";

describe(
  "Préstamos prolongados del chatbot",
  () => {
    test(
      "reconoce cilindros prestados por más de 30 días",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Qué cilindros llevan más de 30 días prestados?",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_prestamos_antiguos",
        );
      },
    );

    test(
      "reconoce préstamos de más de 15 días",
      () => {
        const mensaje =
          normalizarMensaje(
            "Muéstrame los préstamos de más de 15 días",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_prestamos_antiguos",
        );
      },
    );

    test(
      "reconoce una consulta sin indicar cantidad de días",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Qué cilindros llevan demasiado tiempo prestados?",
          );

        assert.equal(
          clasificarIntencion(
            mensaje,
          ),
          "consultar_prestamos_antiguos",
        );
      },
    );

    test(
      "mantiene separada la consulta de responsables",
      () => {
        const mensaje =
          normalizarMensaje(
            "¿Quién tiene los cilindros prestados?",
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
  "extrae 30 días como umbral de seguimiento",
  () => {
    const mensaje =
      normalizarMensaje(
        "¿Qué cilindros llevan más de 30 días prestados?",
      );

    const parametros =
      extraerParametros(
        "consultar_prestamos_antiguos",
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
  "extrae 15 días como umbral de seguimiento",
  () => {
    const mensaje =
      normalizarMensaje(
        "Muéstrame los préstamos de más de 15 días",
      );

    const parametros =
      extraerParametros(
        "consultar_prestamos_antiguos",
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
        "¿Qué cilindros llevan demasiado tiempo prestados?",
      );

    const parametros =
      extraerParametros(
        "consultar_prestamos_antiguos",
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
  "no limita los días al máximo de diez resultados",
  () => {
    const mensaje =
      normalizarMensaje(
        "Muéstrame los préstamos de más de 120 días",
      );

    const parametros =
      extraerParametros(
        "consultar_prestamos_antiguos",
        mensaje,
      );

    assert.deepEqual(
      parametros,
      {
        diasMinimos: 120,
      },
    );
  },
);

test(
  "devuelve únicamente préstamos que superan el umbral indicado",
  async () => {
    const repositorio = {
      listarPrestamosActivosParaSeguimiento:
        async () => [
          {
            cilindro: {
              codigo: "CIL-040",
            },
            salida: {
              fecha:
                "2026-06-28T12:00:00.000Z",
              cliente: {
                nombre:
                  "Ana Torres",
              },
            },
          },
          {
            cilindro: {
              codigo: "CIL-030",
            },
            salida: {
              fecha:
                "2026-07-08T12:00:00.000Z",
              cliente: {
                nombre:
                  "Luis Pérez",
              },
            },
          },
          {
            cilindro: {
              codigo: "CIL-010",
            },
            salida: {
              fecha:
                "2026-07-28T12:00:00.000Z",
              cliente: {
                nombre:
                  "Carlos Rojas",
              },
            },
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_prestamos_antiguos",
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
      1,
    );

    assert.equal(
      resultado.datos[0].codigo,
      "CIL-040",
    );

    assert.equal(
      resultado.datos[0]
        .diasPrestado,
      40,
    );
  },
);

test(
  "mantiene una inconsistencia cuando supera el umbral",
  async () => {
    const repositorio = {
      listarPrestamosActivosParaSeguimiento:
        async () => [
          {
            cilindro: {
              codigo:
                "CIL-REVISION",
            },
            salida: {
              fecha:
                "2026-06-28T12:00:00.000Z",
              cliente: null,
            },
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_prestamos_antiguos",
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
      1,
    );

    assert.equal(
      resultado.datos[0]
        .requiereRevision,
      true,
    );

    assert.equal(
      resultado.datos[0]
        .cliente,
      null,
    );
  },
);

test(
  "responde cuando ningún préstamo supera el umbral",
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
                nombre:
                  "Ana Torres",
              },
            },
          },
        ],
    };

    const resultado =
      await ejecutarConsultaChatbot(
        {
          intencion:
            "consultar_prestamos_antiguos",
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
  "integra la consulta completa de préstamos prolongados",
  async () => {
    const procesarMensaje =
      crearProcesadorChatbot({
        repositorio: {
          listarPrestamosActivosParaSeguimiento:
            async () => [
              {
                cilindro: {
                  codigo:
                    "CIL-040",
                },
                salida: {
                  fecha:
                    "2026-06-28T12:00:00.000Z",
                  cliente: {
                    nombre:
                      "Ana Torres",
                  },
                },
              },
              {
                cilindro: {
                  codigo:
                    "CIL-020",
                },
                salida: {
                  fecha:
                    "2026-07-18T12:00:00.000Z",
                  cliente: {
                    nombre:
                      "Luis Pérez",
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
        "¿Qué cilindros llevan más de 30 días prestados?",
      );

    assert.equal(
      resultado.intencion,
      "consultar_prestamos_antiguos",
    );

    assert.deepEqual(
      resultado.parametros,
      {
        diasMinimos: 30,
      },
    );

    assert.equal(
      resultado.datos.length,
      1,
    );

    assert.equal(
      resultado.datos[0].codigo,
      "CIL-040",
    );

    assert.equal(
      resultado.datos[0]
        .cliente,
      "Ana Torres",
    );

    assert.equal(
      resultado.datos[0]
        .diasPrestado,
      40,
    );

    assert.match(
      resultado.respuesta,
      /más de 30 días/i,
    );
  },
);
  },
);