import { useState } from "react";

function ModalCliente({ onClose, onGuardar, clienteEditar }) {
  const [dni, setDni] = useState(clienteEditar ? clienteEditar.dni : "");
  const [nombre, setNombre] = useState(clienteEditar ? clienteEditar.nombre : "");
  const [telefono, setTelefono] = useState(clienteEditar ? clienteEditar.telefono : "");
  const [error, setError] = useState("");

  const manejarGuardar = (e) => {
    e.preventDefault();

    if (!dni || !nombre || !telefono) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos");
      return;
    }

    if (telefono.length !== 9) {
      setError("El teléfono debe tener 9 dígitos");
      return;
    }

    const cliente = {
      dni,
      nombre,
      telefono,
      estado: "Activo"
    };

    onGuardar(cliente);
    setError("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{clienteEditar ? "Editar Cliente" : "Registrar Cliente"}</h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={manejarGuardar}>
          <div className="form-group">
            <label>DNI</label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              {clienteEditar ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCliente;