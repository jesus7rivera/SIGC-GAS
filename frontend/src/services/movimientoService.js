import api from "./api";

export const obtenerMovimientos = async () => {
  const response = await api.get("/movimientos");
  return response.data;
};

export const crearMovimiento = async (movimiento) => {
  const response = await api.post(
    "/movimientos",
    movimiento,
  );

  return response.data;
};

export const obtenerHistorialPorCilindro = async (
  cilindroId,
) => {
  const response = await api.get(
    `/movimientos/cilindro/${cilindroId}`,
  );

  return response.data;
};