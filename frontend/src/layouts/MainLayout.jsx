import {
  Outlet,
} from "react-router-dom";

import ChatbotWidget
  from "../components/ChatbotWidget";

import Sidebar
  from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="container">
      <Sidebar />

      <main className="content">
        <Outlet />
      </main>

      <ChatbotWidget />
    </div>
  );
}

export default MainLayout;