import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DipendentiNova from "./pages/DipendentiNova";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato di login
  const [userName, setUserName] = useState(""); // Nome dell'utente loggato
  const navigate = useNavigate();

  const handleLogin = (name) => {
    console.log("Effettuato login per:", name);
    setUserName(name);
    setIsLoggedIn(true);
    navigate("/dashboard"); // Reindirizza alla dashboard
  };

  const handleLogout = () => {
    console.log("Logout effettuato.");
    setUserName("");
    setIsLoggedIn(false);
    navigate("/login"); // Reindirizza alla pagina di login
  };

  const handleMenuSelect = (itemId) => {
    console.log("Navigazione a:", itemId);
    navigate(itemId); // Naviga alla route specificata
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header userName={isLoggedIn ? userName : null} onLogout={handleLogout} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        {isLoggedIn && <Sidebar onMenuSelect={handleMenuSelect} />}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dipendenti/nova" element={<DipendentiNova />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}