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
  crearCilindro,
);

router.put(
  "/:id",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  actualizarCilindro,
);

router.delete(
  "/:id",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  eliminarCilindro,
);

export default router;