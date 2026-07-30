const LIMITE_MENSAJE = 300;

const responderError = (
  res,
  errores,
) =>
  res.status(400).json({
    mensaje:
      "Datos de entrada inválidos",
    errores,
  });

export const validarMensajeChatbot = (
  req,
  res,
  next,
) => {
  const {
    body,
  } = req;

  const esObjetoValido =
    body !== null
    && typeof body === "object"
    && !Array.isArray(body);

  if (!esObjetoValido) {
    return responderError(
      res,
      [
        "El cuerpo de la solicitud debe ser un objeto JSON.",
      ],
    );
  }

  const camposPermitidos = [
    "mensaje",
  ];

  const camposAdicionales =
    Object.keys(body)
      .filter(
        (campo) =>
          !camposPermitidos
            .includes(campo),
      )
      .sort();

  if (
    camposAdicionales.length > 0
  ) {
    return responderError(
      res,
      [
        `Campos no permitidos: ${camposAdicionales.join(", ")}`,
      ],
    );
  }

  if (
    typeof body.mensaje
      !== "string"
  ) {
    return responderError(
      res,
      [
        "El mensaje debe ser una cadena de texto.",
      ],
    );
  }

  const mensaje =
    body.mensaje.trim();

  if (
    mensaje.length < 1
    || mensaje.length
      > LIMITE_MENSAJE
  ) {
    return responderError(
      res,
      [
        "El mensaje debe contener entre 1 y 300 caracteres.",
      ],
    );
  }

  req.body.mensaje =
    mensaje;

  return next();
};