import {
  extraerParametros,
} from "../chatbot/entityExtractor.js";

import {
  clasificarIntencion,
} from "../chatbot/intentClassifier.js";

import {
  normalizarMensaje,
} from "../chatbot/textNormalizer.js";

const EJEMPLOS_AYUDA = [
  "¿Cuántos cilindros están disponibles?",
  "Busca el cilindro CIL-001",
  "¿Cuántos clientes activos existen?",
  "Muéstrame los últimos movimientos",
  "Historial del cilindro CIL-001",
  "Muéstrame los clientes activos",
];

const RESPUESTAS_FIJAS = {
  saludo: {
    respuesta:
      "Hola. Soy el asistente de SIGC-GAS. Puedo ayudarte a consultar cilindros, clientes, movimientos e historiales.",
    datos: null,
  },

  ayuda: {
    respuesta:
      "Puedes preguntarme cuántos cilindros están disponibles, buscar un cilindro por código, consultar clientes activos, revisar movimientos recientes o ver el historial de un cilindro.",
    datos: {
      ejemplos: EJEMPLOS_AYUDA,
    },
  },

  solicitud_modificacion_restringida: {
    respuesta:
      "La primera versión del chatbot solo permite consultas. Para modificar información, utiliza el módulo correspondiente de SIGC-GAS.",
    datos: null,
  },

  consulta_no_reconocida: {
    respuesta:
      "No pude comprender la consulta. Puedes preguntarme por cilindros disponibles, clientes activos, movimientos recientes o el historial de un cilindro.",
    datos: null,
  },
};

const construirRespuesta = ({
  intencion,
  parametros,
  respuesta,
  datos = null,
}) => ({
  intencion,
  parametros,
  respuesta,
  datos,
});

const obtenerAclaracion = (
  intencion,
  parametros,
) => {
  const requiereCodigo =
    (
      intencion
        === "buscar_cilindro_codigo"
      || intencion
        === "consultar_historial_cilindro"
    )
    && !parametros.codigo;

  if (requiereCodigo) {
    return construirRespuesta({
      intencion,
      parametros,
      respuesta:
        "Indica el código del cilindro que deseas consultar, por ejemplo CIL-001.",
    });
  }

  const requiereEstadoCilindro =
    (
      intencion
        === "contar_cilindros_estado"
      || intencion
        === "listar_cilindros_estado"
    )
    && !parametros.estado;

  if (requiereEstadoCilindro) {
    return construirRespuesta({
      intencion,
      parametros,
      respuesta:
        "Indica si deseas consultar cilindros disponibles, prestados o en mantenimiento.",
    });
  }

  const requiereEstadoCliente =
  (
    intencion
      === "contar_clientes_estado"
      || intencion
      === "listar_clientes_estado"
    )
    && !parametros.estado;

  if (requiereEstadoCliente) {
    return construirRespuesta({
      intencion,
      parametros,
      respuesta:
        "Indica si deseas consultar clientes activos, inactivos o todos los registrados.",
    });
  }

  const requiereDatosCliente =
    intencion === "buscar_cliente"
    && !parametros.dni;

  if (requiereDatosCliente) {
    return construirRespuesta({
      intencion,
      parametros,
      respuesta:
        "Indica el DNI del cliente que deseas consultar.",
    });
  }

  return null;
};

export const procesarMensajeChatbot = async (
  mensaje,
  dependencias = {},
) => {
  const mensajeNormalizado =
    normalizarMensaje(mensaje);

  const intencion =
    clasificarIntencion(
      mensajeNormalizado,
    );

  const parametros =
    extraerParametros(
      intencion,
      mensajeNormalizado,
    );

  const respuestaFija =
    RESPUESTAS_FIJAS[intencion];

  if (respuestaFija) {
    return construirRespuesta({
      intencion,
      parametros,
      ...respuestaFija,
    });
  }

  const aclaracion =
    obtenerAclaracion(
      intencion,
      parametros,
    );

  if (aclaracion) {
    return aclaracion;
  }

  const {
    ejecutarConsulta,
  } = dependencias;

  if (
    typeof ejecutarConsulta
      !== "function"
  ) {
    throw new Error(
      "El servicio de consultas del chatbot no está configurado.",
    );
  }

  const resultado =
    await ejecutarConsulta({
      intencion,
      parametros,
    });

  if (
    !resultado
    || typeof resultado.respuesta
      !== "string"
  ) {
    throw new Error(
      "El servicio de consultas devolvió una respuesta inválida.",
    );
  }

  return construirRespuesta({
    intencion,
    parametros,
    respuesta: resultado.respuesta,
    datos: resultado.datos ?? null,
  });
};