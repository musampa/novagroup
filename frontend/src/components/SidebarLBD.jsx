import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const sidebarStyle = {
  height: "100%",
  background: "linear-gradient(180deg, rgba(240,242,245,0.92) 0%, rgba(220,225,230,0.85) 100%)",
  color: "#2a3a4a",
  width: 210,
  minWidth: 170,
  maxWidth: 240,
  position: "relative",
  zIndex: 10,
  boxShadow: "2px 0 16px 0 rgba(176,184,195,0.18)",
  paddingTop: 0,
  transition: "width 0.2s, background 0.3s",
  overflowY: "auto",
  backdropFilter: "blur(6px)",
  borderRight: "1px solid #e0e0e0",
};

const navLinkStyle = {
  color: "#2a3a4a",
  fontWeight: 500,
  padding: "15px 24px",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  gap: 12,
  borderRadius: 8,
  margin: '2px 8px',
  transition: 'background 0.2s, color 0.2s',
};

const activeStyle = {
  background: "rgba(81,203,206,0.13)",
  color: "#51cbce",
  borderLeft: "4px solid #51cbce",
  fontWeight: 700,
};

export default function SidebarLBD({ active, onMenuSelect }) {
  const [open, setOpen] = useState("");
  const handleToggle = (section) => setOpen(open === section ? "" : section);

  return (
    <div style={sidebarStyle}>
      <div style={{ padding: 18, fontWeight: 700, fontSize: 20, letterSpacing: 1, textAlign: "center", borderBottom: "1px solid #333" }}>
      </div>
      <Nav className="flex-column" style={{ marginTop: 10 }}>
        {/* Dipendenti */}
        <div style={{ cursor: "pointer", ...navLinkStyle, fontSize: 15, justifyContent: "space-between" }} onClick={() => handleToggle("dipendenti") }>
          <span><i className="fas fa-users"></i> Dipendenti</span>
          <i className={`fas fa-chevron-${open === "dipendenti" ? "down" : "right"}`} style={{ fontSize: 13 }}></i>
        </div>
        {open === "dipendenti" && (
          <div style={{ marginLeft: 18 }}>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/dipendenti/nova" ? activeStyle : {}) }} onClick={() => onMenuSelect("/dipendenti/nova")}>Dipendenti Nova</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/dipendenti/logi" ? activeStyle : {}) }} onClick={() => onMenuSelect("/dipendenti/logi")}>Dipendenti Logi</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/dipendenti/crea" ? activeStyle : {}) }} onClick={() => onMenuSelect("/dipendenti/crea")}>Crea Dipendente</Nav.Link>
          </div>
        )}
        {/* Filiali */}
        <div style={{ cursor: "pointer", ...navLinkStyle, fontSize: 15, justifyContent: "space-between" }} onClick={() => handleToggle("filiali") }>
          <span><i className="fas fa-building"></i> Filiali</span>
          <i className={`fas fa-chevron-${open === "filiali" ? "down" : "right"}`} style={{ fontSize: 13 }}></i>
        </div>
        {open === "filiali" && (
          <div style={{ marginLeft: 18 }}>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/filiali/nova" ? activeStyle : {}) }} onClick={() => onMenuSelect("/filiali/nova")}>Filiali Nova</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/filiali/logi" ? activeStyle : {}) }} onClick={() => onMenuSelect("/filiali/logi")}>Filiali Logi</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/filiali/crea" ? activeStyle : {}) }} onClick={() => onMenuSelect("/filiali/crea")}>Crea Filiale</Nav.Link>
          </div>
        )}
        {/* Magazzino */}
        <div style={{ cursor: "pointer", ...navLinkStyle, fontSize: 15, justifyContent: "space-between" }} onClick={() => handleToggle("magazzino") }>
          <span><i className="fas fa-warehouse"></i> Magazzino</span>
          <i className={`fas fa-chevron-${open === "magazzino" ? "down" : "right"}`} style={{ fontSize: 13 }}></i>
        </div>
        {open === "magazzino" && (
          <div style={{ marginLeft: 18 }}>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/magazzino/logi" ? activeStyle : {}) }} onClick={() => onMenuSelect("/magazzino/logi")}>Magazzino Logi</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/magazzino/nova" ? activeStyle : {}) }} onClick={() => onMenuSelect("/magazzino/nova")}>Magazzino Nova</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/magazzino/inserisci" ? activeStyle : {}) }} onClick={() => onMenuSelect("/magazzino/inserisci")}>Inserisci Vestiario</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/magazzino/assegna" ? activeStyle : {}) }} onClick={() => onMenuSelect("/magazzino/assegna")}>Assegna Vestiario</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/magazzino/vestiario_assegnato" ? activeStyle : {}) }} onClick={() => onMenuSelect("/magazzino/vestiario_assegnato")}>Vestiario Assegnato</Nav.Link>
          </div>
        )}
        {/* Mezzi */}
        <div style={{ cursor: "pointer", ...navLinkStyle, fontSize: 15, justifyContent: "space-between" }} onClick={() => handleToggle("mezzi") }>
          <span><i className="fas fa-truck"></i> Mezzi</span>
          <i className={`fas fa-chevron-${open === "mezzi" ? "down" : "right"}`} style={{ fontSize: 13 }}></i>
        </div>
        {open === "mezzi" && (
          <div style={{ marginLeft: 18 }}>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/mezzi/nova" ? activeStyle : {}) }} onClick={() => onMenuSelect("/mezzi/nova")}>Mezzi Nova</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/mezzi/logi" ? activeStyle : {}) }} onClick={() => onMenuSelect("/mezzi/logi")}>Mezzi Logi</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/mezzi/crea" ? activeStyle : {}) }} onClick={() => onMenuSelect("/mezzi/crea")}>Crea Mezzo</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/mezzi/modifica" ? activeStyle : {}) }} onClick={() => onMenuSelect("/mezzi/modifica")}>Modifica Mezzo</Nav.Link>
            <Nav.Link style={{ ...navLinkStyle, fontSize: 14, ...(active === "/mezzi/cancella" ? activeStyle : {}) }} onClick={() => onMenuSelect("/mezzi/cancella")}>Cancella Mezzo</Nav.Link>
          </div>
        )}
      </Nav>
    </div>
  );
}
