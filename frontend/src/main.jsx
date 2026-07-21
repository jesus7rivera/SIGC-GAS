import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css"
import "./styles/layout.css"
import "./styles/sidebar.css"
import "./styles/dashboard.css"
import "./styles/tables.css";
import "./styles/buttons.css";
import "./index.css"
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
