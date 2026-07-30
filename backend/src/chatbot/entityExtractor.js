const CANTIDADES_ESCRITAS = new Map(
  [
    ["un", 1],
    ["uno", 1],
    ["una", 1],
    ["dos", 2],
    ["tres", 3],
    ["cuatro", 4],
    ["cinco", 5],
    ["seis", 6],
    ["siete", 7],
    ["ocho", 8],
    ["nueve", 9],
    ["diez", 10],
  ],
);

const agregarParametro = (
  parametros,
  nombre,
  valor,
) => {
  if (
    valor !== null
    && valor !== undefined
  ) {
    parametros[nombre] = valor;
  }

  return parametros;
};

export const extraerCodigoCilindro = (
  mensaje,
) => {
  if (typeof mensaje !== "string") {
    return null;
  }

  const coincidencia = mensaje.match(
    /\bcil-[a-z0-9]+(?:-[a-z0-9]+)*\b/i,
  );

  return coincidencia
    ? coincidencia[0].toUpperCase()
    : null;
};

export const extraerDni = (
  mensaje,
) => {
  if (typeof mensaje !== "string") {
    return null;
  }

  const coincidencia = mensaje.match(
    /\b\d{8}\b/,
  );

  return coincidencia
    ? coincidencia[0]
    : null;
};

export const extraerEstadoCilindro = (
  mensaje,
) => {
  if (typeof mensaje !== "string") {
    return null;
  }

  if (/\bmantenimiento\b/.test(mensaje)) {
    return "Mantenimiento";
  }

  if (/\bprestados?\b/.test(mensaje)) {
    return "Prestado";
  }

  if (/\bdisponibles?\b/.test(mensaje)) {
    return "Disponible";
  }

  return null;
};

export const extraerEstadoCliente = (
  mensaje,
) => {
  if (typeof mensaje !== "string") {
    return null;
  }

  /*
   * Inactivo debe evaluarse antes que Activo
   * para evitar clasificaciones ambiguas.
   */
  if (/\binactivos?\b/.test(mensaje)) {
    return "Inactivo";
  }

  if (/\bactivos?\b/.test(mensaje)) {
    return "Activo";
  }

  const solicitaTodos =
    /\bclientes?\b/.test(mensaje)
    && (
      /\bregistrados?\b/.test(mensaje)
      || /\btodos?\b/.test(mensaje)
      || /\btotal\b/.test(mensaje)
    );

  if (solicitaTodos) {
    return "Todos";
  }

  return null;
};

export const extraerCantidad = (
  mensaje,
  valorPredeterminado = 5,
  limiteMaximo = 10,
) => {
  if (typeof mensaje !== "string") {
    return valorPredeterminado;
  }

  const coincidenciaNumerica =
    mensaje.match(/\b\d{1,3}\b/);

  let cantidad = null;

  if (coincidenciaNumerica) {
    cantidad = Number(
      coincidenciaNumerica[0],
    );
  } else {
    for (
      const [
        palabra,
        valor,
      ]
      of CANTIDADES_ESCRITAS
    ) {
      const patron = new RegExp(
        `\\b${palabra}\\b`,
      );

      if (patron.test(mensaje)) {
        cantidad = valor;
        break;
      }
    }
  }

  if (
    !Number.isInteger(cantidad)
    || cantidad <= 0
  ) {
    return valorPredeterminado;
  }

  return Math.min(
    cantidad,
    limiteMaximo,
  );
};

export const extraerParametros = (
  intencion,
  mensaje,
) => {
  const parametros = {};

  switch (intencion) {
    case "contar_cilindros_estado":
    case "listar_cilindros_estado":
      return agregarParametro(
        parametros,
        "estado",
        extraerEstadoCilindro(mensaje),
      );

    case "buscar_cilindro_codigo":
    case "consultar_historial_cilindro":
      return agregarParametro(
        parametros,
        "codigo",
        extraerCodigoCilindro(mensaje),
      );

    case "contar_clientes_estado":
    case "listar_clientes_estado":
      return agregarParametro(
        parametros,
        "estado",
        extraerEstadoCliente(mensaje),
      );

    case "buscar_cliente":
      return agregarParametro(
        parametros,
        "dni",
        extraerDni(mensaje),
      );

    case "consultar_movimientos_recientes":
      return agregarParametro(
        parametros,
        "cantidad",
        extraerCantidad(mensaje),
      );

    default:
      return parametros;
  }
};