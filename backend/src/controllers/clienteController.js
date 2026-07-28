import Cliente from "../models/Cliente.js";

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
    const { id } = req.params;

    const clienteEliminado =
      await Cliente.findByIdAndDelete(id);

    if (!clienteEliminado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado.",
      });
    }

    return res.json({
      mensaje: "Cliente eliminado correctamente.",
      cliente: clienteEliminado,
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
    const { id } = req.params;

    const clienteActualizado =
      await Cliente.findByIdAndUpdate(
        id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

    if (!clienteActualizado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado.",
      });
    }

    return res.json(clienteActualizado);
  } catch (error) {
    return next(error);
  }
};