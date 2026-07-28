import express from "express";

import {
  obtenerCilindros,
  crearCilindro,
  eliminarCilindro,
  actualizarCilindro,
} from "../controllers/cilindroController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

import {
  validarCilindro,
  validarParametroObjectId,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get(
  "/",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  obtenerCilindros,
);

router.post(
  "/",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  validarCilindro,
  crearCilindro,
);

router.put(
  "/:id",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  validarParametroObjectId("id"),
  validarCilindro,
  actualizarCilindro,
);

router.delete(
  "/:id",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  validarParametroObjectId("id"),
  eliminarCilindro,
);

export default router;