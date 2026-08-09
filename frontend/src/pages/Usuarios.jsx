import {
  useEffect,
  useState,
} from "react";

import ModalRestablecerPassword
from "../components/ModalRestablecerPassword";

import ModalConfirmarDesbloqueo
from "../components/ModalConfirmarDesbloqueo";

import {
  desbloquearUsuario,
  obtenerUsuarios,
  restablecerPassword,
} from "../services/usuarioService";

function Usuarios() {
  const [
    usuarios,
    setUsuarios,
  ] = useState([]);

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    usuarioPassword,
    setUsuarioPassword,
  ] = useState(null);
  const [
  usuarioDesbloqueo,
  setUsuarioDesbloqueo,
  ] = useState(null);

  const [
    mensaje,
    setMensaje,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const cargarUsuarios =
    async () => {
      try {
        const data =
          await obtenerUsuarios();

        setUsuarios(data);
        setError("");
      } catch (errorCarga) {
        console.error(
          "Error al cargar usuarios:",
          errorCarga,
        );

        setError(
          "No se pudieron cargar "
            + "los usuarios.",
        );
      }
    };

  useEffect(() => {
  let componenteActivo = true;

  obtenerUsuarios()
    .then((data) => {
      if (!componenteActivo) {
        return;
      }

      setUsuarios(data);
      setError("");
    })
    .catch((errorCarga) => {
      console.error(
        "Error al cargar usuarios:",
        errorCarga,
      );

      if (!componenteActivo) {
        return;
      }

      setError(
        "No se pudieron cargar "
          + "los usuarios.",
      );
    });

  return () => {
    componenteActivo = false;
  };
}, []);

  const manejarDesbloqueo =
  async () => {
    if (!usuarioDesbloqueo) {
      return;
    }

    try {
      await desbloquearUsuario(
        usuarioDesbloqueo.id,
      );

      setMensaje(
        "Cuenta desbloqueada "
          + "correctamente.",
      );

      setError("");

      await cargarUsuarios();
    } catch (errorDesbloqueo) {
      setError(
        errorDesbloqueo
          .response?.data?.mensaje
          ?? "No se pudo "
          + "desbloquear la cuenta.",
      );

      throw errorDesbloqueo;
    }
  };
  const manejarRestablecimiento =
    async (nuevaPassword) => {
      await restablecerPassword(
        usuarioPassword.id,
        nuevaPassword,
      );

      setMensaje(
        "Contraseña restablecida "
          + "correctamente.",
      );

      setError("");

      await cargarUsuarios();
    };

  const textoBusqueda =
    busqueda
      .trim()
      .toLowerCase();

  const usuariosFiltrados =
    usuarios.filter(
      (usuario) =>
        usuario.nombre
          .toLowerCase()
          .includes(textoBusqueda)
        || usuario.correo
          .toLowerCase()
          .includes(textoBusqueda)
        || usuario.rol
          .toLowerCase()
          .includes(textoBusqueda),
    );

  return (
    <div>
      <h1>
        Gestión de Usuarios
      </h1>

      <div className="search-container">
        <input
          type="text"
          placeholder={
            "Buscar por nombre, "
            + "correo o rol..."
          }
          value={busqueda}
          onChange={(event) =>
            setBusqueda(
              event.target.value,
            )
          }
        />
      </div>

      {mensaje && (
        <p className="success-message">
          {mensaje}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acceso</th>
              <th>
                Intentos fallidos
              </th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map(
              (usuario) => (
                <tr key={usuario.id}>
                  <td>
                    {usuario.nombre}
                  </td>

                  <td>
                    {usuario.correo}
                  </td>

                  <td>
                    {usuario.rol}
                  </td>

                  <td>
                    {usuario.estado
                      ? "Activo"
                      : "Inactivo"}
                  </td>

                  <td>
                    <span
                      className={
                        usuario.estadoAcceso
                          === "Bloqueado"
                          ? "status-bloqueado"
                          : "status-activo"
                      }
                    >
                      {
                        usuario
                          .estadoAcceso
                      }
                    </span>
                  </td>

                  <td>
                    {
                      usuario
                        .intentosFallidos
                    }
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={
                          usuario.estadoAcceso
                          !== "Bloqueado"
                        }
                        onClick={() =>
  setUsuarioDesbloqueo(
    usuario,
  )
}
                      >
                        Desbloquear
                      </button>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                          setUsuarioPassword(
                            usuario,
                          )
                        }
                      >
                        Restablecer
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>

        {usuariosFiltrados.length
          === 0 && (
          <p>
            No se encontraron
            usuarios.
          </p>
        )}
      </div>

      {usuarioPassword && (
        <ModalRestablecerPassword
          usuario={usuarioPassword}
          onClose={() =>
            setUsuarioPassword(
              null,
            )
          }
          onGuardar={
            manejarRestablecimiento
          }
        />
      )}
      {usuarioDesbloqueo && (
  <ModalConfirmarDesbloqueo
    usuario={
      usuarioDesbloqueo
    }
    onClose={() =>
      setUsuarioDesbloqueo(
        null,
      )
    }
    onConfirmar={
      manejarDesbloqueo
    }
  />
)}
    </div>
  );
}

export default Usuarios;