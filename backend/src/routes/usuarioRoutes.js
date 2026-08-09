import express from "express";

import {
  desbloquearUsuario,
  obtenerUsuarios,
  restablecerPassword,
} from "../controllers/usuarioController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  autenticar,
  autorizarRoles("Administrador"),
  obtenerUsuarios,
);
router.patch(
  "/:id/desbloquear",
  autenticar,
  autorizarRoles("Administrador"),
  desbloquearUsuario,
);
router.patch(
  "/:id/restablecer-password",
  autenticar,
  autorizarRoles("Administrador"),
  restablecerPassword,
);

export default router;