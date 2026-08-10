export const manejarErrores = (
  error,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
  return next(error);
}

  const esJsonInvalido =
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error;

  if (esJsonInvalido) {
    return res.status(400).json({
      mensaje:
        "El cuerpo de la solicitud contiene JSON inválido.",
    });
  }

  if (error.code === 11000) {
    const campoDuplicado =
      Object.keys(error.keyPattern ?? {})[0] ??
      "dato";

    return res.status(409).json({
      mensaje:
        `Ya existe un registro con el mismo ${campoDuplicado}.`,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      mensaje:
        "Los datos enviados no cumplen las reglas del sistema.",
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      mensaje:
        "Uno de los identificadores enviados no es válido.",
    });
  }

  console.error(
  `Error interno del servidor en ${req.method} ${req.originalUrl}:`,
  error,
);

  return res.status(500).json({
    mensaje: "Error interno del servidor.",
  });
};

export const manejarRutaNoEncontrada = (
  req,
  res,
) => {
  return res.status(404).json({
    mensaje:
      `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};