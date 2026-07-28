import express from "express";

import {
  obtenerMovimientos,
  crearMovimiento,
  obtenerHistorialPorCilindro,
} from "../controllers/movimientoController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

import {
  validarMovimiento,
  validarParametroObjectId,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get(
  "/",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  obtenerMovimientos,
);

router.post(
  "/",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  validarMovimiento,
  crearMovimiento,
);

router.get(
  "/cilindro/:cilindroId",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  validarParametroObjectId("cilindroId"),
  obtenerHistorialPorCilindro,
);

export default router;