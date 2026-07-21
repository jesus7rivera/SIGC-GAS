import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="container">
      <Sidebar />

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;