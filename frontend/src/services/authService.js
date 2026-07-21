import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUsuario = async (credenciales) => {
  const response = await axios.post(`${API_URL}/login`, credenciales);
  return response.data;
};