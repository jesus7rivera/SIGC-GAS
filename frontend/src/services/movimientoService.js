import axios from "axios";

const API_URL = "http://localhost:5000/api/movimientos";

export const obtenerMovimientos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearMovimiento = async (movimiento) => {
  const response = await axios.post(API_URL, movimiento);
  return response.data;
};

export const obtenerHistorialPorCilindro = async (cilindroId) => {
  const response = await axios.get(`${API_URL}/cilindro/${cilindroId}`);
  return response.data;
};