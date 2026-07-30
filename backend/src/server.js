import conectarDB
  from "./config/db.js";

import express
  from "express";

import cors
  from "cors";

import dotenv
  from "dotenv";

import authRoutes
  from "./routes/authRoutes.js";

import chatbotRoutes
  from "./routes/chatbotRoutes.js";

import cilindroRoutes
  from "./routes/cilindroRoutes.js";

import clienteRoutes
  from "./routes/clienteRoutes.js";

import dashboardRoutes
  from "./routes/dashboardRoutes.js";

import movimientoRoutes
  from "./routes/movimientoRoutes.js";

import {
  manejarErrores,
  manejarRutaNoEncontrada,
} from "./middleware/errorMiddleware.js";

dotenv.config();

conectarDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get(
  "/",
  (req, res) => {
    res.send(
      "API SIGC-GAS funcionando correctamente",
    );
  },
);

app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/dashboard",
  dashboardRoutes,
);

app.use(
  "/api/clientes",
  clienteRoutes,
);

app.use(
  "/api/cilindros",
  cilindroRoutes,
);

app.use(
  "/api/movimientos",
  movimientoRoutes,
);

app.use(
  "/api/chatbot",
  chatbotRoutes,
);

app.use(
  manejarRutaNoEncontrada,
);

app.use(
  manejarErrores,
);

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Servidor backend ejecutándose en puerto ${PORT}`,
    );
  },
);