import { obtenerClientes } from "./clienteService";
import { obtenerCilindros } from "./cilindroService";
import { obtenerMovimientos } from "./movimientoService";

export const obtenerDatosDashboard = async () => {
  const clientes = await obtenerClientes();
  const cilindros = await obtenerCilindros();
  const movimientos = await obtenerMovimientos();

  const disponibles = cilindros.filter(
    (cilindro) => cilindro.estado === "Disponible"
  ).length;

  const prestados = cilindros.filter(
    (cilindro) => cilindro.estado === "Prestado"
  ).length;

  const mantenimiento = cilindros.filter(
    (cilindro) => cilindro.estado === "Mantenimiento"
  ).length;

  return {
    clientes,
    cilindros,
    movimientos,
    resumen: {
      disponibles,
      prestados,
      mantenimiento,
      clientesActivos: clientes.length
    }
  };
};