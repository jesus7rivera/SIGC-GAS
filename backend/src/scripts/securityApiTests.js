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
        `pero se recibió ${resultado.estado}. ` +
        `Respuesta: ${JSON.stringify(resultado.datos)}`,
    );
  }

  console.log(
    `✓ ${descripcion}: HTTP ${resultado.estado}`,
  );
};

const iniciarSesion = async (
  correo,
  password,
  rolEsperado,
) => {
  const resultado = await solicitar(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo,
        password,
      }),
    },
  );

  verificarEstado(
    resultado,
    200,
    `Login de ${rolEsperado}`,
  );

  if (!resultado.datos?.token) {
    throw new Error(
      `El login de ${rolEsperado} no devolvió un token.`,
    );
  }

  if (resultado.datos.usuario?.rol !== rolEsperado) {
    throw new Error(
      `Se esperaba el rol ${rolEsperado}, pero se recibió ` +
        `${resultado.datos.usuario?.rol}.`,
    );
  }

  return resultado.datos.token;
};

const ejecutarPruebas = async () => {
  console.log(
    "======================================================",
  );
  console.log("PRUEBAS DE SEGURIDAD DE LA API");
  console.log(
    "======================================================",
  );

  let tokenAdministrador = null;
  let clienteCreadoId = null;

  const identificador = Date.now().toString().slice(-8);

  try {
    const dashboardSinToken = await solicitar(
      "/dashboard",
    );

    verificarEstado(
      dashboardSinToken,
      401,
      "Dashboard sin token",
    );

    const dashboardTokenInvalido = await solicitar(
      "/dashboard",
      {
        headers: {
          Authorization: "Bearer token-invalido",
        },
      },
    );

    verificarEstado(
      dashboardTokenInvalido,
      401,
      "Dashboard con token inválido",
    );

    const tokenOperador = await iniciarSesion(
      "operador@sigcgas.com",
      "operador123",
      "Operador",
    );

    const dashboardOperador = await solicitar(
      "/dashboard",
      {
        headers: {
          Authorization: `Bearer ${tokenOperador}`,
        },
      },
    );

    verificarEstado(
      dashboardOperador,
      200,
      "Dashboard para Operador",
    );

    const clientesOperador = await solicitar(
      "/clientes",
      {
        headers: {
          Authorization: `Bearer ${tokenOperador}`,
        },
      },
    );

    verificarEstado(
      clientesOperador,
      200,
      "Consulta de clientes por Operador",
    );

    const crearClienteOperador = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenOperador}`,
        },
        body: JSON.stringify({
          dni: identificador,
          nombre: "Cliente bloqueado API",
          telefono: "900000099",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      crearClienteOperador,
      403,
      "Creación de cliente por Operador",
    );

    const registrarUsuarioOperador = await solicitar(
      "/auth/registrar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenOperador}`,
        },
        body: JSON.stringify({
          nombre: "Usuario bloqueado API",
          correo: `bloqueado-${Date.now()}@sigcgas.test`,
          password: "prueba123",
          rol: "Operador",
        }),
      },
    );

    verificarEstado(
      registrarUsuarioOperador,
      403,
      "Registro de usuario por Operador",
    );

    tokenAdministrador = await iniciarSesion(
      "admin@sigcgas.com",
      "admin123",
      "Administrador",
    );

    const dashboardAdministrador = await solicitar(
      "/dashboard",
      {
        headers: {
          Authorization:
            `Bearer ${tokenAdministrador}`,
        },
      },
    );

    verificarEstado(
      dashboardAdministrador,
      200,
      "Dashboard para Administrador",
    );

    const crearClienteAdministrador = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${tokenAdministrador}`,
        },
        body: JSON.stringify({
          dni: identificador,
          nombre: "Cliente prueba API",
          telefono: "900000098",
          estado: "Activo",
        }),
      },
    );

    verificarEstado(
      crearClienteAdministrador,
      201,
      "Creación de cliente por Administrador",
    );

    clienteCreadoId =
      crearClienteAdministrador.datos?._id;

    if (!clienteCreadoId) {
      throw new Error(
        "La creación del cliente no devolvió su identificador.",
      );
    }

    console.log(
      "======================================================",
    );
    console.log("RESULTADO: PASS");
  } finally {
    if (clienteCreadoId && tokenAdministrador) {
      const eliminacion = await solicitar(
        `/clientes/${clienteCreadoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${tokenAdministrador}`,
          },
        },
      );

      if (eliminacion.estado === 200) {
        console.log(
          "✓ Cliente temporal eliminado correctamente.",
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