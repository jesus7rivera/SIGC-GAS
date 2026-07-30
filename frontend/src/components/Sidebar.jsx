import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaChartPie,
  FaExchangeAlt,
  FaGasPump,
  FaSignOutAlt,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

import {
  useAuth,
} from "../hooks/useAuth";

function Sidebar() {
  const {
    usuario,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          SG
        </div>

        <div>
          <h2>SIGC-GAS</h2>

          <span>
            Control de cilindros
          </span>
        </div>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          <FaUserShield />
        </div>

        <h3>
          {usuario?.nombre}
        </h3>

        <p>
          {usuario?.rol}
        </p>
      </div>

      <ul className="menu">
        <li>
          <NavLink to="/" end>
            <FaChartPie />

            <span>
              Dashboard
            </span>
          </NavLink>
        </li>

        {usuario?.rol
          === "Administrador" && (
          <li>
            <NavLink to="/clientes">
              <FaUsers />

              <span>
                Clientes
              </span>
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/cilindros">
            <FaGasPump />

            <span>
              Cilindros
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/movimientos">
            <FaExchangeAlt />

            <span>
              Movimientos
            </span>
          </NavLink>
        </li>

      </ul>

      <button
        type="button"
        className="logout-button"
        onClick={cerrarSesion}
      >
        <FaSignOutAlt />

        <span>
          Cerrar sesión
        </span>
      </button>
    </aside>
  );
}

export default Sidebar;