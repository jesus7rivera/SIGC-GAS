import Movimiento from "../models/Movimiento.js";
import Cilindro from "../models/Cilindro.js";
import Cliente from "../models/Cliente.js";

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

    const clienteExiste = await Cliente.exists({
      _id: cliente,
    });

    if (!clienteExiste) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado.",
      });
    }

    const cilindroExiste =
      await Cilindro.findById(cilindro);

    if (!cilindroExiste) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado.",
      });
    }

    let nuevoEstado = cilindroExiste.estado;

    if (tipo === "Salida") {
      nuevoEstado = "Prestado";
    } else if (tipo === "Devolución") {
      nuevoEstado = "Disponible";
    } else if (tipo === "Mantenimiento") {
      nuevoEstado = "Mantenimiento";
    }

    const movimientoGuardado =
      await Movimiento.create(req.body);

    if (nuevoEstado !== cilindroExiste.estado) {
      cilindroExiste.estado = nuevoEstado;
      await cilindroExiste.save();
    }

    const movimientoCompleto =
      await Movimiento.findById(
        movimientoGuardado._id,
      )
        .populate(
          "cliente",
          "dni nombre telefono",
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