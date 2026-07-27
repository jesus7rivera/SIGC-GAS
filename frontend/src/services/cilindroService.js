import api from "./api";

export const obtenerCilindros = async () => {
  const response = await api.get("/cilindros");
  return response.data;
};

export const crearCilindro = async (cilindro) => {
  const response = await api.post("/cilindros", cilindro);
  return response.data;
};

export const eliminarCilindro = async (id) => {
  const response = await api.delete(`/cilindros/${id}`);
  return response.data;
};

export const actualizarCilindro = async (
  id,
  cilindro,
) => {
  const response = await api.put(
    `/cilindros/${id}`,
    cilindro,
  );

  return response.data;
};