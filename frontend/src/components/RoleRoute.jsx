import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RoleRoute({ children, rolesPermitidos }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;