import api from "./api";

export const obtenerDatosDashboard = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};