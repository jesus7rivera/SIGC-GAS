import Cliente from "../models/Cliente.js";
import Cilindro from "../models/Cilindro.js";
import Movimiento from "../models/Movimiento.js";

export const obtenerDashboard = async (
  req,
  res,
  next,
) => {
  try {
    const [
      clientesActivos,
      disponibles,
      prestados,
      mantenimiento,
      movimientos,
    ] = await Promise.all([
      Cliente.countDocuments({
        estado: "Activo",
      }),

      Cilindro.countDocuments({
        estado: "Disponible",
      }),

      Cilindro.countDocuments({
        estado: "Prestado",
      }),

      Cilindro.countDocuments({
        estado: "Mantenimiento",
      }),

      Movimiento.find()
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
        })
        .limit(10),
    ]);

    return res.json({
      resumen: {
        clientesActivos,
        disponibles,
        prestados,
        mantenimiento,
      },
      movimientos,
    });
  } catch (error) {
    return next(error);
  }
};