import express from "express";

import {
  obtenerCilindros,
  crearCilindro,
  eliminarCilindro,
  actualizarCilindro
} from "../controllers/cilindroController.js";

const router = express.Router();

router.get("/", obtenerCilindros);
router.post("/", crearCilindro);
router.put("/:id", actualizarCilindro);
router.delete("/:id", eliminarCilindro);
export default router;