import express from "express";

import {
  obtenerDashboard,
} from "../controllers/dashboardController.js";

import {
  autenticar,
  autorizarRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  autenticar,
  autorizarRoles("Administrador", "Operador"),
  obtenerDashboard,
);

export default router;