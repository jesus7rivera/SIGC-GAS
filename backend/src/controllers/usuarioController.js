import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.js";

export const obtenerUsuarios = async (
  req,
  res,
  next,
) => {
  try {
    const usuarios =
      await Usuario.find()
        .select(
          "-password",
        )
        .sort({
          nombre: 1,
        });

    const ahora = new Date();

    const usuariosFormateados =
      usuarios.map(
        (usuario) => {
          const estaBloqueado =
            Boolean(
              usuario.bloqueadoHasta
              && usuario.bloqueadoHasta
                > ahora,
            );

          return {
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            estado: usuario.estado,
            intentosFallidos:
              usuario.intentosFallidos
              ?? 0,
            bloqueadoHasta:
              usuario.bloqueadoHasta
              ?? null,
            estadoAcceso:
              estaBloqueado
                ? "Bloqueado"
                : "Activo",
          };
        },
      );

    return res.json(
      usuariosFormateados,
    );
  } catch (error) {
    return next(error);
  }
};
export const desbloquearUsuario = async (
  req,
  res,
  next,
) => {
  try {
    const usuario =
      await Usuario.findById(
        req.params.id,
      );

    if (!usuario) {
      return res.status(404).json({
        mensaje:
          "Usuario no encontrado.",
      });
    }

    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;

    await usuario.save();

    return res.json({
      mensaje:
        "Cuenta desbloqueada correctamente.",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        estadoAcceso: "Activo",
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const restablecerPassword = async (
  req,
  res,
  next,
) => {
  try {
    const {
      nuevaPassword,
    } = req.body;

    if (
      typeof nuevaPassword !== "string"
      || nuevaPassword.length < 8
      || nuevaPassword.length > 72
    ) {
      return res.status(400).json({
        mensaje:
          "La nueva contraseña debe tener "
          + "entre 8 y 72 caracteres.",
      });
    }

    const usuario =
      await Usuario.findById(
        req.params.id,
      );

    if (!usuario) {
      return res.status(404).json({
        mensaje:
          "Usuario no encontrado.",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        nuevaPassword,
        10,
      );

    usuario.password =
      passwordHash;

    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;

    await usuario.save();

    return res.json({
      mensaje:
        "Contraseña restablecida "
        + "correctamente.",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        estadoAcceso: "Activo",
      },
    });
  } catch (error) {
    return next(error);
  }
};