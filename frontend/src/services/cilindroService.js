import axios from "axios";

const API_URL = "http://localhost:5000/api/cilindros";

export const obtenerCilindros = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearCilindro = async (cilindro) => {
  const response = await axios.post(API_URL, cilindro);
  return response.data;
};

export const eliminarCilindro = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const actualizarCilindro = async (id, cilindro) => {
  const response = await axios.put(`${API_URL}/${id}`, cilindro);
  return response.data;
};