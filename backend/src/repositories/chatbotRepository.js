import Cilindro
  from "../models/Cilindro.js";

import Cliente
  from "../models/Cliente.js";

import Movimiento
  from "../models/Movimiento.js";

const PROYECCION_CLIENTE =
  "dni nombre telefono estado";

const PROYECCION_LISTADO_CLIENTE =
  "nombre estado";

const PROYECCION_CILINDRO =
  "_id codigo tipo capacidad estado";

const PROYECCION_MOVIMIENTO =
  "fecha cliente cilindro tipo observacion";

const PROYECCION_SALIDA_PRESTAMO =
  "fecha cliente cilindro";

const LIMITE_MAXIMO = 11;

const normalizarLimite = (
  limite,
) => {
  if (
    !Number.isInteger(limite)
    || limite <= 0
  ) {
    return 10;
  }

  return Math.min(
    limite,
    LIMITE_MAXIMO,
  );
};

const prepararConsultaMovimientos = (
  consulta,
  limite,
) =>
  consulta
    .select(
      PROYECCION_MOVIMIENTO,
    )
    .populate(
      "cliente",
      "nombre",
    )
    .populate(
      "cilindro",
      "codigo",
    )
    .sort({
      fecha: -1,
    })
    .limit(
      normalizarLimite(
        limite,
      ),
    )
    .lean();

export const crearChatbotRepository = (
  {
    clienteModel = Cliente,
    cilindroModel = Cilindro,
    movimientoModel = Movimiento,
  } = {},
) => ({
  contarClientesPorEstado(
    estado,
  ) {
    const filtro =
      estado === "Todos"
        ? {}
        : {
          estado,
        };

    return clienteModel
      .countDocuments(
        filtro,
      );
  },

    listarClientesPorEstado(
    estado,
    limite,
  ) {
    const filtro =
      estado === "Todos"
        ? {}
        : {
          estado,
        };

    return clienteModel
      .find(
        filtro,
      )
      .select(
        PROYECCION_LISTADO_CLIENTE,
      )
      .sort({
        nombre: 1,
        dni: 1,
      })
      .limit(
        normalizarLimite(
          limite,
        ),
      )
      .lean();
  },

  contarCilindrosPorEstado(
    estado,
  ) {
    return cilindroModel
      .countDocuments({
        estado,
      });
  },

  listarCilindrosPorEstado(
    estado,
    limite,
  ) {
    return cilindroModel
      .find({
        estado,
      })
      .select(
        PROYECCION_CILINDRO,
      )
      .sort({
        codigo: 1,
      })
      .limit(
        normalizarLimite(
          limite,
        ),
      )
      .lean();
  },

    async listarPrestamosActivos(
    limite,
  ) {
    const cilindros =
      await cilindroModel
        .find({
          estado: "Prestado",
        })
        .select(
          PROYECCION_CILINDRO,
        )
        .sort({
          codigo: 1,
        })
        .limit(
          normalizarLimite(
            limite,
          ),
        )
        .lean();

    if (cilindros.length === 0) {
      return [];
    }

    return Promise.all(
      cilindros.map(
        async (cilindro) => {
          const salida =
            await movimientoModel
              .findOne({
                cilindro:
                  cilindro._id,
                tipo: "Salida",
              })
              .select(
                PROYECCION_SALIDA_PRESTAMO,
              )
              .populate(
                "cliente",
                "nombre",
              )
              .sort({
                fecha: -1,
              })
              .lean();

          return {
            cilindro,
            salida:
              salida ?? null,
          };
        },
      ),
    );
  },

  async listarPrestamosActivosParaSeguimiento() {
  const cilindros =
    await cilindroModel
      .find({
        estado: "Prestado",
      })
      .select(
        PROYECCION_CILINDRO,
      )
      .sort({
        codigo: 1,
      })
      .lean();

  if (cilindros.length === 0) {
    return [];
  }

  return Promise.all(
    cilindros.map(
      async (cilindro) => {
        const salida =
          await movimientoModel
            .findOne({
              cilindro:
                cilindro._id,
              tipo: "Salida",
            })
            .select(
              PROYECCION_SALIDA_PRESTAMO,
            )
            .populate(
              "cliente",
              "nombre",
            )
            .sort({
              fecha: -1,
            })
            .lean();

        return {
          cilindro,
          salida:
            salida ?? null,
        };
      },
    ),
  );
},

  buscarCilindroPorCodigo(
    codigo,
  ) {
    if (
      typeof codigo !== "string"
      || !codigo.trim()
    ) {
      return null;
    }

    const codigoNormalizado =
      codigo
        .trim()
        .toUpperCase();

    return cilindroModel
      .findOne({
        codigo: codigoNormalizado,
      })
      .select(
        PROYECCION_CILINDRO,
      )
      .lean();
  },

  buscarClientePorDni(
    dni,
  ) {
    if (
      typeof dni !== "string"
      || !dni.trim()
    ) {
      return null;
    }

    return clienteModel
      .findOne({
        dni: dni.trim(),
      })
      .select(
        PROYECCION_CLIENTE,
      )
      .lean();
  },

  listarMovimientosRecientes(
    limite,
  ) {
    return prepararConsultaMovimientos(
      movimientoModel.find({}),
      limite,
    );
  },

  listarMovimientosPorRango(
    desde,
    hasta,
    limite,
  ) {
    return prepararConsultaMovimientos(
      movimientoModel.find({
        fecha: {
          $gte: desde,
          $lt: hasta,
        },
      }),
      limite,
    );
  },

  listarMovimientosPorCilindro(
    cilindroId,
    limite,
  ) {
    return prepararConsultaMovimientos(
      movimientoModel.find({
        cilindro:
          cilindroId,
      }),
      limite,
    );
  },
});

export const chatbotRepository =
  crearChatbotRepository();