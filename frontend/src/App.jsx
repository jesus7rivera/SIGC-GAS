import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Cilindros from "./pages/Cilindros";
import Movimientos from "./pages/Movimientos";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
  path="clientes"
  element={
    <RoleRoute rolesPermitidos={["Administrador"]}>
      <Clientes />
    </RoleRoute>
  }
/>
            <Route path="cilindros" element={<Cilindros />} />
            <Route path="movimientos" element={<Movimientos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;