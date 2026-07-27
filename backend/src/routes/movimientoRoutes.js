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
  crearMovimiento,
);

router.get(
  "/cilindro/:cilindroId",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  obtenerHistorialPorCilindro,
);

export default router;