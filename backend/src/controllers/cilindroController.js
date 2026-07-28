import Cilindro from "../models/Cilindro.js";

export const obtenerCilindros = async (
  req,
  res,
  next,
) => {
  try {
    const cilindros = await Cilindro.find().sort({
      createdAt: -1,
    });

    return res.json(cilindros);
  } catch (error) {
    return next(error);
  }
};

export const crearCilindro = async (
  req,
  res,
  next,
) => {
  try {
    const cilindroGuardado = await Cilindro.create(
      req.body,
    );

    return res.status(201).json(
      cilindroGuardado,
    );
  } catch (error) {
    return next(error);
  }
};

export const eliminarCilindro = async (
  req,
  res,
  next,
) => {
  try {
    const { id } = req.params;

    const cilindroEliminado =
      await Cilindro.findByIdAndDelete(id);

    if (!cilindroEliminado) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado.",
      });
    }

    return res.json({
      mensaje: "Cilindro eliminado correctamente.",
      cilindro: cilindroEliminado,
    });
  } catch (error) {
    return next(error);
  }
};

export const actualizarCilindro = async (
  req,
  res,
  next,
) => {
  try {
    const { id } = req.params;

    const cilindroActualizado =
      await Cilindro.findByIdAndUpdate(
        id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

    if (!cilindroActualizado) {
      return res.status(404).json({
        mensaje: "Cilindro no encontrado.",
      });
    }

    return res.json(cilindroActualizado);
  } catch (error) {
    return next(error);
  }
};