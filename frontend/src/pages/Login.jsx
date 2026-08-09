import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import corsursaLogo
  from "../assets/corsursa-logo.png";

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

    } catch (error) {
  if (error.response?.status === 429) {
    setError(
      error.response?.data?.mensaje
        ?? "Cuenta bloqueada temporalmente. "
        + "Intente nuevamente más tarde.",
    );

    return;
  }

  setError(
    "Correo o contraseña incorrectos.",
  );
}
  };

  return (
  <main className="login-container">
    <section className="login-card">
      <div className="login-brand">
        <img
          src={corsursaLogo}
          alt="CORSURSA - Soldadura y Gases"
          className="login-brand-logo"
        />

        <div className="login-brand-divider" />

        <span className="login-company-label">
          Sistema corporativo
        </span>

        <h1>
          SIGC-GAS
        </h1>

        <p className="login-system-description">
          Sistema de Gestión y Control
          de Cilindros
        </p>
      </div>

      <div className="login-access-header">
        <h2>
          Iniciar sesión
        </h2>

        <p>
          Ingresa tus credenciales para
          acceder al sistema.
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={manejarLogin}>
        <div className="form-group">
          <label htmlFor="correo">
            Correo electrónico
          </label>

          <input
            id="correo"
            type="email"
            placeholder="correo@corsursa.com"
            value={correo}
            onChange={(e) =>
              setCorreo(e.target.value)
            }
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
          />
        </div>

        <button
          className="btn-primary login-button"
          type="submit"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="login-footer">
        CORSURSA · Soldadura y Gases
      </p>
    </section>
  </main>
);
}

export default Login;