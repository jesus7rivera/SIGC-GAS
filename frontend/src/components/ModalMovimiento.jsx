import { useEffect, useState } from "react";
import { obtenerClientes } from "../services/clienteService";
import { obtenerCilindros } from "../services/cilindroService";

function ModalMovimiento({ onClose, onGuardar }) {
  const [clientes, setClientes] = useState([]);
  const [cilindros, setCilindros] = useState([]);

  const [cliente, setCliente] = useState("");
  const [cilindro, setCilindro] = useState("");
  const [tipo, setTipo] = useState("Salida");
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const clientesDB = await obtenerClientes();
      const cilindrosDB = await obtenerCilindros();

      setClientes(clientesDB);
      setCilindros(cilindrosDB);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  cargarDatos();
}, []);

  const manejarGuardar = (e) => {
    e.preventDefault();

    if (!cliente || !cilindro || !tipo) {
      alert("Seleccione cliente, cilindro y tipo de movimiento");
      return;
    }

    const nuevoMovimiento = {
      cliente,
      cilindro,
      tipo,
      observacion
    };

    onGuardar(nuevoMovimiento);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Registrar Movimiento</h2>

        <form onSubmit={manejarGuardar}>
          <div className="form-group">
            <label>Cliente</label>
            <select
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            >
              <option value="">Seleccione un cliente</option>

              {clientes.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.nombre} - DNI: {item.dni}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cilindro</label>
            <select
              value={cilindro}
              onChange={(e) => setCilindro(e.target.value)}
            >
              <option value="">Seleccione un cilindro</option>

              {cilindros.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.codigo} - {item.tipo} - {item.estado}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Movimiento</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option>Salida</option>
              <option>Devolución</option>
              <option>Mantenimiento</option>
            </select>
          </div>

          <div className="form-group">
            <label>Observación</label>
            <input
              type="text"
              placeholder="Ejemplo: Entrega a cliente"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalMovimiento;