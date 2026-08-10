import { useEffect, useState } from "react";
import ModalMovimiento from "../components/ModalMovimiento";
import {
  obtenerMovimientos,
  crearMovimiento
} from "../services/movimientoService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Movimientos() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
  const cargarMovimientos = async () => {
    try {
      const data = await obtenerMovimientos();
      setMovimientos(data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    }
  };

  cargarMovimientos();
}, []);
  const guardarMovimiento = async (
  nuevoMovimiento,
) => {
  try {
    const movimientoGuardado =
      await crearMovimiento(nuevoMovimiento);

    setMovimientos((movimientosAnteriores) => [
      movimientoGuardado,
      ...movimientosAnteriores,
    ]);

    return {
      exito: true,
    };
  } catch (error) {
    console.error(
      "Error al guardar movimiento:",
      error,
    );

    const mensaje =
      error.response?.data?.mensaje ??
      "No se pudo registrar el movimiento.";

    return {
      exito: false,
      mensaje,
    };
  }
};

  const generarReportePDF = () => {
    const doc = new jsPDF();

    doc.setTextColor(215, 38, 46);
doc.setFontSize(17);
doc.text("CORSURSA", 14, 15);

doc.setTextColor(32, 34, 38);
doc.setFontSize(10);
doc.text(
  "SIGC-GAS - Sistema de Gestión y Control de Cilindros",
  14,
  22,
);

doc.setFontSize(13);
doc.text(
  "Reporte de Movimientos",
  14,
  31,
);

doc.setTextColor(107, 114, 128);
doc.setFontSize(9);
doc.text(
  `Fecha: ${new Date().toLocaleDateString("es-PE")}`,
  14,
  37,
);

doc.setTextColor(32, 34, 38);

    const columnas = [
      "Fecha",
      "Cliente",
      "Cilindro",
      "Tipo",
      "Observación"
    ];

    const filas = movimientos.map((movimiento) => [
      new Date(movimiento.fecha).toLocaleDateString(),
      movimiento.cliente?.nombre || "Sin cliente",
      movimiento.cilindro?.codigo || "Sin cilindro",
      movimiento.tipo,
      movimiento.observacion
    ]);

    autoTable(doc, {
  head: [columnas],
  body: filas,
  startY: 44,
  headStyles: {
    fillColor: [215, 38, 46],
    textColor: [255, 255, 255],
  },
});

    doc.save("reporte_movimientos.pdf");
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Movimientos</h1>

        <div className="header-buttons">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setMostrarModal(true)}
          >
            Nuevo Movimiento
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={generarReportePDF}
          >
            Generar PDF
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Cilindro</th>
              <th>Tipo</th>
              <th>Observación</th>
            </tr>
          </thead>

          <tbody>
            {movimientos.map((movimiento) => (
              <tr key={movimiento._id}>
                <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                <td>{movimiento.cliente?.nombre}</td>
                <td>{movimiento.cilindro?.codigo}</td>
                <td>
  <span
    className={`movimiento-badge ${movimiento.tipo
      .toLowerCase()
      .replace("ó", "o")}`}
  >
    {movimiento.tipo}
  </span>
</td>
                <td>{movimiento.observacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <ModalMovimiento
          onClose={() => setMostrarModal(false)}
          onGuardar={guardarMovimiento}
        />
      )}
    </div>
  );
}

export default Movimientos;