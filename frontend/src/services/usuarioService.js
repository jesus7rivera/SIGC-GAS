import api from "./api";

export const obtenerUsuarios = async () => {
  const response =
    await api.get("/usuarios");

  return response.data;
};

export const desbloquearUsuario = async (
  id,
) => {
  const response =
    await api.patch(
      `/usuarios/${id}/desbloquear`,
    );

  return response.data;
};

export const restablecerPassword = async (
  id,
  nuevaPassword,
) => {
  const response =
    await api.patch(
      `/usuarios/${id}/restablecer-password`,
      {
        nuevaPassword,
      },
    );

  return response.data;
};