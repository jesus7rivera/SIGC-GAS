import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function CylinderChart({ resumen }) {
  const data = [
    {
      estado: "Disponibles",
      cantidad: resumen.disponibles
    },
    {
      estado: "Prestados",
      cantidad: resumen.prestados
    },
    {
      estado: "Mantenimiento",
      cantidad: resumen.mantenimiento
    }
  ];

  return (
    <div className="chart-card">
      <h2>Estado de Cilindros</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="estado" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CylinderChart;