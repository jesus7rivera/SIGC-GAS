import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  ejecutarConsultaChatbot,
} from "./chatbotQueryService.js";

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
  "Consultas de resumen y cilindros",
  () => {
    test(
      "construye el resumen general del sistema",
      async () => {
        const repositorio =
          crearRepositorio({
            contarClientesPorEstado:
              async () => 12,

            contarCilindrosPorEstado:
              async (estado) => {
                const cantidades = {
                  Disponible: 8,
                  Prestado: 4,
                  Mantenimiento: 2,
                };

                return cantidades[estado];
              },
          });

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_resumen",
              parametros: {},
            },
            {
              repositorio,
            },
          );

        assert.deepEqual(
          resultado,
          {
            respuesta:
              "El sistema registra 12 clientes activos, 8 cilindros disponibles, 4 prestados y 2 en mantenimiento.",
            datos: {
              clientesActivos: 12,
              disponibles: 8,
              prestados: 4,
              mantenimiento: 2,
            },
          },
        );
      },
    );

    test(
      "cuenta cilindros por estado",
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

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "contar_cilindros_estado",
              parametros: {
                estado: "Disponible",
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
      "lista y limita cilindros por estado",
      async () => {
        let limiteRecibido = null;

        const cilindros =
          Array.from(
            {
              length: 11,
            },
            (_, indice) => ({
              codigo:
                `CIL-${String(
                  indice + 1,
                ).padStart(3, "0")}`,
              tipo: "Doméstico",
              capacidad: "10 Kg",
              estado: "Disponible",
              datoInterno:
                "No debe mostrarse",
            }),
          );

        const repositorio =
          crearRepositorio({
            listarCilindrosPorEstado:
              async (
                estado,
                limite,
              ) => {
                assert.equal(
                  estado,
                  "Disponible",
                );

                limiteRecibido = limite;

                return cilindros.slice(
                  0,
                  limite,
                );
              },
          });

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "listar_cilindros_estado",
              parametros: {
                estado: "Disponible",
              },
            },
            {
              repositorio,
            },
          );

        assert.equal(
          limiteRecibido,
          11,
        );

        assert.equal(
          resultado.datos.length,
          10,
        );

        assert.equal(
          resultado.respuesta,
          "Se encontraron cilindros disponibles. Se muestran los primeros 10 resultados.",
        );

        assert.deepEqual(
          resultado.datos[0],
          {
            codigo: "CIL-001",
            tipo: "Doméstico",
            capacidad: "10 Kg",
            estado: "Disponible",
          },
        );
      },
    );

    test(
      "responde cuando un cilindro no existe",
      async () => {
        const repositorio =
          crearRepositorio();

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "buscar_cilindro_codigo",
              parametros: {
                codigo: "CIL-999",
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
              "No se encontró un cilindro con el código CIL-999.",
            datos: null,
          },
        );
      },
    );
  },
);

describe(
  "Consultas de clientes",
  () => {
    test(
      "cuenta clientes por estado",
      async () => {
        const repositorio =
          crearRepositorio({
            contarClientesPorEstado:
              async (estado) => {
                assert.equal(
                  estado,
                  "Activo",
                );

                return 12;
              },
          });

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "contar_clientes_estado",
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
              "Actualmente existen 12 clientes activos.",
            datos: {
              estado: "Activo",
              cantidad: 12,
            },
          },
        );
      },
    );

    test(
      "devuelve únicamente datos permitidos del cliente",
      async () => {
        const repositorio =
          crearRepositorio({
            buscarClientePorDni:
              async () => ({
                dni: "12345678",
                nombre: "Juan Pérez",
                telefono: "900000001",
                estado: "Activo",
                password:
                  "No debe mostrarse",
              }),
          });

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "buscar_cliente",
              parametros: {
                dni: "12345678",
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
              "Se encontró al cliente Juan Pérez.",
            datos: {
              dni: "12345678",
              nombre: "Juan Pérez",
              telefono: "900000001",
              estado: "Activo",
            },
          },
        );
      },
    );
  },
);

describe(
  "Consultas de movimientos",
  () => {
    test(
      "devuelve los movimientos recientes solicitados",
      async () => {
        let limiteRecibido = null;

        const repositorio =
          crearRepositorio({
            listarMovimientosRecientes:
              async (limite) => {
                limiteRecibido = limite;

                return [
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
              },
          });

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_movimientos_recientes",
              parametros: {
                cantidad: 7,
              },
            },
            {
              repositorio,
            },
          );

        assert.equal(
          limiteRecibido,
          7,
        );

        assert.deepEqual(
          resultado.datos[0],
          {
            fecha:
              "2026-07-28T15:30:00.000Z",
            cliente: "Juan Pérez",
            cilindro: "CIL-001",
            tipo: "Salida",
            observacion:
              "Entrega registrada",
          },
        );
      },
    );

    test(
      "consulta movimientos dentro del día actual",
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

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_movimientos_hoy",
              parametros: {},
            },
            {
              repositorio,
              ahora,
            },
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

        assert.equal(
          rangoRecibido.limite,
          11,
        );

        assert.equal(
          rangoRecibido.hasta
            > rangoRecibido.desde,
          true,
        );

        assert.deepEqual(
          resultado,
          {
            respuesta:
              "No se registraron movimientos durante el día de hoy.",
            datos: [],
          },
        );
      },
    );

    test(
      "devuelve el historial de un cilindro",
      async () => {
        const repositorio =
          crearRepositorio({
            buscarCilindroPorCodigo:
              async () => ({
                _id: "cilindro-id",
                codigo: "CIL-001",
                estado: "Disponible",
              }),

            listarMovimientosPorCilindro:
              async (
                cilindroId,
                limite,
              ) => {
                assert.equal(
                  cilindroId,
                  "cilindro-id",
                );

                assert.equal(
                  limite,
                  11,
                );

                return [
                  {
                    fecha:
                      "2026-07-28T15:30:00.000Z",
                    cliente: {
                      nombre:
                        "Juan Pérez",
                    },
                    tipo: "Devolución",
                    observacion:
                      "Cilindro devuelto",
                  },
                ];
              },
          });

        const resultado =
          await ejecutarConsultaChatbot(
            {
              intencion:
                "consultar_historial_cilindro",
              parametros: {
                codigo: "CIL-001",
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
              "El cilindro CIL-001 tiene 1 movimiento registrado.",
            datos: {
              cilindro: {
                codigo: "CIL-001",
                estado: "Disponible",
              },
              movimientos: [
                {
                  fecha:
                    "2026-07-28T15:30:00.000Z",
                  cliente: "Juan Pérez",
                  tipo: "Devolución",
                  observacion:
                    "Cilindro devuelto",
                },
              ],
            },
          },
        );
      },
    );
  },
);

describe(
  "Control de consultas",
  () => {
    test(
      "rechaza una intención sin implementación",
      async () => {
        const repositorio =
          crearRepositorio();

        await assert.rejects(
          () =>
            ejecutarConsultaChatbot(
              {
                intencion:
                  "intencion_inexistente",
                parametros: {},
              },
              {
                repositorio,
              },
            ),
          {
            message:
              "La intención solicitada no tiene una consulta configurada.",
          },
        );
      },
    );
  },
);