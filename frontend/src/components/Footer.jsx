import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(90deg, #f7fafc 0%, #e3e6ec 100%)",
      padding: "18px 0 12px 0",
      borderTop: "1px solid #e0e0e0",
      textAlign: "center",
      boxShadow: '0 -2px 12px #b0b8c320',
      color: '#3a3a3a',
      fontWeight: 500,
      fontSize: 15
    }}>
      <p style={{ margin: 0 }}>
        Nova Group - Via dei Castelli Romani, 22 00071 - Pomezia
      </p>
    </footer>
  );
}