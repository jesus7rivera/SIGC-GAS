function ModalHistorial({ historial, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: "900px" }}>
        <h2>Historial del Cilindro</h2>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Observación</th>
            </tr>
          </thead>

          <tbody>
            {historial.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Este cilindro aún no tiene movimientos registrados.
                </td>
              </tr>
            ) : (
              historial.map((movimiento) => (
                <tr key={movimiento._id}>
                  <td>
                    {new Date(movimiento.fecha).toLocaleDateString()}
                  </td>

                  <td>
                    {movimiento.cliente?.nombre || "Sin cliente"}
                  </td>

                  <td>{movimiento.tipo}</td>

                  <td>{movimiento.observacion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="form-buttons">
          <button
            className="btn-primary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalHistorial;