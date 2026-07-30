import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute
  from "./components/ProtectedRoute";

import RoleRoute
  from "./components/RoleRoute";

import {
  AuthProvider,
} from "./context/AuthContext";

import MainLayout
  from "./layouts/MainLayout";

import Cilindros
  from "./pages/Cilindros";

import Clientes
  from "./pages/Clientes";

import Dashboard
  from "./pages/Dashboard";

import Login
  from "./pages/Login";

import Movimientos
  from "./pages/Movimientos";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="clientes"
              element={
                <RoleRoute
                  rolesPermitidos={[
                    "Administrador",
                  ]}
                >
                  <Clientes />
                </RoleRoute>
              }
            />

            <Route
              path="cilindros"
              element={<Cilindros />}
            />

            <Route
              path="movimientos"
              element={<Movimientos />}
            />


          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;