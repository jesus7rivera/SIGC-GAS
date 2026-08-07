const LIMITE_RESULTADOS = 10;

const MILISEGUNDOS_POR_DIA =
  1000 * 60 * 60 * 24;

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

const formatearClienteListado = (
  cliente,
) => ({
  nombre: cliente.nombre,
  estado: cliente.estado,
});

const describirEstadoCliente = (
  estado,
  cantidad,
) => {
  if (estado === "Todos") {
    return cantidad === 1
      ? "registrado"
      : "registrados";
  }

  if (estado === "Activo") {
    return cantidad === 1
      ? "activo"
      : "activos";
  }

  return cantidad === 1
    ? "inactivo"
    : "inactivos";
};

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

const convertirFechaIso = (
  fecha,
) => {
  if (!fecha) {
    return null;
  }

  const valor =
    new Date(fecha);

  if (
    Number.isNaN(
      valor.getTime(),
    )
  ) {
    return null;
  }

  return valor.toISOString();
};

const formatearFechaPrestamo = (
  fecha,
) => {
  const fechaIso =
    convertirFechaIso(
      fecha,
    );

  if (!fechaIso) {
    return "fecha no disponible";
  }

  const [
    anio,
    mes,
    dia,
  ] = fechaIso
    .slice(
      0,
      10,
    )
    .split("-");

  return `${dia}/${mes}/${anio}`;
};

const calcularDiasPrestado = (
  fechaSalida,
  ahora,
) => {
  if (!fechaSalida) {
    return null;
  }

  const fecha =
    new Date(
      fechaSalida,
    );

  if (
    Number.isNaN(
      fecha.getTime(),
    )
  ) {
    return null;
  }

  const diferencia =
    ahora.getTime()
    - fecha.getTime();

  return Math.max(
    0,
    Math.floor(
      diferencia
      / MILISEGUNDOS_POR_DIA,
    ),
  );
};

const formatearPrestamoActivo = (
  prestamo,
  ahora,
) => {
  const {
    cilindro,
    salida,
  } = prestamo;

  const fechaSalida =
    convertirFechaIso(
      salida?.fecha,
    );

  const diasPrestado =
    calcularDiasPrestado(
      salida?.fecha,
      ahora,
    );

  const cliente =
    salida?.cliente?.nombre
    ?? null;

  let motivoRevision = null;

  if (!salida) {
    motivoRevision =
      "El cilindro figura como prestado, pero no se encontró una salida asociada.";
  } else if (!cliente) {
    motivoRevision =
      "La salida existe, pero el cliente asociado no está disponible en el sistema.";
  }

  const resultado = {
    codigo:
      cilindro.codigo,
    cliente,
    fechaSalida,
    diasPrestado,
    requiereRevision:
      Boolean(
        motivoRevision,
      ),
  };

  if (motivoRevision) {
    resultado.motivoRevision =
      motivoRevision;
  }

  return resultado;
};

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

const ejecutarListadoClientes =
  async (
    repositorio,
    parametros,
  ) => {
    const {
      estado,
    } = parametros;

    const resultados =
      await repositorio
        .listarClientesPorEstado(
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
          "No se encontraron clientes con el estado solicitado.",
        datos: [],
      };
    }

    const cantidad =
      elementos.length;

    const sustantivo =
      cantidad === 1
        ? "cliente"
        : "clientes";

    const descripcion =
      describirEstadoCliente(
        estado,
        cantidad,
      );

    const verbo =
      cantidad === 1
        ? "Se encontró"
        : "Se encontraron";

    const complemento =
      hayMas
        ? " Se muestran los primeros 10 resultados."
        : "";

    return {
      respuesta:
        `${verbo} ${cantidad} ${sustantivo} ${descripcion}.${complemento}`,
      datos:
        elementos.map(
          formatearClienteListado,
        ),
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

const ejecutarPrestamosActivos =
  async (
    repositorio,
    ahora,
  ) => {
    const resultados =
      await repositorio
        .listarPrestamosActivos(
          LIMITE_RESULTADOS + 1,
        );

    const {
      elementos,
      hayMas,
    } = limitarResultados(
      resultados,
    );

    if (
      elementos.length === 0
    ) {
      return {
        respuesta:
          "No hay cilindros prestados actualmente.",
        datos: [],
      };
    }

    const prestamos =
      elementos.map(
        (prestamo) =>
          formatearPrestamoActivo(
            prestamo,
            ahora,
          ),
      );

    const lineas =
      prestamos.map(
        (prestamo) => {
          if (
  prestamo
    .requiereRevision
) {
  const fecha =
    prestamo.fechaSalida
      ? formatearFechaPrestamo(
        prestamo.fechaSalida,
      )
      : "no disponible";

  const tiempo =
    Number.isInteger(
      prestamo.diasPrestado,
    )
      ? (
        prestamo.diasPrestado
          === 1
          ? "1 día en préstamo"
          : `${prestamo.diasPrestado} días en préstamo`
      )
      : "tiempo no disponible";

  return (
    `⚠ ${prestamo.codigo} — `
    + `${prestamo.motivoRevision} `
    + `Salida: ${fecha} — `
    + tiempo
  );
}

          const descripcionDias =
            prestamo.diasPrestado
              === 1
              ? "1 día en préstamo"
              : `${prestamo.diasPrestado} días en préstamo`;

          return (
            `${prestamo.codigo} — `
            + `${prestamo.cliente} — `
            + `salida ${
              formatearFechaPrestamo(
                prestamo.fechaSalida,
              )
            } — `
            + descripcionDias
          );
        },
      );

    const cantidad =
      prestamos.length;

    const encabezado =
      cantidad === 1
        ? "Se encontró 1 cilindro con préstamo activo:"
        : `Se encontraron ${cantidad} cilindros con préstamo activo:`;

    const complemento =
      hayMas
        ? "\nSe muestran los primeros 10 resultados."
        : "";

    return {
      respuesta:
        `${encabezado}\n`
        + lineas.join("\n")
        + complemento,
      datos: prestamos,
    };
  };

  const ejecutarPrestamosAntiguos =
  async (
    repositorio,
    parametros,
    ahora,
  ) => {
    const diasMinimos =
      Number.isInteger(
        parametros.diasMinimos,
      )
      && parametros.diasMinimos > 0
        ? parametros.diasMinimos
        : 30;

    const resultados =
      await repositorio
        .listarPrestamosActivosParaSeguimiento();

    const prestamos =
      resultados
        .map(
          (prestamo) =>
            formatearPrestamoActivo(
              prestamo,
              ahora,
            ),
        )
        .filter(
          (prestamo) =>
            Number.isInteger(
              prestamo.diasPrestado,
            )
            && prestamo.diasPrestado
              > diasMinimos,
        );

    const {
      elementos,
      hayMas,
    } =
      limitarResultados(
        prestamos,
      );

    if (elementos.length === 0) {
      return {
        respuesta:
          `No hay cilindros prestados por más de ${diasMinimos} días.`,
        datos: [],
      };
    }

    const lineas =
      elementos.map(
        (prestamo) => {
          if (
            prestamo
              .requiereRevision
          ) {
            return (
              `⚠ ${prestamo.codigo} — `
              + `${prestamo.motivoRevision} — `
              + `${prestamo.diasPrestado} días en préstamo`
            );
          }

          return (
            `${prestamo.codigo} — `
            + `${prestamo.cliente} — `
            + `${prestamo.diasPrestado} días en préstamo`
          );
        },
      );

    const aviso =
      hayMas
        ? "\nSe muestran únicamente los primeros resultados."
        : "";

    return {
      respuesta:
        `${elementos.length} cilindro`
        + `${
          elementos.length === 1
            ? ""
            : "s"
        } llevan más de `
        + `${diasMinimos} días prestados.\n`
        + lineas.join("\n")
        + aviso,
      datos:
        elementos,
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

      case "consultar_prestamos_activos":
        return ejecutarPrestamosActivos(
          repositorio,
          ahora,
        );
      case "consultar_prestamos_antiguos":
        return ejecutarPrestamosAntiguos(
        repositorio,
        parametros,
        ahora,
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

        case "listar_clientes_estado":
        return ejecutarListadoClientes(
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