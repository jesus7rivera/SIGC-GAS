import express from "express";

import {
  registrarUsuario,
  login,
} from "../controllers/authController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

import {
  validarLogin,
  validarUsuario,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/login", validarLogin, login);

router.post(
  "/registrar",
  autenticar,
  autorizarRoles("Administrador"),
  validarUsuario,
  registrarUsuario,
);

export default router;