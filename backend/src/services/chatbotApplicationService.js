import {
  chatbotRepository,
} from "../repositories/chatbotRepository.js";

import {
  ejecutarConsultaChatbot,
} from "./chatbotQueryService.js";

import {
  procesarMensajeChatbot,
} from "./chatbotService.js";

export const crearProcesadorChatbot = (
  {
    repositorio =
      chatbotRepository,
    ahora,
  } = {},
) => {
  const ejecutarConsulta =
    (solicitud) =>
      ejecutarConsultaChatbot(
        solicitud,
        {
          repositorio,
          ahora,
        },
      );

  return (mensaje) =>
    procesarMensajeChatbot(
      mensaje,
      {
        ejecutarConsulta,
      },
    );
};

export const procesarMensaje =
  crearProcesadorChatbot();