import Cilindro from "../models/Cilindro.js";

export const obtenerCilindros = async (req, res) => {
  try {
    const cilindros = await Cilindro.find().sort({ createdAt: -1 });
    res.json(cilindros);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener cilindros",
      error: error.message
    });
  }
};

export const crearCilindro = async (req, res) => {
  try {
    const nuevoCilindro = new Cilindro(req.body);
    const cilindroGuardado = await nuevoCilindro.save();

    res.status(201).json(cilindroGuardado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear cilindro",
      error: error.message
    });
  }
};

export const eliminarCilindro = async (req, res) => {
  try {
    const { id } = req.params;

    const cilindroEliminado = await Cilindro.findByIdAndDelete(id);

    if (!cilindroEliminado) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado"
      });
    }

    res.json({
      mensaje: "Cilindro eliminado correctamente",
      cilindro: cilindroEliminado
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar cilindro",
      error: error.message
    });
  }
};

export const actualizarCilindro = async (req, res) => {
  try {
    const { id } = req.params;

    const cilindroActualizado = await Cilindro.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!cilindroActualizado) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado"
      });
    }

    res.json(cilindroActualizado);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar cilindro",
      error: error.message
    });
  }
};