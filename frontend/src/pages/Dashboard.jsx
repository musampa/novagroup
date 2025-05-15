import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <h1
        style={{
          fontSize: 32,
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontWeight: 800,
          color: '#2a3a4a',
          cursor: 'pointer',
          marginBottom: 32,
          textShadow: '0 2px 8px #b0b8c340',
          background: 'linear-gradient(90deg, #e3e6ec 0%, #f7fafc 100%)',
          borderRadius: 12,
          padding: '8px 32px',
          boxShadow: '0 2px 12px #b0b8c320',
        }}
        onClick={() => navigate("/dashboard")}
      >
        NOVAGROUP
      </h1>
      <div style={{ fontSize: 20, color: '#4a5a6a', background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '16px 32px', boxShadow: '0 2px 12px #b0b8c320' }}>
        Benvenuto nella Dashboard!
      </div>
    </div>
  );
}