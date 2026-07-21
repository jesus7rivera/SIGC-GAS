import { useEffect, useState } from "react";
import ModalCliente from "../components/ModalCliente";
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente
} from "../services/clienteService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Clientes() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const agregarCliente = async (cliente) => {
  try {
    if (clienteEditar) {
      const clienteActualizado = await actualizarCliente(
        clienteEditar._id,
        cliente
      );

      setClientes(
        clientes.map((item) =>
          item._id === clienteEditar._id ? clienteActualizado : item
        )
      );

      setClienteEditar(null);
    } else {
      const clienteGuardado = await crearCliente(cliente);
      setClientes([clienteGuardado, ...clientes]);
    }
  } catch (error) {
    console.error("Error al guardar cliente:", error);
  }
};
const manejarEditar = (cliente) => {
  setClienteEditar(cliente);
  setMostrarModal(true);
};

const manejarEliminar = async (id) => {
  const confirmar = window.confirm(
    "¿Está seguro de eliminar este cliente?"
  );

  if (!confirmar) return;

  try {
    await eliminarCliente(id);

    const clientesActualizados = clientes.filter(
      (cliente) => cliente._id !== id
    );

    setClientes(clientesActualizados);

  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
};

const clientesFiltrados = clientes.filter((cliente) => {
  const textoBusqueda = busqueda.toLowerCase();

  return (
    cliente.dni.toLowerCase().includes(textoBusqueda) ||
    cliente.nombre.toLowerCase().includes(textoBusqueda)
  );
});

const generarReportePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SIGC-GAS", 14, 15);

  doc.setFontSize(12);
  doc.text("Reporte de Clientes", 14, 25);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

  const columnas = ["DNI", "Nombre", "Teléfono", "Estado"];

  const filas = clientesFiltrados.map((cliente) => [
    cliente.dni,
    cliente.nombre,
    cliente.telefono,
    cliente.estado
  ]);

  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: 40
  });

  doc.save("reporte_clientes.pdf");
};

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Clientes</h1>

        <div className="header-buttons">
  <button
    className="btn-primary"
    onClick={() => setMostrarModal(true)}
  >
    Nuevo Cliente
  </button>

  <button
    className="btn-secondary"
    onClick={generarReportePDF}
  >
    Generar PDF
  </button>
</div>
      </div>

      <div className="search-container">
  <input
    type="text"
    placeholder="Buscar cliente por DNI o nombre..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
</div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.dni}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.estado}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => manejarEditar(cliente)}
                >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => manejarEliminar(cliente._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <ModalCliente
            onClose={() => {
              setMostrarModal(false);
              setClienteEditar(null);
          }}
          onGuardar={agregarCliente}
          clienteEditar={clienteEditar}
        />
        )}
      </div>
    </div>
  );
}

export default Clientes;