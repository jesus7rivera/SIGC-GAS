import { useEffect, useState } from "react";
import ModalCilindro from "../components/ModalCilindro";
import { obtenerCilindros, crearCilindro, eliminarCilindro, actualizarCilindro } from "../services/cilindroService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ModalHistorial from "../components/ModalHistorial";
import { obtenerHistorialPorCilindro } from "../services/movimientoService";
import Swal from "sweetalert2";

function Cilindros() {
  const [cilindros, setCilindros] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cilindroEditar, setCilindroEditar] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
  const cargarCilindros = async () => {
    try {
      const data = await obtenerCilindros();
      setCilindros(data);
    } catch (error) {
      console.error("Error al cargar cilindros:", error);
    }
  };

  cargarCilindros();
}, []);

  const manejarGuardar = async (cilindro) => {
  try {
    if (cilindroEditar) {
      const cilindroActualizado = await actualizarCilindro(
        cilindroEditar._id,
        cilindro
      );

      setCilindros(
        cilindros.map((item) =>
          item._id === cilindroEditar._id ? cilindroActualizado : item
        )
      );

      setCilindroEditar(null);
    } else {
      const cilindroGuardado = await crearCilindro(cilindro);
      setCilindros([cilindroGuardado, ...cilindros]);
    }
  } catch (error) {
    console.error("Error al guardar cilindro:", error);
  }
};
const manejarEditar = (cilindro) => {
  setCilindroEditar(cilindro);
  setMostrarModal(true);
};

  const manejarEliminar = async (id) => {
  const resultado = await Swal.fire({
    title: "¿Eliminar cilindro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280"
  });

  if (!resultado.isConfirmed) return;

  try {
    await eliminarCilindro(id);

    setCilindros(
      cilindros.filter((cilindro) => cilindro._id !== id)
    );

    Swal.fire({
      title: "Eliminado",
      text: "El cilindro fue eliminado correctamente.",
      icon: "success",
      confirmButtonColor: "#2563eb"
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error",
      text: "No se pudo eliminar el cilindro.",
      icon: "error",
      confirmButtonColor: "#dc2626"
    });
  }
};

  const cilindrosFiltrados = cilindros.filter((cilindro) => {
  const coincideEstado =
    filtroEstado === "Todos" || cilindro.estado === filtroEstado;

  const coincideBusqueda = cilindro.codigo
    .toLowerCase()
    .includes(busqueda.toLowerCase());

  return coincideEstado && coincideBusqueda;
});

  const generarReportePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SIGC-GAS", 14, 15);

  doc.setFontSize(12);
  doc.text("Reporte de Cilindros", 14, 25);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

  const columnas = ["Código", "Tipo", "Capacidad", "Estado"];

  const filas = cilindrosFiltrados.map((cilindro) => [
    cilindro.codigo,
    cilindro.tipo,
    cilindro.capacidad,
    cilindro.estado
  ]);

  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: 40
  });

  doc.save("reporte_cilindros.pdf");
};

const verHistorial = async (cilindroId) => {
  try {
    const data = await obtenerHistorialPorCilindro(cilindroId);
    setHistorial(data);
    setMostrarHistorial(true);
  } catch (error) {
    console.error("Error al obtener historial:", error);
  }
};

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Cilindros</h1>

        <div className="header-buttons">
  <button
    className="btn-primary"
    onClick={() => setMostrarModal(true)}
  >
    Nuevo Cilindro
  </button>

  <button
    className="btn-secondary"
    onClick={generarReportePDF}
  >
    Generar PDF
  </button>
</div>
      </div>

      <div className="filter-container">
        <button onClick={() => setFiltroEstado("Todos")}>Todos</button>
        <button onClick={() => setFiltroEstado("Disponible")}>Disponibles</button>
        <button onClick={() => setFiltroEstado("Prestado")}>Prestados</button>
        <button onClick={() => setFiltroEstado("Mantenimiento")}>Mantenimiento</button>
      </div>

      <div className="search-container">
  <input
    type="text"
    placeholder="Buscar cilindro por código..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
</div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cilindrosFiltrados.map((cilindro) => (
              <tr key={cilindro._id}>
  <td>{cilindro.codigo}</td>
  <td>{cilindro.tipo}</td>
  <td>{cilindro.capacidad}</td>
  <td>
  <span className={`estado-badge ${cilindro.estado.toLowerCase()}`}>
    {cilindro.estado}
  </span>
</td>
  <td>
   <button
  className="btn-secondary"
  onClick={() => manejarEditar(cilindro)}
>
  Editar
</button> 
  <button
    className="btn-secondary"
    onClick={() => verHistorial(cilindro._id)}
  >
    Historial
  </button>

  <button
    className="btn-danger"
    style={{ marginLeft: "8px" }}
    onClick={() => manejarEliminar(cilindro._id)}
  >
    Eliminar
  </button>
</td>
</tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <ModalCilindro
  onClose={() => {
    setMostrarModal(false);
    setCilindroEditar(null);
  }}
  onGuardar={manejarGuardar}
  cilindroEditar={cilindroEditar}
/>
      )}

      {mostrarHistorial && (
        <ModalHistorial
          historial={historial}
          onClose={() => setMostrarHistorial(false)}
        />
      )}
    </div>
  );
}

export default Cilindros;