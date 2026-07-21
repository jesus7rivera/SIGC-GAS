import Cliente from "../models/Cliente.js";

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clientes",
      error: error.message
    });
  }
};

export const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();

    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear cliente",
      error: error.message
    });
  }
};
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteEliminado = await Cliente.findByIdAndDelete(id);

    if (!clienteEliminado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.json({
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteEliminado
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar cliente",
      error: error.message
    });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.json(clienteActualizado);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar cliente",
      error: error.message
    });
  }
};