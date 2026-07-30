import express from "express";

import {
  procesarMensajeChatbot,
} from "../controllers/chatbotController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

import {
  validarMensajeChatbot,
} from "../middleware/chatbotValidationMiddleware.js";

const router = express.Router();

router.post(
  "/mensaje",
  autenticar,
  autorizarRoles(
    "Administrador",
    "Operador",
  ),
  validarMensajeChatbot,
  procesarMensajeChatbot,
);

export default router;