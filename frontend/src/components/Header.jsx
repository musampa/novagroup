import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ userName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Chiamata alla funzione di logout
    navigate("/login"); // Reindirizza alla pagina di login
  };

  return (
    <header style={{ background: "linear-gradient(to right, #e0e0e0, #cfcfcf)", padding: "10px", borderBottom: "1px solid #ccc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Nova Group Logo" style={{ height: "40px", marginRight: "10px" }} />
          <h1 style={{ fontSize: "20px", margin: 0 }}>NOVA GROUP</h1>
        </div>
        {userName && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "20px" }}>{userName}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}