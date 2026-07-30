const API_BASE_URL =
  process.env.API_BASE_URL
  ?? "http://127.0.0.1:5000/api";

const solicitar = async (
  ruta,
  opciones = {},
) => {
  const respuesta = await fetch(
    `${API_BASE_URL}${ruta}`,
    {
      ...opciones,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        ...opciones.headers,
      },
    },
  );

  const contenido =
    await respuesta.text();

  let datos = null;

  if (contenido) {
    try {
      datos =
        JSON.parse(contenido);
    } catch {
      datos = contenido;
    }
  }

  return {
    estado: respuesta.status,
    datos,
  };
};

const verificarEstado = (
  resultado,
  estadoEsperado,
  descripcion,
) => {
  if (
    resultado.estado
      !== estadoEsperado
  ) {
    throw new Error(
      `${descripcion}: se esperaba HTTP ${estadoEsperado}, `
      + `pero se recibió HTTP ${resultado.estado}. `
      + `Respuesta: ${JSON.stringify(resultado.datos)}`,
    );
  }

  console.log(
    `OK ${descripcion}: HTTP ${resultado.estado}`,
  );
};

const verificarValor = (
  valorActual,
  valorEsperado,
  descripcion,
) => {
  if (
    valorActual
      !== valorEsperado
  ) {
    throw new Error(
      `${descripcion}: se esperaba `
      + `${JSON.stringify(valorEsperado)}, `
      + `pero se recibió `
      + `${JSON.stringify(valorActual)}.`,
    );
  }

  console.log(
    `OK ${descripcion}`,
  );
};

const verificarCondicion = (
  condicion,
  descripcion,
) => {
  if (!condicion) {
    throw new Error(
      `${descripcion}: la condición no se cumplió.`,
    );
  }

  console.log(
    `OK ${descripcion}`,
  );
};

const iniciarSesionAdministrador =
  async () => {
    const resultado =
      await solicitar(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            correo:
              "admin@sigcgas.com",
            password:
              "admin123",
          }),
        },
      );

    verificarEstado(
      resultado,
      200,
      "Login del Administrador",
    );

    if (!resultado.datos?.token) {
      throw new Error(
        "El login no devolvió el token del Administrador.",
      );
    }

    return resultado.datos.token;
  };

const obtenerFirmaCilindros = (
  cilindros,
) =>
  cilindros
    .map(
      (cilindro) =>
        [
          cilindro._id,
          cilindro.codigo,
          cilindro.estado,
        ].join(":"),
    )
    .sort();

const ejecutarPruebas = async () => {
  console.log(
    "======================================================",
  );

  console.log(
    "PRUEBAS DE LA API DEL CHATBOT",
  );

  console.log(
    "======================================================",
  );

  const sinToken =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        body: JSON.stringify({
          mensaje: "Hola",
        }),
      },
    );

  verificarEstado(
    sinToken,
    401,
    "Acceso al chatbot sin token",
  );

  const tokenAdministrador =
    await iniciarSesionAdministrador();

  const autorizar = () => ({
    Authorization:
      `Bearer ${tokenAdministrador}`,
  });

  const cilindrosAntes =
    await solicitar(
      "/cilindros",
      {
        headers: autorizar(),
      },
    );

  verificarEstado(
    cilindrosAntes,
    200,
    "Consulta inicial de cilindros",
  );

  verificarCondicion(
    Array.isArray(
      cilindrosAntes.datos,
    ),
    "La API de cilindros devuelve un arreglo",
  );

  const cantidadDisponibles =
    cilindrosAntes.datos.filter(
      (cilindro) =>
        cilindro.estado
          === "Disponible",
    ).length;

  const saludo =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje: "Hola",
        }),
      },
    );

  verificarEstado(
    saludo,
    200,
    "Saludo del chatbot",
  );

  verificarValor(
    saludo.datos?.intencion,
    "saludo",
    "Intención de saludo",
  );

  verificarValor(
    saludo.datos?.datos,
    null,
    "El saludo no devuelve datos operativos",
  );

  const conteoCilindros =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje:
            "¿Cuántos cilindros están disponibles?",
        }),
      },
    );

  verificarEstado(
    conteoCilindros,
    200,
    "Conteo de cilindros disponibles",
  );

  verificarValor(
    conteoCilindros
      .datos?.intencion,
    "contar_cilindros_estado",
    "Intención de conteo de cilindros",
  );

  verificarValor(
    conteoCilindros
      .datos?.parametros?.estado,
    "Disponible",
    "Estado extraído de la consulta",
  );

  verificarValor(
    conteoCilindros
      .datos?.datos?.cantidad,
    cantidadDisponibles,
    "Cantidad basada en los datos reales",
  );

  const campoAdicional =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje: "Hola",
          rol: "Administrador",
        }),
      },
    );

  verificarEstado(
    campoAdicional,
    400,
    "Campo adicional rechazado",
  );

  verificarValor(
    campoAdicional
      .datos?.errores?.[0],
    "Campos no permitidos: rol",
    "Mensaje de campo no permitido",
  );

  const mensajeLargo =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje: "a".repeat(301),
        }),
      },
    );

  verificarEstado(
    mensajeLargo,
    400,
    "Mensaje superior a 300 caracteres",
  );

  const firmaAntes =
    obtenerFirmaCilindros(
      cilindrosAntes.datos,
    );

  const modificacionRestringida =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje:
            "Elimina el cilindro CIL-001",
        }),
      },
    );

  verificarEstado(
    modificacionRestringida,
    200,
    "Solicitud de modificación restringida",
  );

  verificarValor(
    modificacionRestringida
      .datos?.intencion,
    "solicitud_modificacion_restringida",
    "Intención de modificación restringida",
  );

  verificarValor(
    modificacionRestringida
      .datos?.datos,
    null,
    "La modificación restringida no devuelve datos",
  );

  const cilindrosDespues =
    await solicitar(
      "/cilindros",
      {
        headers: autorizar(),
      },
    );

  verificarEstado(
    cilindrosDespues,
    200,
    "Consulta posterior de cilindros",
  );

  const firmaDespues =
    obtenerFirmaCilindros(
      cilindrosDespues.datos,
    );

  verificarValor(
    JSON.stringify(
      firmaDespues,
    ),
    JSON.stringify(
      firmaAntes,
    ),
    "La solicitud restringida no modificó cilindros",
  );

  const consultaDesconocida =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje:
            "¿Cuál es la capital de Francia?",
        }),
      },
    );

  verificarEstado(
    consultaDesconocida,
    200,
    "Consulta desconocida controlada",
  );

  verificarValor(
    consultaDesconocida
      .datos?.intencion,
    "consulta_no_reconocida",
    "Intención desconocida",
  );

  const historialSinCodigo =
    await solicitar(
      "/chatbot/mensaje",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          mensaje:
            "Muéstrame el historial del cilindro",
        }),
      },
    );

  verificarEstado(
    historialSinCodigo,
    200,
    "Historial sin código",
  );

  verificarValor(
    historialSinCodigo
      .datos?.intencion,
    "consultar_historial_cilindro",
    "Intención de historial incompleto",
  );

  verificarCondicion(
    historialSinCodigo
      .datos?.respuesta
      ?.includes(
        "Indica el código",
      ),
    "Solicitud de aclaración del código",
  );

  console.log(
    "======================================================",
  );

  console.log(
    "RESULTADO: PASS",
  );
};

ejecutarPruebas().catch(
  (error) => {
    console.error(
      "======================================================",
    );

    console.error(
      "RESULTADO: FAIL",
    );

    console.error(
      error.message,
    );

    process.exitCode = 1;
  },
);