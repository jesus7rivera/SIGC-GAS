import { useState } from "react";

function ModalCilindro({ onClose, onGuardar, cilindroEditar }) {
  const [codigo, setCodigo] = useState(
    cilindroEditar ? cilindroEditar.codigo : ""
  );
  const [tipo, setTipo] = useState(
    cilindroEditar ? cilindroEditar.tipo : "Doméstico"
  );
  const [capacidad, setCapacidad] = useState(
    cilindroEditar ? cilindroEditar.capacidad : "10 Kg"
  );
  const [estado, setEstado] = useState(
    cilindroEditar ? cilindroEditar.estado : "Disponible"
  );
  const [error, setError] = useState("");

  const manejarGuardar = (e) => {
    e.preventDefault();

    if (!codigo || !tipo || !capacidad || !estado) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!codigo.startsWith("CIL-")) {
      setError("El código debe iniciar con CIL-");
      return;
    }

    const cilindro = {
      codigo,
      tipo,
      capacidad,
      estado
    };

    onGuardar(cilindro);
    setError("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{cilindroEditar ? "Editar Cilindro" : "Registrar Cilindro"}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={manejarGuardar}>
          <div className="form-group">
            <label htmlFor="cilindroCodigo">Código</label>
            <input
              type="text"
              id="cilindroCodigo"
              placeholder="Ejemplo: CIL-003"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cilindro-tipo">Tipo</label>
            <select id="cilindro-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}>
              <option>Doméstico</option>
              <option>Industrial</option>
              <option>Comercial</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cilindro-capacidad">Capacidad</label>
            <select
              id="cilindro-capacidad"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            >
              <option>10 Kg</option>
              <option>15 Kg</option>
              <option>45 Kg</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cilindro-estado">Estado</label>
            <select
              id="cilindro-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option>Disponible</option>
              <option>Prestado</option>
              <option>Mantenimiento</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              {cilindroEditar ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCilindro;