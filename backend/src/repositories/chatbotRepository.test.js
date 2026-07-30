import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  crearChatbotRepository,
} from "./chatbotRepository.js";

const crearConsultaSimulada = (
  resultado,
  registro,
) => {
  const consulta = {
    select(proyeccion) {
      registro.select = proyeccion;

      return consulta;
    },

    populate(
      campo,
      proyeccion,
    ) {
      registro.populate.push({
        campo,
        proyeccion,
      });

      return consulta;
    },

    sort(orden) {
      registro.sort = orden;

      return consulta;
    },

    limit(limite) {
      registro.limit = limite;

      return consulta;
    },

    lean() {
      registro.lean = true;

      return Promise.resolve(
        resultado,
      );
    },
  };

  return consulta;
};

describe(
  "Repositorio de clientes del chatbot",
  () => {
    test(
      "cuenta clientes por estado y todos los registrados",
      async () => {
        const filtros = [];

        const clienteModel = {
          countDocuments:
            async (filtro) => {
              filtros.push(filtro);

              return filtro.estado
                ? 12
                : 15;
            },
        };

        const repositorio =
          crearChatbotRepository({
            clienteModel,
          });

        const activos =
          await repositorio
            .contarClientesPorEstado(
              "Activo",
            );

        const todos =
          await repositorio
            .contarClientesPorEstado(
              "Todos",
            );

        assert.equal(
          activos,
          12,
        );

        assert.equal(
          todos,
          15,
        );

        assert.deepEqual(
          filtros,
          [
            {
              estado: "Activo",
            },
            {},
          ],
        );
      },
    );

    test(
      "busca un cliente por DNI con proyección segura",
      async () => {
        const registro = {
          populate: [],
        };

        const clienteEsperado = {
          dni: "12345678",
          nombre: "Juan Pérez",
          telefono: "900000001",
          estado: "Activo",
        };

        const clienteModel = {
          findOne(filtro) {
            registro.filtro = filtro;

            return crearConsultaSimulada(
              clienteEsperado,
              registro,
            );
          },
        };

        const repositorio =
          crearChatbotRepository({
            clienteModel,
          });

        const resultado =
          await repositorio
            .buscarClientePorDni(
              "12345678",
            );

        assert.deepEqual(
          registro.filtro,
          {
            dni: "12345678",
          },
        );

        assert.equal(
          registro.select,
          "dni nombre telefono estado",
        );

        assert.equal(
          registro.lean,
          true,
        );

        assert.deepEqual(
          resultado,
          clienteEsperado,
        );
      },
    );
  },
);

describe(
  "Repositorio de cilindros del chatbot",
  () => {
    test(
      "cuenta cilindros por estado",
      async () => {
        let filtroRecibido = null;

        const cilindroModel = {
          countDocuments:
            async (filtro) => {
              filtroRecibido = filtro;

              return 8;
            },
        };

        const repositorio =
          crearChatbotRepository({
            cilindroModel,
          });

        const resultado =
          await repositorio
            .contarCilindrosPorEstado(
              "Disponible",
            );

        assert.equal(
          resultado,
          8,
        );

        assert.deepEqual(
          filtroRecibido,
          {
            estado: "Disponible",
          },
        );
      },
    );

    test(
      "lista cilindros con orden, límite y proyección",
      async () => {
        const registro = {
          populate: [],
        };

        const cilindros = [
          {
            codigo: "CIL-001",
            tipo: "Doméstico",
            capacidad: "10 Kg",
            estado: "Disponible",
          },
        ];

        const cilindroModel = {
          find(filtro) {
            registro.filtro = filtro;

            return crearConsultaSimulada(
              cilindros,
              registro,
            );
          },
        };

        const repositorio =
          crearChatbotRepository({
            cilindroModel,
          });

        const resultado =
          await repositorio
            .listarCilindrosPorEstado(
              "Disponible",
              11,
            );

        assert.deepEqual(
          registro.filtro,
          {
            estado: "Disponible",
          },
        );

        assert.equal(
          registro.select,
          "_id codigo tipo capacidad estado",
        );

        assert.deepEqual(
          registro.sort,
          {
            codigo: 1,
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
          cilindros,
        );
      },
    );

    test(
      "normaliza y busca un cilindro por código",
      async () => {
        const registro = {
          populate: [],
        };

        const cilindroModel = {
          findOne(filtro) {
            registro.filtro = filtro;

            return crearConsultaSimulada(
              {
                _id: "cilindro-id",
                codigo: "CIL-A25",
                tipo: "Industrial",
                capacidad: "45 Kg",
                estado: "Disponible",
              },
              registro,
            );
          },
        };

        const repositorio =
          crearChatbotRepository({
            cilindroModel,
          });

        await repositorio
          .buscarCilindroPorCodigo(
            "  cil-a25  ",
          );

        assert.deepEqual(
          registro.filtro,
          {
            codigo: "CIL-A25",
          },
        );

        assert.equal(
          registro.select,
          "_id codigo tipo capacidad estado",
        );

        assert.equal(
          registro.lean,
          true,
        );
      },
    );
  },
);

describe(
  "Repositorio de movimientos del chatbot",
  () => {
    const movimientos = [
      {
        fecha:
          "2026-07-28T15:30:00.000Z",
        cliente: {
          nombre: "Juan Pérez",
        },
        cilindro: {
          codigo: "CIL-001",
        },
        tipo: "Salida",
        observacion:
          "Entrega registrada",
      },
    ];

    test(
      "lista movimientos recientes",
      async () => {
        const registro = {
          populate: [],
        };

        const movimientoModel = {
          find(filtro) {
            registro.filtro = filtro;

            return crearConsultaSimulada(
              movimientos,
              registro,
            );
          },
        };

        const repositorio =
          crearChatbotRepository({
            movimientoModel,
          });

        const resultado =
          await repositorio
            .listarMovimientosRecientes(
              7,
            );

        assert.deepEqual(
          registro.filtro,
          {},
        );

        assert.deepEqual(
          registro.sort,
          {
            fecha: -1,
          },
        );

        assert.equal(
          registro.limit,
          7,
        );

        assert.deepEqual(
          registro.populate,
          [
            {
              campo: "cliente",
              proyeccion: "nombre",
            },
            {
              campo: "cilindro",
              proyeccion: "codigo",
            },
          ],
        );

        assert.deepEqual(
          resultado,
          movimientos,
        );
      },
    );

    test(
      "lista movimientos dentro de un rango de fechas",
      async () => {
        const registro = {
          populate: [],
        };

        const movimientoModel = {
          find(filtro) {
            registro.filtro = filtro;

            return crearConsultaSimulada(
              movimientos,
              registro,
            );
          },
        };

        const repositorio =
          crearChatbotRepository({
            movimientoModel,
          });

        const desde =
          new Date(
            "2026-07-28T00:00:00.000Z",
          );

        const hasta =
          new Date(
            "2026-07-29T00:00:00.000Z",
          );

        await repositorio
          .listarMovimientosPorRango(
            desde,
            hasta,
            11,
          );

        assert.deepEqual(
          registro.filtro,
          {
            fecha: {
              $gte: desde,
              $lt: hasta,
            },
          },
        );

        assert.equal(
          registro.limit,
          11,
        );
      },
    );

    test(
      "lista el historial por identificador de cilindro",
      async () => {
        const registro = {
          populate: [],
        };

        const movimientoModel = {
          find(filtro) {
            registro.filtro = filtro;

            return crearConsultaSimulada(
              movimientos,
              registro,
            );
          },
        };

        const repositorio =
          crearChatbotRepository({
            movimientoModel,
          });

        await repositorio
          .listarMovimientosPorCilindro(
            "cilindro-id",
            11,
          );

        assert.deepEqual(
          registro.filtro,
          {
            cilindro: "cilindro-id",
          },
        );

        assert.deepEqual(
          registro.sort,
          {
            fecha: -1,
          },
        );

        assert.equal(
          registro.limit,
          11,
        );
      },
    );
  },
);