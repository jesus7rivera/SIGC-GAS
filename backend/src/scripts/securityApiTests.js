import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Usuario from "../models/usuario.js";

const API_BASE_URL =
  process.env.API_BASE_URL
  ?? (
    process.env.CI === "true"
      ? "http://127.0.0.1:5000/api"
      : "http://127.0.0.1:5001/api"
  );

const MONGO_URI =
  process.env.MONGO_URI
  ?? "mongodb://127.0.0.1:27017/sigc_gas_test";

const validarEntornoPruebas = () => {
  let nombreBase;
  let apiUrl;

  try {
    const uri = new URL(MONGO_URI);

    nombreBase = uri.pathname
      .replace(/^\//, "")
      .split("?")[0];

    apiUrl = new URL(API_BASE_URL);
  } catch {
    throw new Error(
      "La configuración del entorno "
        + "de pruebas no es válida.",
    );
  }

  if (
    nombreBase !== "sigc_gas_test"
  ) {
    throw new Error(
      "Prueba cancelada: las pruebas "
        + "de seguridad solo pueden "
        + "ejecutarse sobre "
        + "sigc_gas_test.",
    );
  }

  const ejecutandoEnCI =
    process.env.CI === "true";

  if (
    !ejecutandoEnCI
    && apiUrl.port === "5000"
  ) {
    throw new Error(
      "Prueba cancelada: no se permite "
        + "ejecutar las pruebas de "
        + "seguridad contra el backend "
        + "local del puerto 5000.",
    );
  }
};

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

  validarEntornoPruebas();
   let tokenAdministrador = null;
  let clienteCreadoId = null;

  let usuarioBloqueoId;

const correoBloqueo =
  `bloqueo-${Date.now()}@sigcgas.test`;

const passwordCorrecto =
  "Bloqueo123";

const passwordIncorrecto =
  "Incorrecta123";

  const identificador = Date.now().toString().slice(-8);

 try {

await mongoose.connect(
  MONGO_URI,
);
const passwordHash = await bcrypt.hash(
  passwordCorrecto,
  10,
);


const usuarioBloqueo =
  await Usuario.create({
    nombre: "Usuario Bloqueo API",
    correo: correoBloqueo,
    password: passwordHash,
    rol: "Operador",
  });

usuarioBloqueoId =
  usuarioBloqueo._id;

console.log(
  "✓ Usuario temporal creado "
    + "para prueba de bloqueo.",
);

for (let intento = 1; intento <= 2; intento += 1) {
  const resultado = await solicitar(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo: correoBloqueo,
        password: passwordIncorrecto,
      }),
    },
  );

  verificarEstado(
    resultado,
    401,
    `Intento incorrecto ${intento} antes del reinicio`,
  );
}

let usuarioActualizado =
  await Usuario.findById(
    usuarioBloqueoId,
  );

if (
  usuarioActualizado.intentosFallidos !== 2
) {
  throw new Error(
    "El contador de intentos fallidos "
      + "debería ser 2.",
  );
}

const loginReinicio = await solicitar(
  "/auth/login",
  {
    method: "POST",
    body: JSON.stringify({
      correo: correoBloqueo,
      password: passwordCorrecto,
    }),
  },
);

verificarEstado(
  loginReinicio,
  200,
  "Login correcto reinicia intentos fallidos",
);

usuarioActualizado =
  await Usuario.findById(
    usuarioBloqueoId,
  );

if (
  usuarioActualizado.intentosFallidos !== 0
  || usuarioActualizado.bloqueadoHasta
) {
  throw new Error(
    "El login correcto no reinició "
      + "el estado de seguridad.",
  );
}

console.log(
  "✓ El login correcto reinició "
    + "el contador de intentos.",
);

for (
  let intento = 1;
  intento <= 4;
  intento += 1
) {
  const resultado = await solicitar(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo: correoBloqueo,
        password: passwordIncorrecto,
      }),
    },
  );

  verificarEstado(
    resultado,
    401,
    `Intento incorrecto ${intento} de 5`,
  );
}

const quintoIntento = await solicitar(
  "/auth/login",
  {
    method: "POST",
    body: JSON.stringify({
      correo: correoBloqueo,
      password: passwordIncorrecto,
    }),
  },
);

verificarEstado(
  quintoIntento,
  429,
  "Quinto intento activa el bloqueo",
);

usuarioActualizado =
  await Usuario.findById(
    usuarioBloqueoId,
  );

if (
  usuarioActualizado.intentosFallidos !== 5
) {
  throw new Error(
    "Después del quinto intento "
      + "el contador debería ser 5.",
  );
}

if (!usuarioActualizado.bloqueadoHasta) {
  throw new Error(
    "El usuario debería tener "
      + "una fecha de bloqueo.",
  );
}

const tiempoRestante =
  usuarioActualizado.bloqueadoHasta.getTime()
  - Date.now();

if (
  tiempoRestante <= 4 * 60 * 1000
  || tiempoRestante > 5 * 60 * 1000
) {
  throw new Error(
    "La duración del bloqueo no "
      + "corresponde aproximadamente "
      + "a 5 minutos.",
  );
}

console.log(
  "✓ El quinto intento bloqueó "
    + "temporalmente la cuenta.",
);

console.log(
  "✓ Bloqueo de aproximadamente "
    + "5 minutos registrado correctamente.",
);

const loginDuranteBloqueo =
  await solicitar(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo: correoBloqueo,
        password: passwordCorrecto,
      }),
    },
  );

verificarEstado(
  loginDuranteBloqueo,
  429,
  "Login correcto durante bloqueo",
);

console.log(
  "✓ La cuenta bloqueada rechazó "
    + "el acceso incluso con la "
    + "contraseña correcta.",
);

await Usuario.updateOne(
  {
    _id: usuarioBloqueoId,
  },
  {
    $set: {
      bloqueadoHasta:
        new Date(Date.now() - 1000),
    },
  },
);

const loginDespuesBloqueo =
  await solicitar(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo: correoBloqueo,
        password: passwordCorrecto,
      }),
    },
  );

verificarEstado(
  loginDespuesBloqueo,
  200,
  "Login después de vencer el bloqueo",
);

usuarioActualizado =
  await Usuario.findById(
    usuarioBloqueoId,
  );

if (
  usuarioActualizado.intentosFallidos !== 0
  || usuarioActualizado.bloqueadoHasta
) {
  throw new Error(
    "El estado de bloqueo no se limpió "
      + "después de autenticarse correctamente.",
  );
}

console.log(
  "✓ La cuenta volvió a habilitarse "
    + "después de vencer el bloqueo.",
);
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
    if (usuarioBloqueoId) {
  await Usuario.deleteOne({
    _id: usuarioBloqueoId,
  });

  console.log(
    "✓ Usuario temporal de bloqueo "
      + "eliminado correctamente.",
  );
}

if (
  mongoose.connection.readyState !== 0
) {
  await mongoose.disconnect();

  console.log(
    "✓ Conexión de pruebas "
      + "cerrada correctamente.",
  );
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