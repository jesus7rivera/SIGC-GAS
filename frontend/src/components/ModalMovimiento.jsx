import { useEffect, useState } from "react";

import {
  obtenerClientes,
} from "../services/clienteService";

import {
  obtenerCilindros,
} from "../services/cilindroService";

const tiposPorEstado = {
  Disponible: [
    "Salida",
    "Mantenimiento",
  ],

  Prestado: [
    "Devolución",
    "Mantenimiento",
  ],

  Mantenimiento: [
    "Fin de mantenimiento",
  ],
};

function ModalMovimiento({
  onClose,
  onGuardar,
}) {
  const [clientes, setClientes] = useState([]);
  const [cilindros, setCilindros] =
    useState([]);

  const [cliente, setCliente] = useState("");
  const [cilindro, setCilindro] =
    useState("");
  const [tipo, setTipo] = useState("");
  const [observacion, setObservacion] =
    useState("");

  const [mensajeError, setMensajeError] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          clientesDB,
          cilindrosDB,
        ] = await Promise.all([
          obtenerClientes(),
          obtenerCilindros(),
        ]);

        setClientes(clientesDB);
        setCilindros(cilindrosDB);
      } catch (error) {
        console.error(
          "Error al cargar datos:",
          error,
        );

        setMensajeError(
          "No se pudieron cargar los clientes y cilindros.",
        );
      }
    };

    cargarDatos();
  }, []);

  const clientesActivos = clientes.filter(
    (item) => item.estado === "Activo",
  );

  const cilindroSeleccionado =
    cilindros.find(
      (item) => item._id === cilindro,
    );

  const tiposDisponibles =
    tiposPorEstado[
      cilindroSeleccionado?.estado
    ] ?? [];

  const manejarCambioCilindro = (evento) => {
    const cilindroId = evento.target.value;

    setCilindro(cilindroId);
    setMensajeError("");

    const cilindroEncontrado =
      cilindros.find(
        (item) => item._id === cilindroId,
      );

    const opcionesPermitidas =
      tiposPorEstado[
        cilindroEncontrado?.estado
      ] ?? [];

    setTipo(opcionesPermitidas[0] ?? "");
  };

  const manejarGuardar = async (evento) => {
    evento.preventDefault();
    setMensajeError("");

    if (!cliente || !cilindro || !tipo) {
      setMensajeError(
        "Seleccione cliente, cilindro y tipo de movimiento.",
      );

      return;
    }

    const nuevoMovimiento = {
      cliente,
      cilindro,
      tipo,
      observacion,
    };

    setGuardando(true);

    try {
      const resultado = await onGuardar(
        nuevoMovimiento,
      );

      if (!resultado?.exito) {
        setMensajeError(
          resultado?.mensaje ??
            "No se pudo registrar el movimiento.",
        );

        return;
      }

      onClose();
    } catch (error) {
      console.error(
        "Error inesperado al guardar:",
        error,
      );

      setMensajeError(
        "Ocurrió un error inesperado al registrar el movimiento.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Registrar Movimiento</h2>

        <form onSubmit={manejarGuardar}>
          <div className="form-group">
            <label htmlFor="movimiento-cliente">
              Cliente
            </label>

            <select
              id="movimiento-cliente"
              value={cliente}
              onChange={(evento) => {
                setCliente(
                  evento.target.value,
                );

                setMensajeError("");
              }}
            >
              <option value="">
                Seleccione un cliente
              </option>

              {clientesActivos.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.nombre} - DNI: {item.dni}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="movimiento-cilindro">
              Cilindro
            </label>

            <select
              id="movimiento-cilindro"
              value={cilindro}
              onChange={
                manejarCambioCilindro
              }
            >
              <option value="">
                Seleccione un cilindro
              </option>

              {cilindros.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.codigo} - {item.tipo} -{" "}
                  {item.estado}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="movimiento-tipo">
              Tipo de Movimiento
            </label>

            <select
              id="movimiento-tipo"
              value={tipo}
              onChange={(evento) => {
                setTipo(evento.target.value);
                setMensajeError("");
              }}
              disabled={!cilindro}
            >
              <option value="">
                Seleccione un tipo
              </option>

              {tiposDisponibles.map(
                (tipoDisponible) => (
                  <option
                    key={tipoDisponible}
                    value={tipoDisponible}
                  >
                    {tipoDisponible}
                  </option>
                ),
              )}
            </select>
          </div>

          {cilindroSeleccionado && (
            <p>
              Estado actual del cilindro:{" "}
              <strong>
                {cilindroSeleccionado.estado}
              </strong>
            </p>
          )}

          <div className="form-group">
            <label htmlFor="movimiento-observacion">
              Observación
            </label>

            <input
              id="movimiento-observacion"
              type="text"
              maxLength={250}
              placeholder="Ejemplo: Entrega a cliente"
              value={observacion}
              onChange={(evento) => {
                setObservacion(
                  evento.target.value,
                );

                setMensajeError("");
              }}
            />
          </div>

          {mensajeError && (
            <p role="alert">
              {mensajeError}
            </p>
          )}

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalMovimiento;