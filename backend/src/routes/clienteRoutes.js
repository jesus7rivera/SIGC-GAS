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

import {
  validarCliente,
  validarParametroObjectId,
} from "../middleware/validationMiddleware.js";

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
  validarCliente,
  crearCliente,
);

router.put(
  "/:id",
  autenticar,
  autorizarRoles("Administrador"),
  validarParametroObjectId("id"),
  validarCliente,
  actualizarCliente,
);

router.delete(
  "/:id",
  autenticar,
  autorizarRoles("Administrador"),
  validarParametroObjectId("id"),
  eliminarCliente,
);

export default router;