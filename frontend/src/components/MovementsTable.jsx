function MovementsTable({ movimientos }) {
  return (
    <div className="table-container">
      <h2>Movimientos Recientes</h2>

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
          {movimientos.slice(0, 5).map((movimiento) => (
            <tr key={movimiento._id}>
              <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
              <td>{movimiento.cliente?.nombre}</td>
              <td>{movimiento.cilindro?.codigo}</td>
              <td>{movimiento.tipo}</td>
              <td>{movimiento.observacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovementsTable;