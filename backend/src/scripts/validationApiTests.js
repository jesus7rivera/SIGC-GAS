const API_BASE_URL =
  process.env.API_BASE_URL ??
  "http://127.0.0.1:5000/api";

const solicitar = async (ruta, opciones = {}) => {
  const respuesta = await fetch(
    `${API_BASE_URL}${ruta}`,
    {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        ...opciones.headers,
      },
    },
  );

  const contenido = await respuesta.text();

  let datos = null;

  if (contenido) {
    try {
      datos = JSON.parse(contenido);
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
  if (resultado.estado !== estadoEsperado) {
    throw new Error(
      `${descripcion}: se esperaba ${estadoEsperado}, ` +
        `pero se recibio ${resultado.estado}. ` +
        `Respuesta: ${JSON.stringify(resultado.datos)}`,
    );
  }

  console.log(
    `OK ${descripcion}: HTTP ${resultado.estado}`,
  );
};

const verificarRespuestaJson = (
  resultado,
  descripcion,
) => {
  const esObjetoJson =
    resultado.datos !== null &&
    typeof resultado.datos === "object" &&
    !Array.isArray(resultado.datos);

  if (!esObjetoJson) {
    throw new Error(
      `${descripcion}: la respuesta no tiene formato JSON. ` +
        `Respuesta: ${JSON.stringify(resultado.datos)}`,
    );
  }

  console.log(
    `OK ${descripcion}: respuesta JSON`,
  );
};

const verificarValor = (
  valorActual,
  valorEsperado,
  descripcion,
) => {
  if (valorActual !== valorEsperado) {
    throw new Error(
      `${descripcion}: se esperaba ` +
        `${JSON.stringify(valorEsperado)}, pero se recibio ` +
        `${JSON.stringify(valorActual)}.`,
    );
  }

  console.log(`OK ${descripcion}`);
};

const iniciarSesionAdministrador = async () => {
  const resultado = await solicitar(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo: "admin@sigcgas.com",
        password: "admin123",
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
      "El login no devolvio el token del Administrador.",
    );
  }

  return resultado.datos.token;
};

const ejecutarPruebas = async () => {
  console.log(
    "======================================================",
  );
  console.log("PRUEBAS DE VALIDACION DE LA API");
  console.log(
    "======================================================",
  );

  let tokenAdministrador = null;
  let clienteCreadoId = null;
  let cilindroCreadoId = null;

  const marcaTiempo = Date.now().toString();
  const dniTemporal = marcaTiempo.slice(-8);
  const codigoTemporal =
    `CIL-VAL-${marcaTiempo.slice(-6)}`;

  const autorizar = () => ({
    Authorization: `Bearer ${tokenAdministrador}`,
  });

  try {
    const jsonMalFormado = await solicitar(
      "/auth/login",
      {
        method: "POST",
        body:
          '{"correo":"admin@sigcgas.com",' +
          '"password":"admin123"',
      },
    );

    verificarEstado(
      jsonMalFormado,
      400,
      "JSON mal formado",
    );

    verificarRespuestaJson(
      jsonMalFormado,
      "JSON mal formado",
    );

    const correoInvalido = await solicitar(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          correo: "correo-invalido",
          password: "admin123",
        }),
      },
    );

    verificarEstado(
      correoInvalido,
      400,
      "Correo con formato invalido",
    );

    const campoExtraLogin = await solicitar(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          correo: "admin@sigcgas.com",
          password: "admin123",
          privilegio: "total",
        }),
      },
    );

    verificarEstado(
      campoExtraLogin,
      400,
      "Campo no permitido en login",
    );

    tokenAdministrador =
      await iniciarSesionAdministrador();

    const dniInvalido = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          dni: "1234567",
          nombre: "Cliente DNI invalido",
          telefono: "900000091",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      dniInvalido,
      400,
      "Cliente con DNI invalido",
    );

    const telefonoInvalido = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          dni: dniTemporal,
          nombre: "Cliente telefono invalido",
          telefono: "900ABC123",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      telefonoInvalido,
      400,
      "Cliente con telefono invalido",
    );

    const campoExtraCliente = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          dni: dniTemporal,
          nombre: "Cliente campo adicional",
          telefono: "900000092",
          estado: "Activo",
          esAdministrador: true,
        }),
      },
    );

    verificarEstado(
      campoExtraCliente,
      400,
      "Campo no permitido en cliente",
    );

    const crearCliente = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          dni: dniTemporal,
          nombre: "  Cliente validacion API  ",
          telefono: "900000093",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      crearCliente,
      201,
      "Creacion de cliente valido",
    );

    clienteCreadoId = crearCliente.datos?._id;

    if (!clienteCreadoId) {
      throw new Error(
        "La creacion del cliente no devolvio su identificador.",
      );
    }

    verificarValor(
      crearCliente.datos.nombre,
      "Cliente validacion API",
      "Normalizacion del nombre del cliente",
    );

    const clienteDuplicado = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          dni: dniTemporal,
          nombre: "Cliente duplicado API",
          telefono: "900000094",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      clienteDuplicado,
      409,
      "Cliente con DNI duplicado",
    );

    const idClienteInvalido = await solicitar(
      "/clientes/id-no-valido",
      {
        method: "PUT",
        headers: autorizar(),
        body: JSON.stringify({
          dni: dniTemporal,
          nombre: "Cliente actualizado",
          telefono: "900000093",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      idClienteInvalido,
      400,
      "Actualizacion con ObjectId invalido",
    );

    const codigoInvalido = await solicitar(
      "/cilindros",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          codigo: "ABC-001",
          tipo: "Industrial",
          capacidad: "45 Kg",
          estado: "Disponible",
        }),
      },
    );

    verificarEstado(
      codigoInvalido,
      400,
      "Cilindro con codigo invalido",
    );

    const tipoCilindroInvalido = await solicitar(
      "/cilindros",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          codigo: codigoTemporal,
          tipo: "Residencial",
          capacidad: "45 Kg",
          estado: "Disponible",
        }),
      },
    );

    verificarEstado(
      tipoCilindroInvalido,
      400,
      "Cilindro con tipo invalido",
    );

    const crearCilindro = await solicitar(
      "/cilindros",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          codigo: codigoTemporal.toLowerCase(),
          tipo: "Industrial",
          capacidad: "45 Kg",
          estado: "Disponible",
        }),
      },
    );

    verificarEstado(
      crearCilindro,
      201,
      "Creacion de cilindro valido",
    );

    cilindroCreadoId = crearCilindro.datos?._id;

    if (!cilindroCreadoId) {
      throw new Error(
        "La creacion del cilindro no devolvio su identificador.",
      );
    }

    verificarValor(
      crearCilindro.datos.codigo,
      codigoTemporal,
      "Normalizacion del codigo del cilindro",
    );

    const idCilindroInvalido = await solicitar(
      "/cilindros/id-no-valido",
      {
        method: "DELETE",
        headers: autorizar(),
      },
    );

    verificarEstado(
      idCilindroInvalido,
      400,
      "Eliminacion con ObjectId invalido",
    );

    const movimientoIdInvalido = await solicitar(
      "/movimientos",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          cliente: "id-no-valido",
          cilindro: cilindroCreadoId,
          tipo: "Salida",
          observacion: "Prueba de identificador",
        }),
      },
    );

    verificarEstado(
      movimientoIdInvalido,
      400,
      "Movimiento con ObjectId invalido",
    );

    const movimientoTipoInvalido = await solicitar(
      "/movimientos",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          cliente: clienteCreadoId,
          cilindro: cilindroCreadoId,
          tipo: "Prestamo",
          observacion: "Prueba de tipo",
        }),
      },
    );

    verificarEstado(
      movimientoTipoInvalido,
      400,
      "Movimiento con tipo invalido",
    );

    const clienteInexistente = await solicitar(
      "/movimientos",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          cliente: "000000000000000000000000",
          cilindro: cilindroCreadoId,
          tipo: "Salida",
          observacion: "Cliente inexistente",
        }),
      },
    );

    verificarEstado(
      clienteInexistente,
      404,
      "Movimiento con cliente inexistente",
    );

    const cilindroInexistente = await solicitar(
      "/movimientos",
      {
        method: "POST",
        headers: autorizar(),
        body: JSON.stringify({
          cliente: clienteCreadoId,
          cilindro: "111111111111111111111111",
          tipo: "Salida",
          observacion: "Cilindro inexistente",
        }),
      },
    );

    verificarEstado(
      cilindroInexistente,
      404,
      "Movimiento con cilindro inexistente",
    );

    const historialIdInvalido = await solicitar(
      "/movimientos/cilindro/id-no-valido",
      {
        headers: autorizar(),
      },
    );

    verificarEstado(
      historialIdInvalido,
      400,
      "Historial con ObjectId invalido",
    );

    const historialInexistente = await solicitar(
      "/movimientos/cilindro/222222222222222222222222",
      {
        headers: autorizar(),
      },
    );

    verificarEstado(
      historialInexistente,
      404,
      "Historial de cilindro inexistente",
    );

    const rutaInexistente = await solicitar(
      "/ruta-inexistente",
    );

    verificarEstado(
      rutaInexistente,
      404,
      "Ruta inexistente",
    );

    verificarRespuestaJson(
      rutaInexistente,
      "Ruta inexistente",
    );

    console.log(
      "======================================================",
    );
    console.log("RESULTADO: PASS");
  } finally {
    if (cilindroCreadoId && tokenAdministrador) {
      const eliminacionCilindro = await solicitar(
        `/cilindros/${cilindroCreadoId}`,
        {
          method: "DELETE",
          headers: autorizar(),
        },
      );

      if (eliminacionCilindro.estado === 200) {
        console.log(
          "OK Cilindro temporal eliminado.",
        );
      } else {
        console.error(
          "No se pudo eliminar el cilindro temporal.",
        );
      }
    }

    if (clienteCreadoId && tokenAdministrador) {
      const eliminacionCliente = await solicitar(
        `/clientes/${clienteCreadoId}`,
        {
          method: "DELETE",
          headers: autorizar(),
        },
      );

      if (eliminacionCliente.estado === 200) {
        console.log(
          "OK Cliente temporal eliminado.",
        );
      } else {
        console.error(
          "No se pudo eliminar el cliente temporal.",
        );
      }
    }
  }
};

ejecutarPruebas().catch((error) => {
  console.error(
    "======================================================",
  );
  console.error("RESULTADO: FAIL");
  console.error(error.message);

  process.exitCode = 1;
});