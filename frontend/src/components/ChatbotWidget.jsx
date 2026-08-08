import {
  useState,
} from "react";

import {
  FaRobot,
  FaTimes,
} from "react-icons/fa";

import Chatbot
  from "../pages/Chatbot";

function ChatbotWidget() {
  const [
    abierto,
    setAbierto,
  ] = useState(false);

  const alternarChatbot = () => {
    setAbierto(
      (estadoAnterior) =>
        !estadoAnterior,
    );
  };

  const cerrarChatbot = () => {
    setAbierto(false);
  };

  return (
    <div className="chatbot-widget">
      <section
        className="chatbot-widget-panel"
        hidden={!abierto}
        role="dialog"
        aria-label={
          "Asistente SIGC-GAS de CORSURSA"
        }
      >
        <Chatbot
          compacto
          onCerrar={cerrarChatbot}
        />
      </section>

      <button
        type="button"
        className={
          `chatbot-widget-toggle ${
            abierto
              ? "chatbot-widget-toggle-open"
              : ""
          }`
        }
        onClick={alternarChatbot}
        aria-expanded={abierto}
        aria-label={
          abierto
            ? "Cerrar asistente"
            : "Abrir asistente"
        }
        title={
          abierto
            ? "Cerrar asistente"
            : "Abrir asistente SIGC-GAS de CORSURSA"
        }
      >
        {abierto
          ? <FaTimes />
          : <FaRobot />}

        {!abierto && (
          <span className="chatbot-widget-label">
            Asistente
          </span>
        )}
      </button>
    </div>
  );
}

export default ChatbotWidget;