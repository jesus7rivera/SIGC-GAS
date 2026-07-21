function StatCard({ titulo, valor, icono, descripcion }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icono}
      </div>

      <div>
        <h3>{titulo}</h3>
        <p>{valor}</p>
        <span>{descripcion}</span>
      </div>
    </div>
  );
}

export default StatCard;