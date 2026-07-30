const normalizarTexto = (
  texto,
) => {
  if (
    typeof texto !== "string"
  ) {
    return "";
  }

  return texto
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9\s-]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
};

const esSeguimientoDeListado = (
  mensaje,
) => {
  const mensajeNormalizado =
    normalizarTexto(
      mensaje,
    );

  return (
    /^quienes son\b/.test(
      mensajeNormalizado,
    )
    || /^cuales son\b/.test(
      mensajeNormalizado,
    )
    || /^muestramelos\b/.test(
      mensajeNormalizado,
    )
    || /^muestramelas\b/.test(
      mensajeNormalizado,
    )
    || /^listalos\b/.test(
      mensajeNormalizado,
    )
    || /^listalas\b/.test(
      mensajeNormalizado,
    )
    || /^dame la lista\b/.test(
      mensajeNormalizado,
    )
    || /^y quienes son\b/.test(
      mensajeNormalizado,
    )
    || /^y cuales son\b/.test(
      mensajeNormalizado,
    )
  );
};

const construirListadoClientes = (
  estado,
) => {
  if (estado === "Todos") {
    return (
      "Muéstrame todos los "
      + "clientes registrados"
    );
  }

  const descripcion =
    estado === "Activo"
      ? "activos"
      : "inactivos";

  return (
    `Muéstrame los clientes `
    + `${descripcion}`
  );
};

const construirListadoCilindros = (
  estado,
) => {
  if (
    estado === "Mantenimiento"
  ) {
    return (
      "Muéstrame los cilindros "
      + "en mantenimiento"
    );
  }

  const descripcion =
    estado === "Disponible"
      ? "disponibles"
      : "prestados";

  return (
    `Muéstrame los cilindros `
    + `${descripcion}`
  );
};

export const obtenerContextoChatbot = (
  resultado,
) => {
  const {
    intencion,
    parametros,
  } = resultado ?? {};

  const estado =
    parametros?.estado;

  if (!estado) {
    return null;
  }

  if (
    intencion
      === "contar_clientes_estado"
  ) {
    return {
      tipo: "clientes",
      estado,
    };
  }

  if (
    intencion
      === "contar_cilindros_estado"
  ) {
    return {
      tipo: "cilindros",
      estado,
    };
  }

  return null;
};

export const resolverConsultaContextual = (
  mensaje,
  contexto,
) => {
  const mensajeLimpio =
    typeof mensaje === "string"
      ? mensaje.trim()
      : "";

  if (
    !contexto
    || !esSeguimientoDeListado(
      mensajeLimpio,
    )
  ) {
    return mensajeLimpio;
  }

  if (
    contexto.tipo === "clientes"
  ) {
    return construirListadoClientes(
      contexto.estado,
    );
  }

  if (
    contexto.tipo === "cilindros"
  ) {
    return construirListadoCilindros(
      contexto.estado,
    );
  }

  return mensajeLimpio;
};