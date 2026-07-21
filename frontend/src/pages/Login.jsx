import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUsuario({
        correo,
        password
      });

      login(data.usuario, data.token);
      navigate("/");

    } catch {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>SIGC-GAS</h1>
        <p>Sistema de Gestión de Cilindros de Gas</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={manejarLogin}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@sigcgas.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary login-button" type="submit">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;