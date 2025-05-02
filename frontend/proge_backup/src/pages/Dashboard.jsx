import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <h1>Benvenuto nella Dashboard</h1>
          <p>Seleziona un'opzione dal menu a sinistra per iniziare.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;