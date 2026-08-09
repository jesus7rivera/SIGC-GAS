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

  if (nombreBase !== "sigc_gas_test") {
    throw new Error(
      "Prueba cancelada: la gestión "
        + "de usuarios solo puede probarse "
        + "sobre sigc_gas_test.",
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
        + "ejecutar esta prueba contra "
        + "el backend local del puerto 5000.",
    );
  }
};

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
          "application/json",
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
      `${descripcion}: se esperaba HTTP `
        + `${estadoEsperado}, pero se recibió `
        + `${resultado.estado}.`,
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
      `El login de ${rolEsperado} `
        + "no devolvió un token.",
    );
  }

  if (
    resultado.datos.usuario?.rol
    !== rolEsperado
  ) {
    throw new Error(
      `Se esperaba el rol ${rolEsperado}, `
        + "pero se recibió "
        + `${resultado.datos.usuario?.rol}.`,
    );
  }

  return resultado.datos.token;
};

const ejecutarPruebas = async () => {
  console.log(
    "======================================================",
  );
  console.log(
    "PRUEBAS DE SEGURIDAD - GESTIÓN DE USUARIOS",
  );
  console.log(
    "======================================================",
  );

  validarEntornoPruebas();

  let usuarioTemporalId;

  const correoTemporal =
    `gestion-${Date.now()}@sigcgas.test`;

  const passwordAnterior =
    "Temporal123";

  const passwordNueva =
    "NuevaClave123";

  try {
    await mongoose.connect(
      MONGO_URI,
    );

    console.log(
      "✓ Conectado a MongoDB de pruebas.",
    );

    const passwordHash =
      await bcrypt.hash(
        passwordAnterior,
        10,
      );

    const usuarioTemporal =
      await Usuario.create({
        nombre:
          "Usuario Gestión API",
        correo:
          correoTemporal,
        password:
          passwordHash,
        rol:
          "Operador",
        estado:
          true,
        intentosFallidos:
          5,
        bloqueadoHasta:
          new Date(
            Date.now()
              + 5 * 60 * 1000,
          ),
      });

    usuarioTemporalId =
      usuarioTemporal._id;

    console.log(
      "✓ Usuario temporal bloqueado creado.",
    );

    const tokenAdministrador =
      await iniciarSesion(
        "admin@sigcgas.com",
        "admin123",
        "Administrador",
      );

    const tokenOperador =
      await iniciarSesion(
        "operador@sigcgas.com",
        "operador123",
        "Operador",
      );

    const listadoSinToken =
      await solicitar(
        "/usuarios",
      );

    verificarEstado(
      listadoSinToken,
      401,
      "Listado sin autenticación",
    );

    const listadoOperador =
      await solicitar(
        "/usuarios",
        {
          headers: {
            Authorization:
              `Bearer ${tokenOperador}`,
          },
        },
      );

    verificarEstado(
      listadoOperador,
      403,
      "Listado por Operador",
    );

    const listadoAdministrador =
      await solicitar(
        "/usuarios",
        {
          headers: {
            Authorization:
              `Bearer ${tokenAdministrador}`,
          },
        },
      );

    verificarEstado(
      listadoAdministrador,
      200,
      "Listado por Administrador",
    );

    if (
      !Array.isArray(
        listadoAdministrador.datos,
      )
    ) {
      throw new Error(
        "El listado de usuarios "
          + "no devolvió un arreglo.",
      );
    }

    const usuarioListado =
      listadoAdministrador.datos.find(
        (usuario) =>
          usuario.id
          === String(
            usuarioTemporalId,
          ),
      );

    if (!usuarioListado) {
      throw new Error(
        "El usuario temporal no apareció "
          + "en el listado.",
      );
    }

    if (
      Object.hasOwn(
        usuarioListado,
        "password",
      )
    ) {
      throw new Error(
        "La API expuso el campo password.",
      );
    }

    if (
      usuarioListado.estadoAcceso
      !== "Bloqueado"
    ) {
      throw new Error(
        "El usuario temporal debería "
          + "figurar como Bloqueado.",
      );
    }

    console.log(
      "✓ Listado oculta password "
        + "y muestra estado Bloqueado.",
    );

    const desbloqueoOperador =
      await solicitar(
        `/usuarios/${usuarioTemporalId}/desbloquear`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${tokenOperador}`,
          },
        },
      );

    verificarEstado(
      desbloqueoOperador,
      403,
      "Desbloqueo por Operador",
    );

    const desbloqueoAdministrador =
      await solicitar(
        `/usuarios/${usuarioTemporalId}/desbloquear`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${tokenAdministrador}`,
          },
        },
      );

    verificarEstado(
      desbloqueoAdministrador,
      200,
      "Desbloqueo por Administrador",
    );

    let usuarioActualizado =
      await Usuario.findById(
        usuarioTemporalId,
      );

    if (
      usuarioActualizado
        .intentosFallidos
      !== 0
      || usuarioActualizado
        .bloqueadoHasta
        !== null
    ) {
      throw new Error(
        "El desbloqueo no reinició "
          + "correctamente el estado "
          + "de seguridad.",
      );
    }

    console.log(
      "✓ Desbloqueo reinició intentos "
        + "y eliminó bloqueadoHasta.",
    );

    await Usuario.updateOne(
      {
        _id:
          usuarioTemporalId,
      },
      {
        $set: {
          intentosFallidos:
            5,
          bloqueadoHasta:
            new Date(
              Date.now()
                + 5 * 60 * 1000,
            ),
        },
      },
    );

    const resetOperador =
      await solicitar(
        `/usuarios/${usuarioTemporalId}/restablecer-password`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${tokenOperador}`,
          },
          body: JSON.stringify({
            nuevaPassword:
              passwordNueva,
          }),
        },
      );

    verificarEstado(
      resetOperador,
      403,
      "Restablecimiento por Operador",
    );

    const passwordInvalida =
      await solicitar(
        `/usuarios/${usuarioTemporalId}/restablecer-password`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${tokenAdministrador}`,
          },
          body: JSON.stringify({
            nuevaPassword:
              "123",
          }),
        },
      );

    verificarEstado(
      passwordInvalida,
      400,
      "Contraseña nueva inválida",
    );

    const resetAdministrador =
      await solicitar(
        `/usuarios/${usuarioTemporalId}/restablecer-password`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${tokenAdministrador}`,
          },
          body: JSON.stringify({
            nuevaPassword:
              passwordNueva,
          }),
        },
      );

    verificarEstado(
      resetAdministrador,
      200,
      "Restablecimiento por Administrador",
    );

    usuarioActualizado =
      await Usuario.findById(
        usuarioTemporalId,
      );

    if (
      usuarioActualizado
        .password
      === passwordNueva
    ) {
      throw new Error(
        "La nueva contraseña fue "
          + "almacenada en texto plano.",
      );
    }

    const coincideNuevaPassword =
      await bcrypt.compare(
        passwordNueva,
        usuarioActualizado.password,
      );

    if (!coincideNuevaPassword) {
      throw new Error(
        "El hash almacenado no corresponde "
          + "a la nueva contraseña.",
      );
    }

    if (
      usuarioActualizado
        .intentosFallidos
      !== 0
      || usuarioActualizado
        .bloqueadoHasta
        !== null
    ) {
      throw new Error(
        "El restablecimiento no reinició "
          + "el estado de seguridad.",
      );
    }

    console.log(
      "✓ Nueva contraseña almacenada "
        + "mediante bcrypt.",
    );

    console.log(
      "✓ Restablecimiento reinició "
        + "el bloqueo de la cuenta.",
    );

    const loginPasswordAnterior =
      await solicitar(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            correo:
              correoTemporal,
            password:
              passwordAnterior,
          }),
        },
      );

    verificarEstado(
      loginPasswordAnterior,
      401,
      "Login con contraseña anterior",
    );

    const loginPasswordNueva =
      await solicitar(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            correo:
              correoTemporal,
            password:
              passwordNueva,
          }),
        },
      );

    verificarEstado(
      loginPasswordNueva,
      200,
      "Login con contraseña nueva",
    );

    usuarioActualizado =
      await Usuario.findById(
        usuarioTemporalId,
      );

    if (
      usuarioActualizado
        .intentosFallidos
      !== 0
      || usuarioActualizado
        .bloqueadoHasta
        !== null
    ) {
      throw new Error(
        "El login correcto no dejó "
          + "la cuenta en estado normal.",
      );
    }

    console.log(
      "✓ Contraseña anterior rechazada "
        + "y nueva contraseña aceptada.",
    );

    console.log(
      "======================================================",
    );
    console.log(
      "RESULTADO: PASS",
    );
  } finally {
    if (usuarioTemporalId) {
      await Usuario.deleteOne({
        _id:
          usuarioTemporalId,
      });

      console.log(
        "✓ Usuario temporal eliminado.",
      );
    }

    if (
      mongoose.connection.readyState
      !== 0
    ) {
      await mongoose.disconnect();

      console.log(
        "✓ Conexión de pruebas cerrada.",
      );
    }
  }
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