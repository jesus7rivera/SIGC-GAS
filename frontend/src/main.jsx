import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App.jsx";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/tables.css";
import "./styles/buttons.css";
import "./styles/chatbot.css";
import "./index.css";

createRoot(
  document.getElementById("root"),
).render(
  <StrictMode>
    <App />
  </StrictMode>,
);