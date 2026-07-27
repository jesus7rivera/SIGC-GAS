import jwt from "jsonwebtoken";

export const autenticar = (req, res, next) => {
  const encabezadoAutorizacion = req.headers.authorization;

  const token = encabezadoAutorizacion?.startsWith("Bearer ")
    ? encabezadoAutorizacion.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      mensaje: "Token de autenticación no proporcionado",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET no está definida.");

    return res.status(500).json({
      mensaje: "Error de configuración del servidor",
    });
  }

  try {
    const datosToken = jwt.verify(token, jwtSecret);

    req.usuario = {
      id: datosToken.id,
      rol: datosToken.rol,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        mensaje: "El token ha expirado",
      });
    }

    return res.status(401).json({
      mensaje: "Token inválido",
    });
  }
};

export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tiene permisos para realizar esta acción",
      });
    }

    next();
  };
};