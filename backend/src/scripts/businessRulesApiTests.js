import mongoose from "mongoose";

import Cliente from "../models/Cliente.js";
import Cilindro from "../models/Cilindro.js";
import Movimiento from "../models/Movimiento.js";

const API_BASE_URL =
  process.env.API_BASE_URL ??
  "http://127.0.0.1:5000/api";

const MONGO_URI =
  process.env.MONGO_URI ??
  "mongodb://127.0.0.1:27017/sigc_gas_test";

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

const verificarEstadoHttp = (
  resultado,
  estadoEsperado,
  descripcion,
) => {
  if (resultado.estado !== estadoEsperado) {
    throw new Error(
      `${descripcion}: se esperaba HTTP ` +
        `${estadoEsperado}, pero se recibió ` +
        `${resultado.estado}. Respuesta: ` +
        `${JSON.stringify(resultado.datos)}`,
    );
  }

  console.log(
    `OK ${descripcion}: HTTP ${resultado.estado}`,
  );
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

  verificarEstadoHttp(
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

const consultarEstadoCilindro = async (
  token,
  cilindroId,
) => {
  const resultado = await solicitar(
    "/cilindros",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  verificarEstadoHttp(
    resultado,
    200,
    "Consulta de cilindros",
  );

  const cilindro = resultado.datos.find(
    (item) => item._id === cilindroId,
  );

  if (!cilindro) {
    throw new Error(
      "No se encontró el cilindro temporal.",
    );
  }

  return cilindro.estado;
};

const verificarEstadoCilindro = async (
  token,
  cilindroId,
  estadoEsperado,
  descripcion,
) => {
  const estadoActual =
    await consultarEstadoCilindro(
      token,
      cilindroId,
    );

  if (estadoActual !== estadoEsperado) {
    throw new Error(
      `${descripcion}: se esperaba el estado ` +
        `${estadoEsperado}, pero se recibió ` +
        `${estadoActual}.`,
    );
  }

  console.log(
    `OK ${descripcion}: ${estadoActual}`,
  );
};

const ejecutarPruebas = async () => {
  console.log(
    "======================================================",
  );
  console.log(
    "PRUEBAS DE REGLAS DE NEGOCIO DE MOVIMIENTOS",
  );
  console.log(
    "======================================================",
  );

  let clienteCreadoId = null;

  const cilindrosCreadosIds = [];
  const movimientosCreadosIds = [];

  const marcaTiempo = Date.now().toString();

  const dniTemporal =
    marcaTiempo.slice(-8);

  const codigoPrincipal =
    `CIL-NEG-${marcaTiempo.slice(-6)}`;

  const codigoConcurrencia =
    `CIL-CON-${marcaTiempo.slice(-6)}`;

  try {
    const tokenAdministrador =
      await iniciarSesionAdministrador();

    const autorizacion = {
      Authorization:
        `Bearer ${tokenAdministrador}`,
    };

    const crearCliente = await solicitar(
      "/clientes",
      {
        method: "POST",
        headers: autorizacion,
        body: JSON.stringify({
          dni: dniTemporal,
          nombre:
            "Cliente reglas de negocio",
          telefono: "900000096",
          estado: "Activo",
        }),
      },
    );

    verificarEstadoHttp(
      crearCliente,
      201,
      "Creación del cliente temporal",
    );

    clienteCreadoId =
      crearCliente.datos?._id;

    if (!clienteCreadoId) {
      throw new Error(
        "La API no devolvió el ID del cliente.",
      );
    }

    const crearCilindro = await solicitar(
      "/cilindros",
      {
        method: "POST",
        headers: autorizacion,
        body: JSON.stringify({
          codigo: codigoPrincipal,
          tipo: "Industrial",
          capacidad: "45 Kg",
          estado: "Disponible",
        }),
      },
    );

    verificarEstadoHttp(
      crearCilindro,
      201,
      "Creación del cilindro principal",
    );

    const cilindroPrincipalId =
      crearCilindro.datos?._id;

    if (!cilindroPrincipalId) {
      throw new Error(
        "La API no devolvió el ID del cilindro.",
      );
    }

    cilindrosCreadosIds.push(
      cilindroPrincipalId,
    );

    const registrarMovimiento = async (
      cilindroId,
      tipo,
      observacion,
    ) => {
      const resultado = await solicitar(
        "/movimientos",
        {
          method: "POST",
          headers: autorizacion,
          body: JSON.stringify({
            cliente: clienteCreadoId,
            cilindro: cilindroId,
            tipo,
            observacion,
          }),
        },
      );

      if (
        resultado.estado === 201 &&
        resultado.datos?._id
      ) {
        movimientosCreadosIds.push(
          resultado.datos._id,
        );
      }

      return resultado;
    };

    const salida = await registrarMovimiento(
      cilindroPrincipalId,
      "Salida",
      "Salida válida de prueba",
    );

    verificarEstadoHttp(
      salida,
      201,
      "Disponible más Salida",
    );

    await verificarEstadoCilindro(
      tokenAdministrador,
      cilindroPrincipalId,
      "Prestado",
      "Estado después de Salida",
    );

    const segundaSalida =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Salida",
        "Salida repetida no permitida",
      );

    verificarEstadoHttp(
      segundaSalida,
      409,
      "Prestado más Salida",
    );

    const devolucion =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Devolución",
        "Devolución válida de prueba",
      );

    verificarEstadoHttp(
      devolucion,
      201,
      "Prestado más Devolución",
    );

    await verificarEstadoCilindro(
      tokenAdministrador,
      cilindroPrincipalId,
      "Disponible",
      "Estado después de Devolución",
    );

    const segundaDevolucion =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Devolución",
        "Devolución repetida no permitida",
      );

    verificarEstadoHttp(
      segundaDevolucion,
      409,
      "Disponible más Devolución",
    );

    const mantenimiento =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Mantenimiento",
        "Ingreso a mantenimiento",
      );

    verificarEstadoHttp(
      mantenimiento,
      201,
      "Disponible más Mantenimiento",
    );

    await verificarEstadoCilindro(
      tokenAdministrador,
      cilindroPrincipalId,
      "Mantenimiento",
      "Estado durante mantenimiento",
    );

    const devolucionDesdeMantenimiento =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Devolución",
        "Operación incompatible",
      );

    verificarEstadoHttp(
      devolucionDesdeMantenimiento,
      409,
      "Mantenimiento más Devolución",
    );

    const finMantenimiento =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Fin de mantenimiento",
        "Mantenimiento finalizado",
      );

    verificarEstadoHttp(
      finMantenimiento,
      201,
      "Mantenimiento más Fin de mantenimiento",
    );

    await verificarEstadoCilindro(
      tokenAdministrador,
      cilindroPrincipalId,
      "Disponible",
      "Estado después de finalizar mantenimiento",
    );

    const desactivarCliente = await solicitar(
      `/clientes/${clienteCreadoId}`,
      {
        method: "PUT",
        headers: autorizacion,
        body: JSON.stringify({
          dni: dniTemporal,
          nombre:
            "Cliente reglas de negocio",
          telefono: "900000096",
          estado: "Inactivo",
        }),
      },
    );

    verificarEstadoHttp(
      desactivarCliente,
      200,
      "Desactivación del cliente",
    );

    const movimientoClienteInactivo =
      await registrarMovimiento(
        cilindroPrincipalId,
        "Salida",
        "Movimiento con cliente inactivo",
      );

    verificarEstadoHttp(
      movimientoClienteInactivo,
      409,
      "Movimiento para cliente inactivo",
    );

    const reactivarCliente = await solicitar(
      `/clientes/${clienteCreadoId}`,
      {
        method: "PUT",
        headers: autorizacion,
        body: JSON.stringify({
          dni: dniTemporal,
          nombre:
            "Cliente reglas de negocio",
          telefono: "900000096",
          estado: "Activo",
        }),
      },
    );

    verificarEstadoHttp(
      reactivarCliente,
      200,
      "Reactivación del cliente",
    );

    const crearCilindroConcurrencia =
      await solicitar(
        "/cilindros",
        {
          method: "POST",
          headers: autorizacion,
          body: JSON.stringify({
            codigo: codigoConcurrencia,
            tipo: "Comercial",
            capacidad: "15 Kg",
            estado: "Disponible",
          }),
        },
      );

    verificarEstadoHttp(
      crearCilindroConcurrencia,
      201,
      "Creación del cilindro para concurrencia",
    );

    const cilindroConcurrenciaId =
      crearCilindroConcurrencia.datos?._id;

    if (!cilindroConcurrenciaId) {
      throw new Error(
        "No se recibió el ID del cilindro de concurrencia.",
      );
    }

    cilindrosCreadosIds.push(
      cilindroConcurrenciaId,
    );

    const resultadosConcurrentes =
      await Promise.all([
        registrarMovimiento(
          cilindroConcurrenciaId,
          "Salida",
          "Solicitud concurrente A",
        ),

        registrarMovimiento(
          cilindroConcurrenciaId,
          "Salida",
          "Solicitud concurrente B",
        ),
      ]);

    const estadosConcurrentes =
      resultadosConcurrentes
        .map((resultado) => resultado.estado)
        .sort((a, b) => a - b);

    const resultadoEsperado = [201, 409];

    if (
      JSON.stringify(estadosConcurrentes) !==
      JSON.stringify(resultadoEsperado)
    ) {
      throw new Error(
        "Concurrencia: se esperaban los estados " +
          `201 y 409, pero se recibieron ` +
          `${estadosConcurrentes.join(" y ")}.`,
      );
    }

    console.log(
      "OK Concurrencia: una solicitud fue aceptada " +
        "y la otra fue rechazada.",
    );

    await verificarEstadoCilindro(
      tokenAdministrador,
      cilindroConcurrenciaId,
      "Prestado",
      "Estado después de solicitudes concurrentes",
    );

    console.log(
      "======================================================",
    );
    console.log("RESULTADO: PASS");
  } finally {
    try {
      await mongoose.connect(MONGO_URI);

      if (movimientosCreadosIds.length > 0) {
        await Movimiento.deleteMany({
          _id: {
            $in: movimientosCreadosIds,
          },
        });
      }

      if (cilindrosCreadosIds.length > 0) {
        await Cilindro.deleteMany({
          _id: {
            $in: cilindrosCreadosIds,
          },
        });
      }

      if (clienteCreadoId) {
        await Cliente.deleteOne({
          _id: clienteCreadoId,
        });
      }

      console.log(
        "OK Datos temporales eliminados.",
      );
    } catch (errorLimpieza) {
      console.error(
        "No se pudieron eliminar todos los datos temporales:",
        errorLimpieza.message,
      );
    } finally {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
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