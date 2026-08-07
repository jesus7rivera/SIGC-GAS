import Cliente from "../models/Cliente.js";
import Cilindro from "../models/Cilindro.js";
import Movimiento from "../models/Movimiento.js";

const clienteTienePrestamoActivo =
  async (
    clienteId,
  ) => {
    const cilindrosPrestados =
      await Cilindro.find({
        estado: "Prestado",
      })
        .select(
          "_id",
        )
        .lean();

    for (
      const cilindro
      of cilindrosPrestados
    ) {
      const ultimoMovimiento =
        await Movimiento
          .findOne({
            cilindro:
              cilindro._id,
          })
          .select(
            "cliente tipo",
          )
          .sort({
            fecha: -1,
            createdAt: -1,
            _id: -1,
          })
          .lean();

      const perteneceAlCliente =
        ultimoMovimiento?.cliente
        && String(
          ultimoMovimiento
            .cliente,
        ) === String(
          clienteId,
        );

      if (
        ultimoMovimiento?.tipo
          === "Salida"
        && perteneceAlCliente
      ) {
        return true;
      }
    }

    return false;
  };

export const obtenerClientes = async (
  req,
  res,
  next,
) => {
  try {
    const clientes = await Cliente.find().sort({
      createdAt: -1,
    });

    return res.json(clientes);
  } catch (error) {
    return next(error);
  }
};

export const crearCliente = async (
  req,
  res,
  next,
) => {
  try {
    const clienteGuardado = await Cliente.create(
      req.body,
    );

    return res.status(201).json(
      clienteGuardado,
    );
  } catch (error) {
    return next(error);
  }
};

export const eliminarCliente = async (
  req,
  res,
  next,
) => {
  try {
    const {
      id,
    } = req.params;

    const cliente =
      await Cliente.findById(
        id,
      );

    if (!cliente) {
      return res.status(404).json({
        mensaje:
          "Cliente no encontrado.",
      });
    }

    const tieneHistorial =
      await Movimiento.exists({
        cliente: id,
      });

    if (tieneHistorial) {
      return res.status(409).json({
        mensaje:
          "No se puede eliminar un cliente que tiene movimientos registrados. Puedes marcarlo como Inactivo para conservar su historial.",
      });
    }

    await Cliente.deleteOne({
      _id: id,
    });

    return res.json({
      mensaje:
        "Cliente eliminado correctamente.",
      cliente,
    });
  } catch (error) {
    return next(error);
  }
};

export const actualizarCliente = async (
  req,
  res,
  next,
) => {
  try {
    const {
      id,
    } = req.params;

    const clienteActual =
      await Cliente.findById(
        id,
      );

    if (!clienteActual) {
      return res.status(404).json({
        mensaje:
          "Cliente no encontrado.",
      });
    }

    const intentaDesactivar =
      clienteActual.estado
        === "Activo"
      && req.body.estado
        === "Inactivo";

    if (intentaDesactivar) {
      const tienePrestamoActivo =
        await clienteTienePrestamoActivo(
          id,
        );

      if (tienePrestamoActivo) {
        return res.status(409).json({
          mensaje:
            "No se puede desactivar al cliente porque tiene uno o más cilindros prestados. Registra primero las devoluciones pendientes.",
        });
      }
    }

    const clienteActualizado =
      await Cliente.findByIdAndUpdate(
        id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

    return res.json(
      clienteActualizado,
    );
  } catch (error) {
    return next(error);
  }
};