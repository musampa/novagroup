import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/filiali">Gestione Filiali</Link></li>
        <li><Link to="/dipendenti">Gestione Dipendenti</Link></li>
        <li><Link to="/vestiario">Gestione Vestiario</Link></li>
        <li><Link to="/mezzi">Gestione Mezzi</Link></li>
        <li><Link to="/magazzino">Visualizza Magazzino</Link></li>
      </ul>
    </nav>
  );
}

export default Sidebar;