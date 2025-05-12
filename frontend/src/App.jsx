import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DipendentiNova from "./pages/DipendentiNova";
import DipendentiLogi from "./pages/DipendentiLogi";
import CreaDipendente from "./pages/CreaDipendente";
import FilialiNova from "./pages/FilialiNova";
import FilialiLogi from "./pages/FilialiLogi";
import CreaFiliale from "./pages/CreaFiliale";
import InserisciVestiario from "./pages/InserisciVestiario";
import Magazzino from "./pages/Magazzino";
import MagazzinoLogi from "./pages/MagazzinoLogi";
import MagazzinoNova from "./pages/MagazzinoNova";
import AssegnaVestiario from "./pages/AssegnaVestiario";
import VestiarioAssegnato from "./pages/Magazzino/VestiarioAssegnato";
import "./styles/global.css";
import './styles/Login.css';

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
      {isLoggedIn && <Header userName={userName} onLogout={handleLogout} />}
      <div style={{ display: "flex", flexGrow: 1 }}>
        {isLoggedIn && <Sidebar onMenuSelect={handleMenuSelect} />}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            {console.log("Rendering Routes. isLoggedIn:", isLoggedIn)}
            {console.log("Navigating to /login or /dashboard based on isLoggedIn state.")}
            {console.log("Current location:", window.location.pathname)}
            {isLoggedIn ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dipendenti/nova" element={<DipendentiNova />} />
                <Route path="/dipendenti/logi" element={<DipendentiLogi />} />
                <Route path="/dipendenti/crea" element={<CreaDipendente />} />
                <Route path="/filiali/nova" element={<FilialiNova />} />
                <Route path="/filiali/logi" element={<FilialiLogi />} />
                <Route path="/filiali/crea" element={<CreaFiliale onCreate={(newFiliale) => console.log('Filiale creata:', newFiliale)} />} />
                <Route path="/magazzino" element={<Magazzino />} />
                <Route path="/magazzino/logi" element={<MagazzinoLogi />} />
                <Route path="/magazzino/nova" element={<MagazzinoNova />} />
                <Route path="/magazzino/inserisci" element={<InserisciVestiario />} />
                <Route path="/magazzino/assegna" element={<AssegnaVestiario />} />
                <Route path="/magazzino/vestiario_assegnato" element={<VestiarioAssegnato />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
      {isLoggedIn && <Footer />}
    </div>
  );
}