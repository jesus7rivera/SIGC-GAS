import Movimiento from "../models/Movimiento.js";
import Cilindro from "../models/Cilindro.js";

export const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find()
      .populate("cliente", "dni nombre telefono")
      .populate("cilindro", "codigo tipo capacidad estado")
      .sort({ createdAt: -1 });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener movimientos",
      error: error.message
    });
  }
};

export const crearMovimiento = async (req, res) => {
  try {
    const { cilindro, tipo } = req.body;

    let nuevoEstado = "";

    if (tipo === "Salida") {
      nuevoEstado = "Prestado";
    } else if (tipo === "Devolución") {
      nuevoEstado = "Disponible";
    } else if (tipo === "Mantenimiento") {
      nuevoEstado = "Mantenimiento";
    }

    const nuevoMovimiento = new Movimiento(req.body);
    const movimientoGuardado = await nuevoMovimiento.save();

    if (nuevoEstado) {
      await Cilindro.findByIdAndUpdate(cilindro, {
        estado: nuevoEstado
      });
    }

    const movimientoCompleto = await Movimiento.findById(movimientoGuardado._id)
      .populate("cliente", "dni nombre telefono")
      .populate("cilindro", "codigo tipo capacidad estado");

    res.status(201).json(movimientoCompleto);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear movimiento",
      error: error.message
    });
  }
};

export const obtenerHistorialPorCilindro = async (req, res) => {
  try {
    const { cilindroId } = req.params;

    const historial = await Movimiento.find({ cilindro: cilindroId })
      .populate("cliente", "dni nombre telefono")
      .populate("cilindro", "codigo tipo capacidad estado")
      .sort({ fecha: -1 });

    res.json(historial);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener historial del cilindro",
      error: error.message
    });
  }
};