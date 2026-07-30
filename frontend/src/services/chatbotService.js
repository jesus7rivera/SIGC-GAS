import api from "./api";

export const enviarMensajeChatbot = async (
  mensaje,
) => {
  const response = await api.post(
    "/chatbot/mensaje",
    {
      mensaje,
    },
  );

  return response.data;
};