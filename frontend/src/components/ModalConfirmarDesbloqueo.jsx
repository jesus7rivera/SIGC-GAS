import {
  useState,
} from "react";

function ModalConfirmarDesbloqueo({
  usuario,
  onClose,
  onConfirmar,
}) {
  const [
    procesando,
    setProcesando,
  ] = useState(false);

  const manejarConfirmacion =
    async () => {
      try {
        setProcesando(true);

        await onConfirmar();

        onClose();
      } finally {
        setProcesando(false);
      }
    };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          Confirmar desbloqueo
        </h2>

        <p>
  ¿Desea desbloquear la cuenta de{" "}
  <strong>
    {usuario.nombre}
  </strong>
  {"?"}
</p>

        <div className="form-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={procesando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={
              manejarConfirmacion
            }
            disabled={procesando}
          >
            {procesando
              ? "Desbloqueando..."
              : "Desbloquear"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmarDesbloqueo;