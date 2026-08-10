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

const PATRONES_MODIFICACION = [
  /\b(crea|crear|registra|registrar)\b/,
  /\b(elimina|eliminar|borra|borrar)\b/,
  /\b(edita|editar|actualiza|actualizar)\b/,
  /\b(cambia|cambiar|desactiva|desactivar)\b/,
  /\b(finaliza|finalizar|termina|terminar)\b.*\bmantenimiento\b/,
];

const PATRONES_TIEMPO_PROLONGADO = [
  /\bmas\s+de\s+\d{1,3}\s+dias?\b/,
  /\b\d{1,3}\s+dias?\b/,
  /\bdemasiado\s+tiempo\b/,
  /\bmucho\s+tiempo\b/,
];

const PATRONES_RESPONSABLE_PRESTAMO = [
  /\bquien\b/,
  /\bquienes\b/,
  /\bque cliente\b/,
  /\bque clientes\b/,
  /\btiene\b/,
  /\btienen\b/,
  /\bresponsable\b/,
];

const TERMINOS_BUSQUEDA_CILINDRO = [
  "busca",
  "buscar",
  "consulta",
  "consultar",
  "informacion",
  "estado del cilindro",
];

const PATRONES_CLIENTE_SIN_ACTIVIDAD = [
  /\bsin\s+actividad\b/,
  /\bsin\s+movimientos?\b/,
];

const PATRONES_LISTADO_CLIENTES = [
  /\bmuestrame\b/,
  /\blista\b/,
  /\blistar\b/,
  /\bensename\b/,
  /\bquiero ver\b/,
  /\bque clientes\b/,
  /\bquienes son\b/,
  /\bdame los clientes\b/,
];

const TERMINOS_BUSQUEDA_CLIENTE = [
  "busca",
  "buscar",
  "consulta",
  "consultar",
  "existe",
  "informacion",
];

const TERMINOS_MOVIMIENTOS = [
  "movimiento",
  "movimientos",
  "operacion",
  "operaciones",
  "actividad",
];

const TERMINOS_MOVIMIENTOS_RECIENTES = [
  "reciente",
  "recientes",
  "ultimo",
  "ultimos",
  "mas reciente",
];

const TERMINOS_ESTADO_CILINDRO = [
  "disponible",
  "disponibles",
  "prestado",
  "prestados",
  "mantenimiento",
];

const PATRONES_LISTADO_CILINDROS = [
  /\bmuestrame\b/,
  /\blista\b/,
  /\blistar\b/,
  /\bensename\b/,
  /\bquiero ver\b/,
  /\bque cilindros\b/,
];

const TERMINOS_CANTIDAD = [
  "cuantos",
  "cuantas",
  "cantidad",
  "total",
];

const PATRONES_RESUMEN_RIESGO = [
  /\bresumen\b.*\briesgos?\b/,
  /\briesgos?\b.*\bnegocio\b/,
  /\bsituaciones?\b.*\brequieren?\s+revision\b/,
  /\bproblemas?\s+importantes?\b/,
];

const PATRONES_RESUMEN = [
  /\bresumen\b/,
  /\bestado general\b/,
  /\bsituacion actual\b/,
  /\bcomo esta el inventario\b/,
  /\bresume\b.*\bsistema\b/,
];

const PATRONES_AYUDA = [
  /^ayuda$/,
  /\bque puedes hacer\b/,
  /\bque puedo preguntarte\b/,
  /\bmuestrame las opciones\b/,
  /\bejemplos de consultas\b/,
];

const PATRONES_SALUDO = [
  /^hola\b/,
  /^buenos dias\b/,
  /^buenas tardes\b/,
  /^buenas noches\b/,
  /^estas disponible$/,
];

const esSolicitudModificacion = (
  mensaje,
) =>
  coincideConAlguna(
    mensaje,
    PATRONES_MODIFICACION,
  );

const esHistorialCilindro = (
  mensaje,
) =>
  mensaje.includes("historial")
  && mensaje.includes("cilindro");

const esConsultaPrestamosAntiguos = (
  mensaje,
) => {
  const hablaDePrestamos =
    /\bprestamos?\b/.test(mensaje)
    || (
      /\bcilindros?\b/.test(mensaje)
      && /\bprestados?\b/.test(mensaje)
    );

  return (
    hablaDePrestamos
    && coincideConAlguna(
      mensaje,
      PATRONES_TIEMPO_PROLONGADO,
    )
  );
};

const esConsultaPrestamosActivos = (
  mensaje,
) =>
  /\bprestamos?\s+activos?\b/.test(
    mensaje,
  )
  || (
    /\bcilindros?\b/.test(mensaje)
    && /\bprestados?\b/.test(mensaje)
    && coincideConAlguna(
      mensaje,
      PATRONES_RESPONSABLE_PRESTAMO,
    )
  );

const esBusquedaCilindro = (
  mensaje,
) => {
  const contieneCodigo =
    /\bcil-[a-z0-9-]+\b/.test(
      mensaje,
    );

  return (
    /\bcilindro\b/.test(mensaje)
    && (
      contieneCodigo
      || contieneAlguno(
        mensaje,
        TERMINOS_BUSQUEDA_CILINDRO,
      )
    )
  );
};

const esConsultaClientesSinActividad = (
  mensaje,
) =>
  /\bclientes?\b/.test(mensaje)
  && coincideConAlguna(
    mensaje,
    PATRONES_CLIENTE_SIN_ACTIVIDAD,
  )
  && coincideConAlguna(
    mensaje,
    PATRONES_TIEMPO_PROLONGADO,
  );

const esListadoClientes = (
  mensaje,
) =>
  /\bclientes?\b/.test(mensaje)
  && coincideConAlguna(
    mensaje,
    PATRONES_LISTADO_CLIENTES,
  );

const esBusquedaCliente = (
  mensaje,
) =>
  mensaje.includes("dni")
  || (
    /\bcliente\b/.test(mensaje)
    && contieneAlguno(
      mensaje,
      TERMINOS_BUSQUEDA_CLIENTE,
    )
  );

const hablaDeMovimientos = (
  mensaje,
) =>
  contieneAlguno(
    mensaje,
    TERMINOS_MOVIMIENTOS,
  );

const esMovimientoHoy = (
  mensaje,
) =>
  hablaDeMovimientos(mensaje)
  && mensaje.includes("hoy");

const esMovimientoReciente = (
  mensaje,
) =>
  hablaDeMovimientos(mensaje)
  && contieneAlguno(
    mensaje,
    TERMINOS_MOVIMIENTOS_RECIENTES,
  );

const contieneEstadoCilindro = (
  mensaje,
) =>
  contieneAlguno(
    mensaje,
    TERMINOS_ESTADO_CILINDRO,
  );

const esListadoCilindros = (
  mensaje,
) =>
  mensaje.includes("cilindros")
  && contieneEstadoCilindro(mensaje)
  && coincideConAlguna(
    mensaje,
    PATRONES_LISTADO_CILINDROS,
  );

const contieneExpresionCantidad = (
  mensaje,
) =>
  contieneAlguno(
    mensaje,
    TERMINOS_CANTIDAD,
  );

const esConteoCilindros = (
  mensaje,
) =>
  mensaje.includes("cilindros")
  && contieneEstadoCilindro(mensaje)
  && contieneExpresionCantidad(
    mensaje,
  );

const esConteoClientes = (
  mensaje,
) =>
  mensaje.includes("clientes")
  && contieneExpresionCantidad(
    mensaje,
  );

const esResumenRiesgo = (
  mensaje,
) =>
  coincideConAlguna(
    mensaje,
    PATRONES_RESUMEN_RIESGO,
  );

const esResumen = (
  mensaje,
) =>
  coincideConAlguna(
    mensaje,
    PATRONES_RESUMEN,
  );

const esAyuda = (
  mensaje,
) =>
  coincideConAlguna(
    mensaje,
    PATRONES_AYUDA,
  );

const esSaludo = (
  mensaje,
) =>
  coincideConAlguna(
    mensaje,
    PATRONES_SALUDO,
  );

const REGLAS_INTENCION = [
  {
    coincide: esSolicitudModificacion,
    intencion:
      "solicitud_modificacion_restringida",
  },
  {
    coincide: esHistorialCilindro,
    intencion:
      "consultar_historial_cilindro",
  },
  {
    coincide: esConsultaPrestamosAntiguos,
    intencion:
      "consultar_prestamos_antiguos",
  },
  {
    coincide: esConsultaPrestamosActivos,
    intencion:
      "consultar_prestamos_activos",
  },
  {
    coincide: esBusquedaCilindro,
    intencion:
      "buscar_cilindro_codigo",
  },
  {
    coincide:
      esConsultaClientesSinActividad,
    intencion:
      "consultar_clientes_sin_actividad",
  },
  {
    coincide: esListadoClientes,
    intencion:
      "listar_clientes_estado",
  },
  {
    coincide: esBusquedaCliente,
    intencion:
      "buscar_cliente",
  },
  {
    coincide: esMovimientoHoy,
    intencion:
      "consultar_movimientos_hoy",
  },
  {
    coincide: esMovimientoReciente,
    intencion:
      "consultar_movimientos_recientes",
  },
  {
    coincide: esListadoCilindros,
    intencion:
      "listar_cilindros_estado",
  },
  {
    coincide: esConteoCilindros,
    intencion:
      "contar_cilindros_estado",
  },
  {
    coincide: esConteoClientes,
    intencion:
      "contar_clientes_estado",
  },
  {
    coincide: esResumenRiesgo,
    intencion:
      "consultar_resumen_riesgo",
  },
  {
    coincide: esResumen,
    intencion:
      "consultar_resumen",
  },
  {
    coincide: esAyuda,
    intencion:
      "ayuda",
  },
  {
    coincide: esSaludo,
    intencion:
      "saludo",
  },
];

export const clasificarIntencion = (
  mensajeNormalizado,
) => {
  if (
    typeof mensajeNormalizado !== "string"
    || !mensajeNormalizado.trim()
  ) {
    return "consulta_no_reconocida";
  }

  const mensaje =
    mensajeNormalizado.trim();

  const reglaEncontrada =
    REGLAS_INTENCION.find(
      (regla) =>
        regla.coincide(mensaje),
    );

  return (
    reglaEncontrada?.intencion
    ?? "consulta_no_reconocida"
  );
};