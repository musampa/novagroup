import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ userName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Chiamata alla funzione di logout
    navigate("/login"); // Reindirizza alla pagina di login
  };

  return (
    <header style={{
      background: "linear-gradient(90deg, #e3e6ec 0%, #f7fafc 100%)",
      padding: "16px 0 10px 0",
      borderBottom: "1px solid #e0e0e0",
      boxShadow: '0 2px 12px #b0b8c320',
      zIndex: 10
    }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: '100%' }}>
        <img src="/src/assets/logo.jpg" alt="Nova Group Logo" style={{ height: "44px", borderRadius: 10, background: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 8px #b0b8c340', margin: '0 auto' }} />
      </div>
      {userName && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", position: 'absolute', right: 32, top: 18 }}>
          <span style={{ marginRight: "20px", color: '#3a3a3a', fontWeight: 600 }}>{userName}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "7px 18px",
              background: "linear-gradient(90deg, #51cbce 0%, #51a6ce 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              boxShadow: '0 2px 8px #51cbce33',
              transition: 'background 0.2s',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}