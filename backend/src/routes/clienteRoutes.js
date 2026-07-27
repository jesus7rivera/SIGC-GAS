import express from "express";

import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
} from "../controllers/clienteController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  obtenerClientes,
);

router.post(
  "/",
  autenticar,
  autorizarRoles("Administrador"),
  crearCliente,
);

router.put(
  "/:id",
  autenticar,
  autorizarRoles("Administrador"),
  actualizarCliente,
);

router.delete(
  "/:id",
  autenticar,
  autorizarRoles("Administrador"),
  eliminarCliente,
);

export default router;