import {
  useState,
} from "react";

function ModalRestablecerPassword({
  usuario,
  onClose,
  onGuardar,
}) {
  const [
    nuevaPassword,
    setNuevaPassword,
  ] = useState("");

  const [
    confirmarPassword,
    setConfirmarPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const manejarGuardar = async (
    event,
  ) => {
    event.preventDefault();

    if (
      !nuevaPassword
      || !confirmarPassword
    ) {
      setError(
        "Complete ambos campos.",
      );

      return;
    }

    if (
      nuevaPassword.length < 8
      || nuevaPassword.length > 72
    ) {
      setError(
        "La contraseña debe tener "
          + "entre 8 y 72 caracteres.",
      );

      return;
    }

    if (
      nuevaPassword
      !== confirmarPassword
    ) {
      setError(
        "Las contraseñas no coinciden.",
      );

      return;
    }

    try {
      setGuardando(true);
      setError("");

      await onGuardar(
        nuevaPassword,
      );

      onClose();
    } catch (errorGuardar) {
      setError(
        errorGuardar.response?.data
          ?.mensaje
          ?? "No se pudo restablecer "
          + "la contraseña.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          Restablecer contraseña
        </h2>

        <p>
          Usuario:{" "}
          <strong>
            {usuario.nombre}
          </strong>
        </p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          onSubmit={
            manejarGuardar
          }
        >
          <div className="form-group">
            <label htmlFor="usuario-nueva-password">
              Nueva contraseña
            </label>

            <input
              id="usuario-nueva-password"
              type="password"
              value={nuevaPassword}
              onChange={(event) =>
                setNuevaPassword(
                  event.target.value,
                )
              }
              minLength="8"
              maxLength="72"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="usuario-confirmar-password">
              Confirmar contraseña
            </label>

            <input
              id="usuario-confirmar-password"
              type="password"
              value={
                confirmarPassword
              }
              onChange={(event) =>
                setConfirmarPassword(
                  event.target.value,
                )
              }
              minLength="8"
              maxLength="72"
              autoComplete="new-password"
            />
          </div>

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
                : "Restablecer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalRestablecerPassword;