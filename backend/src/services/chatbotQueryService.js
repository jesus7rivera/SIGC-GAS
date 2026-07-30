const LIMITE_RESULTADOS = 10;

const limitarResultados = (
  resultados,
) => {
  const elementos =
    resultados.slice(
      0,
      LIMITE_RESULTADOS,
    );

  return {
    elementos,
    hayMas:
      resultados.length
        > LIMITE_RESULTADOS,
  };
};

const formatearCilindro = (
  cilindro,
) => ({
  codigo: cilindro.codigo,
  tipo: cilindro.tipo,
  capacidad: cilindro.capacidad,
  estado: cilindro.estado,
});

const formatearCliente = (
  cliente,
) => ({
  dni: cliente.dni,
  nombre: cliente.nombre,
  telefono: cliente.telefono,
  estado: cliente.estado,
});

const formatearMovimiento = (
  movimiento,
) => ({
  fecha: movimiento.fecha,
  cliente:
    movimiento.cliente?.nombre
    ?? "Sin cliente",
  cilindro:
    movimiento.cilindro?.codigo
    ?? "Sin cilindro",
  tipo: movimiento.tipo,
  observacion:
    movimiento.observacion ?? "",
});

const formatearMovimientoHistorial = (
  movimiento,
) => ({
  fecha: movimiento.fecha,
  cliente:
    movimiento.cliente?.nombre
    ?? "Sin cliente",
  tipo: movimiento.tipo,
  observacion:
    movimiento.observacion ?? "",
});

const ejecutarResumen = async (
  repositorio,
) => {
  const [
    clientesActivos,
    disponibles,
    prestados,
    mantenimiento,
  ] = await Promise.all([
    repositorio
      .contarClientesPorEstado(
        "Activo",
      ),

    repositorio
      .contarCilindrosPorEstado(
        "Disponible",
      ),

    repositorio
      .contarCilindrosPorEstado(
        "Prestado",
      ),

    repositorio
      .contarCilindrosPorEstado(
        "Mantenimiento",
      ),
  ]);

  return {
    respuesta:
      `El sistema registra ${clientesActivos} clientes activos, ${disponibles} cilindros disponibles, ${prestados} prestados y ${mantenimiento} en mantenimiento.`,
    datos: {
      clientesActivos,
      disponibles,
      prestados,
      mantenimiento,
    },
  };
};

const ejecutarConteoCilindros =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      estado,
    } = parametros;

    const cantidad =
      await repositorio
        .contarCilindrosPorEstado(
          estado,
        );

    return {
      respuesta:
        `Actualmente hay ${cantidad} cilindros ${estado.toLowerCase()}${estado === "Mantenimiento" ? "" : "s"}.`,
      datos: {
        estado,
        cantidad,
      },
    };
  };

const ejecutarListadoCilindros =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      estado,
    } = parametros;

    const resultados =
      await repositorio
        .listarCilindrosPorEstado(
          estado,
          LIMITE_RESULTADOS + 1,
        );

    const {
      elementos,
      hayMas,
    } = limitarResultados(
      resultados,
    );

    if (elementos.length === 0) {
      return {
        respuesta:
          "No se encontraron cilindros con el estado solicitado.",
        datos: [],
      };
    }

    const complemento = hayMas
      ? " Se muestran los primeros 10 resultados."
      : "";

    return {
      respuesta:
        `Se encontraron cilindros ${estado.toLowerCase()}s.${complemento}`,
      datos:
        elementos.map(
          formatearCilindro,
        ),
    };
  };

const ejecutarBusquedaCilindro =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      codigo,
    } = parametros;

    const cilindro =
      await repositorio
        .buscarCilindroPorCodigo(
          codigo,
        );

    if (!cilindro) {
      return {
        respuesta:
          `No se encontró un cilindro con el código ${codigo}.`,
        datos: null,
      };
    }

    return {
      respuesta:
        `El cilindro ${cilindro.codigo} está ${cilindro.estado.toLowerCase()}.`,
      datos:
        formatearCilindro(
          cilindro,
        ),
    };
  };

const ejecutarConteoClientes =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      estado,
    } = parametros;

    const cantidad =
      await repositorio
        .contarClientesPorEstado(
          estado,
        );

    const descripcion =
      estado === "Todos"
        ? "registrados"
        : `${estado.toLowerCase()}s`;

    return {
      respuesta:
        `Actualmente existen ${cantidad} clientes ${descripcion}.`,
      datos: {
        estado,
        cantidad,
      },
    };
  };

const ejecutarBusquedaCliente =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      dni,
    } = parametros;

    const cliente =
      await repositorio
        .buscarClientePorDni(
          dni,
        );

    if (!cliente) {
      return {
        respuesta:
          "No se encontró un cliente con los datos indicados.",
        datos: null,
      };
    }

    return {
      respuesta:
        `Se encontró al cliente ${cliente.nombre}.`,
      datos:
        formatearCliente(
          cliente,
        ),
    };
  };

const ejecutarMovimientosRecientes =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      cantidad,
    } = parametros;

    const movimientos =
      await repositorio
        .listarMovimientosRecientes(
          cantidad,
        );

    if (movimientos.length === 0) {
      return {
        respuesta:
          "No existen movimientos registrados.",
        datos: [],
      };
    }

    return {
      respuesta:
        `Estos son los ${movimientos.length} movimientos más recientes.`,
      datos:
        movimientos.map(
          formatearMovimiento,
        ),
    };
  };

const obtenerRangoDelDia = (
  ahora,
) => {
  const desde =
    new Date(ahora);

  desde.setHours(
    0,
    0,
    0,
    0,
  );

  const hasta =
    new Date(desde);

  hasta.setDate(
    hasta.getDate() + 1,
  );

  return {
    desde,
    hasta,
  };
};

const ejecutarMovimientosHoy =
  async (
    repositorio,
    ahora,
  ) => {
    const {
      desde,
      hasta,
    } = obtenerRangoDelDia(
      ahora,
    );

    const resultados =
      await repositorio
        .listarMovimientosPorRango(
          desde,
          hasta,
          LIMITE_RESULTADOS + 1,
        );

    const {
      elementos,
      hayMas,
    } = limitarResultados(
      resultados,
    );

    if (elementos.length === 0) {
      return {
        respuesta:
          "No se registraron movimientos durante el día de hoy.",
        datos: [],
      };
    }

    const complemento = hayMas
      ? " Se muestran los primeros 10 resultados."
      : "";

    return {
      respuesta:
        `Durante el día de hoy se registraron ${elementos.length} movimientos.${complemento}`,
      datos:
        elementos.map(
          formatearMovimiento,
        ),
    };
  };

const ejecutarHistorialCilindro =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      codigo,
    } = parametros;

    const cilindro =
      await repositorio
        .buscarCilindroPorCodigo(
          codigo,
        );

    if (!cilindro) {
      return {
        respuesta:
          `No se encontró un cilindro con el código ${codigo}.`,
        datos: null,
      };
    }

    const resultados =
      await repositorio
        .listarMovimientosPorCilindro(
          cilindro._id,
          LIMITE_RESULTADOS + 1,
        );

    const {
      elementos,
      hayMas,
    } = limitarResultados(
      resultados,
    );

    if (elementos.length === 0) {
      return {
        respuesta:
          `El cilindro ${codigo} existe, pero todavía no tiene movimientos registrados.`,
        datos: {
          cilindro: {
            codigo:
              cilindro.codigo,
            estado:
              cilindro.estado,
          },
          movimientos: [],
        },
      };
    }

    const cantidad =
      elementos.length;

    const descripcion =
      cantidad === 1
        ? "movimiento registrado"
        : "movimientos registrados";

    const complemento = hayMas
      ? " Se muestran los primeros 10 resultados."
      : "";

    return {
      respuesta:
        `El cilindro ${codigo} tiene ${cantidad} ${descripcion}.${complemento}`,
      datos: {
        cilindro: {
          codigo:
            cilindro.codigo,
          estado:
            cilindro.estado,
        },
        movimientos:
          elementos.map(
            formatearMovimientoHistorial,
          ),
      },
    };
  };

export const ejecutarConsultaChatbot =
  async (
    solicitud,
    dependencias = {},
  ) => {
    const {
      intencion,
      parametros = {},
    } = solicitud;

    const {
      repositorio,
      ahora = new Date(),
    } = dependencias;

    if (!repositorio) {
      throw new Error(
        "El repositorio de consultas del chatbot no está configurado.",
      );
    }

    switch (intencion) {
      case "consultar_resumen":
        return ejecutarResumen(
          repositorio,
        );

      case "contar_cilindros_estado":
        return ejecutarConteoCilindros(
          repositorio,
          parametros,
        );

      case "listar_cilindros_estado":
        return ejecutarListadoCilindros(
          repositorio,
          parametros,
        );

      case "buscar_cilindro_codigo":
        return ejecutarBusquedaCilindro(
          repositorio,
          parametros,
        );

      case "contar_clientes_estado":
        return ejecutarConteoClientes(
          repositorio,
          parametros,
        );

      case "buscar_cliente":
        return ejecutarBusquedaCliente(
          repositorio,
          parametros,
        );

      case "consultar_movimientos_recientes":
        return ejecutarMovimientosRecientes(
          repositorio,
          parametros,
        );

      case "consultar_movimientos_hoy":
        return ejecutarMovimientosHoy(
          repositorio,
          ahora,
        );

      case "consultar_historial_cilindro":
        return ejecutarHistorialCilindro(
          repositorio,
          parametros,
        );

      default:
        throw new Error(
          "La intención solicitada no tiene una consulta configurada.",
        );
    }
  };