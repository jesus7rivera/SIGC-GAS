import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Usuario from "../models/usuario.js";
import Cliente from "../models/Cliente.js";

const prepararDatosPrueba = async () => {
  const mongoUri = process.env.MONGO_URI;
  const esEntornoPrueba = process.env.NODE_ENV === "test";

  if (!mongoUri) {
    throw new Error("No se definió la variable MONGO_URI.");
  }

  if (!esEntornoPrueba || !mongoUri.toLowerCase().includes("test")) {
    throw new Error(
      "Preparación cancelada: solo puede ejecutarse en una base de datos de prueba.",
    );
  }

  try {
    await mongoose.connect(mongoUri);

    console.log("Conectado a MongoDB de pruebas.");

    const passwordAdministrador = await bcrypt.hash(
      "admin123",
      10,
    );

    const passwordOperador = await bcrypt.hash(
      "operador123",
      10,
    );

    const passwordBloqueo = await bcrypt.hash(
  "bloqueo123",
  10,
);

    await Usuario.findOneAndUpdate(
      {
        correo: "admin@sigcgas.com",
      },
      {
        nombre: "Administrador",
        correo: "admin@sigcgas.com",
        password: passwordAdministrador,
        rol: "Administrador",
        estado: true,
        intentosFallidos: 0,
        bloqueadoHasta: null,
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    await Usuario.findOneAndUpdate(
      {
        correo: "operador@sigcgas.com",
      },
      {
        nombre: "Operador",
        correo: "operador@sigcgas.com",
        password: passwordOperador,
        rol: "Operador",
        estado: true,
        intentosFallidos: 0,
        bloqueadoHasta: null,
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    await Usuario.findOneAndUpdate(
  {
    correo: "bloqueo.selenium@sigcgas.test",
  },
  {
    nombre: "Usuario Bloqueo Selenium",
    correo: "bloqueo.selenium@sigcgas.test",
    password: passwordBloqueo,
    rol: "Operador",
    estado: true,
    intentosFallidos: 0,
    bloqueadoHasta: null,
  },
  {
    upsert: true,
    returnDocument: "after",
    setDefaultsOnInsert: true,
  },
);

    await Cliente.findOneAndUpdate(
      {
        dni: "00000001",
      },
      {
        dni: "00000001",
        nombre: "Cliente Selenium",
        telefono: "900000001",
        estado: "Activo",
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    console.log("Datos de prueba preparados correctamente.");
    console.log("- Usuario Administrador");
    console.log("- Usuario Operador");
    console.log("- Usuario Bloqueo Selenium");
    console.log("- Cliente Selenium");
  } finally {
    await mongoose.disconnect();
  }
};

prepararDatosPrueba().catch((error) => {
  console.error("Error al preparar datos de prueba:");
  console.error(error.message);

  process.exitCode = 1;
});