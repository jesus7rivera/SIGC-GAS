import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Usuario from "../models/usuario.js";

export const registrarUsuario = async (
  req,
  res,
  next,
) => {
  try {
    const {
      nombre,
      correo,
      password,
      rol,
    } = req.body;

    const existe = await Usuario.exists({
      correo,
    });

    if (existe) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado.",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10,
    );

    await Usuario.create({
      nombre,
      correo,
      password: passwordHash,
      rol,
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req,
  res,
  next,
) => {
  try {
    const {
      correo,
      password,
    } = req.body;

    const usuario = await Usuario.findOne({
      correo,
    });

    if (!usuario || !usuario.estado) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas.",
      });
    }

    const coincide = await bcrypt.compare(
      password,
      usuario.password,
    );

    if (!coincide) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error(
        "JWT_SECRET no está definida.",
      );

      return res.status(500).json({
        mensaje:
          "Error de configuración del servidor.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
      },
      jwtSecret,
      {
        expiresIn: "8h",
      },
    );

    return res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    return next(error);
  }
};