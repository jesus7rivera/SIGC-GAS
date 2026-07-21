import express from "express";

import {
  obtenerMovimientos,
  crearMovimiento,
  obtenerHistorialPorCilindro
} from "../controllers/movimientoController.js";

const router = express.Router();

router.get("/", obtenerMovimientos);
router.post("/", crearMovimiento);
router.get("/cilindro/:cilindroId", obtenerHistorialPorCilindro);

export default router;