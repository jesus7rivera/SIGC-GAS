import api from "./api";

export const loginUsuario = async (
  credenciales,
) => {
  const response =
    await api.post(
      "/auth/login",
      credenciales,
    );

  return response.data;
};