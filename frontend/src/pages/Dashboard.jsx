import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import MovementsTable from "../components/MovementsTable";
import { obtenerDatosDashboard } from "../services/dashboardService";
import CylinderChart from "../components/CylinderChart";
import {
  FaUsers,
  FaGasPump,
  FaTools,
  FaExchangeAlt
} from "react-icons/fa";

function Dashboard() {
  const [resumen, setResumen] = useState({
    disponibles: 0,
    prestados: 0,
    mantenimiento: 0,
    clientesActivos: 0
  });

  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
  const cargarDashboard = async () => {
    try {
      const data = await obtenerDatosDashboard();

      setResumen(data.resumen);
      setMovimientos(data.movimientos);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    }
  };

  cargarDashboard();
}, []);

  return (
    <div>
      <div className="dashboard-brand-header">
  <span>
    CORSURSA
  </span>

  <h1>
    Panel de Control SIGC-GAS
  </h1>

  <p>
    Sistema de Gestión y Control
    de Cilindros
  </p>
</div>

      <div className="stats-container">
  <StatCard
    titulo="Clientes Activos"
    valor={resumen.clientesActivos}
    icono={<FaUsers />}
    descripcion="Total registrados"
  />

  <StatCard
    titulo="Disponibles"
    valor={resumen.disponibles}
    icono={<FaGasPump />}
    descripcion="Cilindros en almacén"
  />

  <StatCard
    titulo="Prestados"
    valor={resumen.prestados}
    icono={<FaExchangeAlt />}
    descripcion="Cilindros en préstamo"
  />

  <StatCard
    titulo="Mantenimiento"
    valor={resumen.mantenimiento}
    icono={<FaTools />}
    descripcion="Revisión técnica"
  />
</div>

      <CylinderChart resumen={resumen} />
      <MovementsTable movimientos={movimientos} />
    </div>
  );
}

export default Dashboard;