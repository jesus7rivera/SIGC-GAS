import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaPaperPlane,
  FaRobot,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import {
  enviarMensajeChatbot,
} from "../services/chatbotService";

import {
  obtenerContextoChatbot,
  resolverConsultaContextual,
} from "../chatbot/chatbotContext";

const LIMITE_MENSAJE = 300;

const SUGERENCIAS = [
  "¿Quién tiene los cilindros prestados?",
  "Muéstrame los préstamos de más de 30 días",
  "¿Qué clientes llevan más de 30 días sin actividad?",
  "Dame un resumen de riesgos",
  "Muéstrame los últimos 5 movimientos",
  "Dame un resumen del sistema",
];

const crearMensaje = (
  autor,
  contenido,
  adicionales = {},
) => ({
  id:
    `${Date.now()}-`
    + `${Math.random().toString(16).slice(2)}`,
  autor,
  contenido,
  hora: new Date().toLocaleTimeString(
    "es-PE",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ),
  ...adicionales,
});

const crearBienvenida = () =>
  crearMensaje(
    "asistente",
    "Hola. Soy el asistente de SIGC-GAS. "
      + "Puedo consultar cilindros, clientes, "
      + "movimientos e historiales.",
    {
      intencion: "saludo",
      datos: null,
    },
  );

const obtenerMensajeError = (
  error,
) => {
  if (
    error.response?.status === 401
  ) {
    return (
      "Tu sesión no es válida o ha expirado. "
      + "Inicia sesión nuevamente."
    );
  }

  const errores =
    error.response?.data?.errores;

  if (
    Array.isArray(errores)
    && errores.length > 0
  ) {
    return errores.join(" ");
  }

  return (
    error.response?.data?.mensaje
    ?? "No se pudo conectar con el asistente."
  );
};

const formatearFechaChatbot = (
  valor,
) => {
  if (!valor) {
    return "No disponible";
  }

  const fecha =
    new Date(valor);

  if (
    Number.isNaN(
      fecha.getTime(),
    )
  ) {
    return valor;
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(fecha);
};

const esRespuestaPrestamos = (
  mensaje,
) => (
  mensaje.autor === "asistente"
  && (
    mensaje.intencion
      === "consultar_prestamos_activos"
    || mensaje.intencion
      === "consultar_prestamos_antiguos"
  )
  && Array.isArray(
    mensaje.datos,
  )
);

const renderizarPrestamos = (
  mensaje,
) => {
  const prestamos =
    mensaje.datos;
    const esSeguimiento =
  mensaje.intencion
    === "consultar_prestamos_antiguos";

  return (
    <>
      <p className="chatbot-result-title">
  {esSeguimiento
    ? (
      prestamos.length === 1
        ? "1 préstamo para seguimiento"
        : `${prestamos.length} préstamos para seguimiento`
    )
    : (
      prestamos.length === 1
        ? "1 préstamo activo"
        : `${prestamos.length} préstamos activos`
    )}
</p>

      <div className="chatbot-loan-list">
        {prestamos.map(
          (prestamo) => (
            <div
              key={prestamo.codigo}
              className={
                "chatbot-loan-card "
                + `${
                  prestamo
                    .requiereRevision
                    ? "chatbot-loan-card-warning"
                    : ""
                }`
              }
            >
              <div className="chatbot-loan-header">
                <strong>
                  {prestamo.codigo}
                </strong>

                <span
                  className={
                    "chatbot-loan-status "
                    + `${
                      prestamo
                        .requiereRevision
                        ? "chatbot-loan-status-warning"
                        : ""
                    }`
                  }
                >
                  {prestamo.requiereRevision
  ? "Revisar"
  : esSeguimiento
    ? "Seguimiento"
    : "Prestado"}
                </span>
              </div>

              {prestamo
                .requiereRevision && (
                <p className="chatbot-loan-warning">
                  {
                    prestamo
                      .motivoRevision
                  }
                </p>
              )}

              <div className="chatbot-loan-details">
                <div>
                  <span>Cliente</span>
                  <strong>
                    {prestamo.cliente
                      ?? "No disponible"}
                  </strong>
                </div>

                <div>
                  <span>Salida</span>
                  <strong>
                    {formatearFechaChatbot(
                      prestamo
                        .fechaSalida,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Tiempo prestado
                  </span>
                  <strong>
                    {Number.isInteger(
                      prestamo
                        .diasPrestado,
                    )
                      ? `${
                        prestamo
                          .diasPrestado
                      } ${
                        prestamo
                          .diasPrestado
                          === 1
                          ? "día"
                          : "días"
                      }`
                      : "No disponible"}
                  </strong>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
};
const esRespuestaClientesSinActividad = (
  mensaje,
) => (
  mensaje.autor === "asistente"
  && mensaje.intencion
    === "consultar_clientes_sin_actividad"
  && Array.isArray(
    mensaje.datos,
  )
);
const esRespuestaResumenRiesgo = (
  mensaje,
) => (
  mensaje.autor === "asistente"
  && mensaje.intencion
    === "consultar_resumen_riesgo"
  && mensaje.datos
  && typeof mensaje.datos === "object"
  && Array.isArray(
    mensaje.datos.prestamosProlongados,
  )
  && Array.isArray(
    mensaje.datos.clientesSinActividad,
  )
);

const renderizarClientesSinActividad = (
  mensaje,
) => {
  const clientes =
    mensaje.datos;

  return (
    <>
      <p className="chatbot-result-title">
        {clientes.length === 1
          ? "1 cliente para seguimiento"
          : `${clientes.length} clientes para seguimiento`}
      </p>

      <div className="chatbot-client-list">
        {clientes.map(
          (cliente) => (
            <div
              key={
                `${cliente.nombre}-`
                + `${cliente.fechaRegistro ?? ""}`
              }
              className="chatbot-client-card"
            >
              <div className="chatbot-client-header">
                <strong>
                  {cliente.nombre}
                </strong>

                <span className="chatbot-client-status">
                  {cliente.sinMovimientos
                    ? "Sin movimientos"
                    : "Sin actividad"}
                </span>
              </div>

              <div className="chatbot-client-days">
                <strong>
                  {cliente.diasSinActividad}
                </strong>

                <span>
                  {cliente.diasSinActividad === 1
                    ? "día sin actividad"
                    : "días sin actividad"}
                </span>
              </div>

              <div className="chatbot-client-details">
                {cliente.sinMovimientos
                  ? (
                    <div>
                      <span>
                        Registrado
                      </span>

                      <strong>
                        {formatearFechaChatbot(
                          cliente.fechaRegistro,
                        )}
                      </strong>
                    </div>
                  )
                  : (
                    <div>
                      <span>
                        Última actividad
                      </span>

                      <strong>
                        {formatearFechaChatbot(
                          cliente.ultimaActividad,
                        )}
                      </strong>
                    </div>
                  )}
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
};
const renderizarResumenRiesgo = (
  mensaje,
) => {
  const {
    diasMinimos,
    prestamosProlongados,
    clientesSinActividad,
    totalSituaciones,
  } = mensaje.datos;

  return (
    <>
      <p className="chatbot-result-title">
        Resumen de seguimiento
      </p>

      <div className="chatbot-risk-summary">
        <div className="chatbot-risk-card">
          <span>
            Préstamos prolongados
          </span>

          <strong>
            {prestamosProlongados.length}
          </strong>

          <small>
            Más de {diasMinimos} días
          </small>
        </div>

        <div className="chatbot-risk-card">
          <span>
            Clientes sin actividad
          </span>

          <strong>
            {clientesSinActividad.length}
          </strong>

          <small>
            Más de {diasMinimos} días
          </small>
        </div>
      </div>

      <div
        className={
          totalSituaciones > 0
            ? "chatbot-risk-total chatbot-risk-total-warning"
            : "chatbot-risk-total"
        }
      >
        <strong>
          {totalSituaciones}
        </strong>

        <span>
          {totalSituaciones === 1
            ? "situación requiere revisión operativa"
            : "situaciones requieren revisión operativa"}
        </span>
      </div>
    </>
  );
};

function Chatbot({
  compacto = false,
  onCerrar = null,
}) {
  const [mensajes, setMensajes] =
    useState(() => [
      crearBienvenida(),
    ]);

  const [entrada, setEntrada] =
    useState("");

  const [cargando, setCargando] =
    useState(false);

  const finConversacionRef =
    useRef(null);

  const solicitudEnCursoRef =
    useRef(false);
  
  const contextoConversacionRef =
    useRef(null);

  useEffect(() => {
    finConversacionRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, [
    mensajes,
    cargando,
  ]);

  const enviarConsulta = async (
    textoConsulta,
  ) => {
    const texto =
      textoConsulta.trim();

    const consultaBackend =
      resolverConsultaContextual(
        texto,
        contextoConversacionRef
          .current,
      );

    if (
      !texto
      || solicitudEnCursoRef.current
    ) {
      return;
    }

    solicitudEnCursoRef.current =
      true;

    setMensajes(
      (mensajesAnteriores) => [
        ...mensajesAnteriores,
        crearMensaje(
          "usuario",
          texto,
        ),
      ],
    );

    setEntrada("");
    setCargando(true);

    try {
      const resultado =
        await enviarMensajeChatbot(
          consultaBackend,
        );

        contextoConversacionRef
        .current =
          obtenerContextoChatbot(
            resultado,
          );

      setMensajes(
        (mensajesAnteriores) => [
          ...mensajesAnteriores,
          crearMensaje(
            "asistente",
            resultado.respuesta,
            {
              intencion:
                resultado.intencion,
              datos:
                resultado.datos,
            },
          ),
        ],
      );
    } catch (error) {
      setMensajes(
        (mensajesAnteriores) => [
          ...mensajesAnteriores,
          crearMensaje(
            "asistente",
            obtenerMensajeError(
              error,
            ),
            {
              esError: true,
              datos: null,
            },
          ),
        ],
      );
    } finally {
      solicitudEnCursoRef.current =
        false;

      setCargando(false);
    }
  };

  const manejarEnvio = (
    event,
  ) => {
    event.preventDefault();

    enviarConsulta(entrada);
  };

  const manejarTecla = (
    event,
  ) => {
    if (
      event.key === "Enter"
      && !event.shiftKey
    ) {
      event.preventDefault();

      enviarConsulta(entrada);
    }
  };

  const limpiarConversacion = () => {
    if (cargando) {
      return;
    }

    contextoConversacionRef
      .current = null;

    setMensajes([
      crearBienvenida(),
    ]);

    setEntrada("");
  };

  return (
    <section
  className={
    `chatbot-page ${
      compacto
        ? "chatbot-page-compact"
        : ""
    }`
  }
>
      <header className="chatbot-header">
        <div className="chatbot-header-info">
          <div className="chatbot-header-icon">
            <FaRobot />
          </div>

          <div>
            <h1>
              Asistente SIGC-GAS
            </h1>

            <p>
              Consultas seguras y de
              solo lectura
            </p>
          </div>
        </div>

        <div className="chatbot-header-actions">
  <button
    type="button"
    className="chatbot-clear-button"
    onClick={
      limpiarConversacion
    }
    disabled={cargando}
    aria-label={
      "Limpiar conversación"
    }
    title={
      "Limpiar conversación"
    }
  >
    <FaTrash />

    <span>
      Limpiar conversación
    </span>
  </button>

  {typeof onCerrar
    === "function" && (
    <button
      type="button"
      className="chatbot-close-button"
      onClick={onCerrar}
      aria-label={
        "Cerrar asistente"
      }
      title={
        "Cerrar asistente"
      }
    >
      <FaTimes />
    </button>
  )}
</div>
      </header>

      <div
        className="chatbot-suggestions"
        aria-label={
          "Preguntas sugeridas"
        }
      >
        {SUGERENCIAS.map(
          (sugerencia) => (
            <button
              type="button"
              key={sugerencia}
              onClick={() =>
                enviarConsulta(
                  sugerencia,
                )
              }
              disabled={cargando}
            >
              {sugerencia}
            </button>
          ),
        )}
      </div>

      <div
        className="chatbot-conversation"
        role="log"
        aria-live="polite"
        aria-label={
          "Conversación con el asistente"
        }
      >
        {mensajes.map(
          (mensaje) => (
            <article
              key={mensaje.id}
              className={
                `chatbot-message `
                + `chatbot-message-${mensaje.autor}`
              }
            >
              <div className="chatbot-message-avatar">
                {mensaje.autor
                  === "usuario"
                  ? <FaUser />
                  : <FaRobot />}
              </div>

              <div
                className={
                  `chatbot-message-bubble `
                  + `${
                    mensaje.esError
                      ? "chatbot-message-error"
                      : ""
                  }`
                }
              >
                {esRespuestaPrestamos(
  mensaje,
) && renderizarPrestamos(
  mensaje,
)}

{esRespuestaClientesSinActividad(
  mensaje,
) && renderizarClientesSinActividad(
  mensaje,
)}

{esRespuestaResumenRiesgo(
  mensaje,
) && renderizarResumenRiesgo(
  mensaje,
)}

{!esRespuestaPrestamos(
  mensaje,
)
  && !esRespuestaClientesSinActividad(
    mensaje,
  )
  && !esRespuestaResumenRiesgo(
    mensaje,
  ) && (
  <p>
    {mensaje.contenido}
  </p>
)}

                {mensaje.datos
                  !== null
                  && mensaje.datos
                    !== undefined && (
                    <details className="chatbot-data">
                      <summary>
                        Ver datos consultados
                      </summary>

                      <pre>
                        {JSON.stringify(
                          mensaje.datos,
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  )}

                <div className="chatbot-message-meta">
                  <span>
                    {mensaje.autor
                      === "usuario"
                      ? "Tú"
                      : "Asistente"}
                  </span>

                  <span>
                    {mensaje.hora}
                  </span>
                </div>
              </div>
            </article>
          ),
        )}

        {cargando && (
          <article
            className={
              "chatbot-message "
              + "chatbot-message-asistente"
            }
          >
            <div className="chatbot-message-avatar">
              <FaRobot />
            </div>

            <div
              className={
                "chatbot-message-bubble "
                + "chatbot-typing"
              }
              aria-label={
                "El asistente está escribiendo"
              }
            >
              <span />
              <span />
              <span />
            </div>
          </article>
        )}

        <div
          ref={finConversacionRef}
        />
      </div>

      <form
        className="chatbot-composer"
        onSubmit={manejarEnvio}
      >
        <label
          htmlFor="mensaje-chatbot"
        >
          Escribe una consulta
        </label>

        <textarea
          id="mensaje-chatbot"
          value={entrada}
          onChange={(event) =>
            setEntrada(
              event.target.value,
            )
          }
          onKeyDown={manejarTecla}
          maxLength={LIMITE_MENSAJE}
          placeholder={
            "Ejemplo: ¿Cuántos cilindros "
            + "están disponibles?"
          }
          disabled={cargando}
          rows="3"
        />

        <div className="chatbot-composer-footer">
          <span
            className={
              entrada.length
                >= LIMITE_MENSAJE
                ? "chatbot-counter-limit"
                : ""
            }
          >
            {entrada.length}
            /
            {LIMITE_MENSAJE}
          </span>

          <button
            type="submit"
            className="chatbot-send-button"
            disabled={
              cargando
              || !entrada.trim()
            }
          >
            <FaPaperPlane />

            <span>
              {cargando
                ? "Consultando..."
                : "Enviar"}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default Chatbot;