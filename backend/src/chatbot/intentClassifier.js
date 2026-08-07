const coincideConAlguna = (
  mensaje,
  patrones,
) =>
  patrones.some(
    (patron) => patron.test(mensaje),
  );

const contieneAlguno = (
  mensaje,
  terminos,
) =>
  terminos.some(
    (termino) => mensaje.includes(termino),
  );

export const clasificarIntencion = (
  mensajeNormalizado,
) => {
  if (
    typeof mensajeNormalizado !== "string"
    || !mensajeNormalizado.trim()
  ) {
    return "consulta_no_reconocida";
  }

  const mensaje = mensajeNormalizado.trim();

  const esSolicitudModificacion =
    coincideConAlguna(
      mensaje,
      [
        /\b(crea|crear|registra|registrar)\b/,
        /\b(elimina|eliminar|borra|borrar)\b/,
        /\b(edita|editar|actualiza|actualizar)\b/,
        /\b(cambia|cambiar|desactiva|desactivar)\b/,
        /\b(finaliza|finalizar|termina|terminar)\b.*\bmantenimiento\b/,
      ],
    );

  if (esSolicitudModificacion) {
    return "solicitud_modificacion_restringida";
  }

  const esHistorialCilindro =
    mensaje.includes("historial")
    && mensaje.includes("cilindro");

  if (esHistorialCilindro) {
    return "consultar_historial_cilindro";
  }

    const esConsultaPrestamosAntiguos =
  (
    /\bprestamos?\b/.test(
      mensaje,
    )
    || (
      /\bcilindros?\b/.test(
        mensaje,
      )
      && /\bprestados?\b/.test(
        mensaje,
      )
    )
  )
  && coincideConAlguna(
    mensaje,
    [
      /\bmas\s+de\s+\d{1,3}\s+dias?\b/,
      /\b\d{1,3}\s+dias?\b/,
      /\bdemasiado\s+tiempo\b/,
      /\bmucho\s+tiempo\b/,
    ],
  );

if (esConsultaPrestamosAntiguos) {
  return "consultar_prestamos_antiguos";
}

    const esConsultaPrestamosActivos =
    /\bprestamos?\s+activos?\b/.test(
      mensaje,
    )
    || (
      /\bcilindros?\b/.test(
        mensaje,
      )
      && /\bprestados?\b/.test(
        mensaje,
      )
      && coincideConAlguna(
        mensaje,
        [
          /\bquien\b/,
          /\bquienes\b/,
          /\bque cliente\b/,
          /\bque clientes\b/,
          /\btiene\b/,
          /\btienen\b/,
          /\bresponsable\b/,
        ],
      )
    );

  if (esConsultaPrestamosActivos) {
    return "consultar_prestamos_activos";
  }

  const contieneCodigoCilindro =
    /\bcil-[a-z0-9-]+\b/.test(mensaje);

  const esBusquedaCilindro =
    /\bcilindro\b/.test(mensaje)
    && (
      contieneCodigoCilindro
      || contieneAlguno(
        mensaje,
        [
          "busca",
          "buscar",
          "consulta",
          "consultar",
          "informacion",
          "estado del cilindro",
        ],
      )
    );

  if (esBusquedaCilindro) {
    return "buscar_cilindro_codigo";
  }

    const esListadoClientes =
    /\bclientes?\b/.test(mensaje)
    && coincideConAlguna(
      mensaje,
      [
        /\bmuestrame\b/,
        /\blista\b/,
        /\blistar\b/,
        /\bensename\b/,
        /\bquiero ver\b/,
        /\bque clientes\b/,
        /\bquienes son\b/,
        /\bdame los clientes\b/,
      ],
    );

  if (esListadoClientes) {
    return "listar_clientes_estado";
  }

  const esBusquedaCliente =
    mensaje.includes("dni")
    || (
      /\bcliente\b/.test(mensaje)
      && contieneAlguno(
        mensaje,
        [
          "busca",
          "buscar",
          "consulta",
          "consultar",
          "existe",
          "informacion",
        ],
      )
    );

  if (esBusquedaCliente) {
    return "buscar_cliente";
  }

  const hablaDeMovimientos =
    contieneAlguno(
      mensaje,
      [
        "movimiento",
        "movimientos",
        "operacion",
        "operaciones",
        "actividad",
      ],
    );

  const esMovimientoHoy =
    hablaDeMovimientos
    && mensaje.includes("hoy");

  if (esMovimientoHoy) {
    return "consultar_movimientos_hoy";
  }

  const esMovimientoReciente =
    hablaDeMovimientos
    && contieneAlguno(
      mensaje,
      [
        "reciente",
        "recientes",
        "ultimo",
        "ultimos",
        "mas reciente",
      ],
    );

  if (esMovimientoReciente) {
    return "consultar_movimientos_recientes";
  }

  const contieneEstadoCilindro =
    contieneAlguno(
      mensaje,
      [
        "disponible",
        "disponibles",
        "prestado",
        "prestados",
        "mantenimiento",
      ],
    );

  const esListadoCilindros =
    mensaje.includes("cilindros")
    && contieneEstadoCilindro
    && coincideConAlguna(
      mensaje,
      [
        /\bmuestrame\b/,
        /\blista\b/,
        /\blistar\b/,
        /\bensename\b/,
        /\bquiero ver\b/,
        /\bque cilindros\b/,
      ],
    );

  if (esListadoCilindros) {
    return "listar_cilindros_estado";
  }

  const contieneExpresionCantidad =
    contieneAlguno(
      mensaje,
      [
        "cuantos",
        "cuantas",
        "cantidad",
        "total",
      ],
    );

  const esConteoCilindros =
    mensaje.includes("cilindros")
    && contieneEstadoCilindro
    && contieneExpresionCantidad;

  if (esConteoCilindros) {
    return "contar_cilindros_estado";
  }

  const esConteoClientes =
    mensaje.includes("clientes")
    && contieneExpresionCantidad;

  if (esConteoClientes) {
    return "contar_clientes_estado";
  }

  const esResumen =
    coincideConAlguna(
      mensaje,
      [
        /\bresumen\b/,
        /\bestado general\b/,
        /\bsituacion actual\b/,
        /\bcomo esta el inventario\b/,
        /\bresume\b.*\bsistema\b/,
      ],
    );

  if (esResumen) {
    return "consultar_resumen";
  }

  const esAyuda =
    coincideConAlguna(
      mensaje,
      [
        /^ayuda$/,
        /\bque puedes hacer\b/,
        /\bque puedo preguntarte\b/,
        /\bmuestrame las opciones\b/,
        /\bejemplos de consultas\b/,
      ],
    );

  if (esAyuda) {
    return "ayuda";
  }

  const esSaludo =
    coincideConAlguna(
      mensaje,
      [
        /^hola\b/,
        /^buenos dias\b/,
        /^buenas tardes\b/,
        /^buenas noches\b/,
        /^estas disponible$/,
      ],
    );

  if (esSaludo) {
    return "saludo";
  }

  return "consulta_no_reconocida";
};