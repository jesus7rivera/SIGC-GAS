import {
  procesarMensaje as
    procesarMensajeAplicacion,
} from "../services/chatbotApplicationService.js";

export const crearProcesarMensajeChatbot = (
  {
    procesarMensaje =
      procesarMensajeAplicacion,
  } = {},
) =>
  async (
    req,
    res,
    next,
  ) => {
    try {
      const resultado =
        await procesarMensaje(
          req.body.mensaje,
        );

      return res
        .status(200)
        .json(resultado);
    } catch (error) {
      return next(error);
    }
  };

export const procesarMensajeChatbot =
  crearProcesarMensajeChatbot();