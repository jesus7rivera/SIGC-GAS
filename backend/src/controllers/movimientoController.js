import Movimiento from "../models/Movimiento.js";
import Cilindro from "../models/Cilindro.js";
import Cliente from "../models/Cliente.js";

const transicionesPermitidas = {
  Disponible: {
    Salida: "Prestado",
    Mantenimiento: "Mantenimiento",
  },

  Prestado: {
    Devolución: "Disponible",
    Mantenimiento: "Mantenimiento",
  },

  Mantenimiento: {
    "Fin de mantenimiento": "Disponible",
  },
};

const obtenerNuevoEstado = (
  estadoActual,
  tipoMovimiento,
) =>
  transicionesPermitidas[estadoActual]?.[
    tipoMovimiento
  ] ?? null;

export const obtenerMovimientos = async (
  req,
  res,
  next,
) => {
  try {
    const movimientos = await Movimiento.find()
      .populate(
        "cliente",
        "dni nombre telefono",
      )
      .populate(
        "cilindro",
        "codigo tipo capacidad estado",
      )
      .sort({
        createdAt: -1,
      });

    return res.json(movimientos);
  } catch (error) {
    return next(error);
  }
};

export const crearMovimiento = async (
  req,
  res,
  next,
) => {
  try {
    const {
      cliente,
      cilindro,
      tipo,
    } = req.body;

    const clienteEncontrado =
      await Cliente.findById(cliente);

    if (!clienteEncontrado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado.",
      });
    }

    if (clienteEncontrado.estado !== "Activo") {
      return res.status(409).json({
        mensaje:
          "No se pueden registrar movimientos para un cliente inactivo.",
      });
    }

    const cilindroEncontrado =
      await Cilindro.findById(cilindro);

    if (!cilindroEncontrado) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado.",
      });
    }

    const estadoAnterior =
      cilindroEncontrado.estado;

    const nuevoEstado = obtenerNuevoEstado(
      estadoAnterior,
      tipo,
    );

    if (!nuevoEstado) {
      return res.status(409).json({
        mensaje:
          `No se puede registrar el movimiento ${tipo} ` +
          `cuando el cilindro está ${estadoAnterior}.`,
        estadoActual: estadoAnterior,
        movimientoSolicitado: tipo,
      });
    }

    const cilindroActualizado =
      await Cilindro.findOneAndUpdate(
        {
          _id: cilindroEncontrado._id,
          estado: estadoAnterior,
        },
        {
          $set: {
            estado: nuevoEstado,
          },
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

    if (!cilindroActualizado) {
      return res.status(409).json({
        mensaje:
          "El estado del cilindro cambió mientras se procesaba la solicitud.",
      });
    }

    let movimientoGuardado;

    try {
      movimientoGuardado =
        await Movimiento.create(req.body);
    } catch (errorMovimiento) {
      const reversion =
        await Cilindro.updateOne(
          {
            _id: cilindroEncontrado._id,
            estado: nuevoEstado,
          },
          {
            $set: {
              estado: estadoAnterior,
            },
          },
        );

      if (reversion.modifiedCount !== 1) {
        console.error(
          "No se pudo revertir el estado del cilindro.",
          {
            cilindroId:
              cilindroEncontrado._id.toString(),
            estadoAnterior,
            nuevoEstado,
          },
        );
      }

      throw errorMovimiento;
    }

    const movimientoCompleto =
      await Movimiento.findById(
        movimientoGuardado._id,
      )
        .populate(
          "cliente",
          "dni nombre telefono estado",
        )
        .populate(
          "cilindro",
          "codigo tipo capacidad estado",
        );

    return res.status(201).json(
      movimientoCompleto,
    );
  } catch (error) {
    return next(error);
  }
};

export const obtenerHistorialPorCilindro = async (
  req,
  res,
  next,
) => {
  try {
    const { cilindroId } = req.params;

    const cilindroExiste =
      await Cilindro.exists({
        _id: cilindroId,
      });

    if (!cilindroExiste) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado.",
      });
    }

    const historial = await Movimiento.find({
      cilindro: cilindroId,
    })
      .populate(
        "cliente",
        "dni nombre telefono",
      )
      .populate(
        "cilindro",
        "codigo tipo capacidad estado",
      )
      .sort({
        fecha: -1,
      });

    return res.json(historial);
  } catch (error) {
    return next(error);
  }
};