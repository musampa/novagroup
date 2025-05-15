import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditFilialeModal from "../components/EditFilialeModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import "../styles/Filiali.css";

export default function FilialiLogi() {
  const [filiali, setFiliali] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFiliale, setSelectedFiliale] = useState(null);
  const [filters, setFilters] = useState({
    filiale_id: '',
    filiale_nome: '',
    filiale_indirizzo: '',
    filiale_citta: '',
  });

  useEffect(() => {
    const fetchFiliali = async () => {
      try {
        const response = await fetch("/api/filiali/logi");
        if (!response.ok) {
          throw new Error(`Errore durante il recupero delle filiali: ${response.status}`);
        }
        const data = await response.json();
        setFiliali(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFiliali();
  }, []);

  const handleEdit = (filiale) => {
    setSelectedFiliale(filiale);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updated) => {
    try {
      const id = selectedFiliale.id || selectedFiliale._id;
      const response = await fetch(`/api/filiali/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error("Errore durante la modifica della filiale");
      setFiliali((prev) =>
        prev.map((f) => (f.id === id || f._id === id ? { ...f, ...updated } : f))
      );
      setEditModalOpen(false);
      setSelectedFiliale(null);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  const handleDelete = (filiale) => {
    setSelectedFiliale(filiale);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = selectedFiliale.id || selectedFiliale._id;
      const response = await fetch(`/api/filiali/logi/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Errore durante l'eliminazione della filiale");
      setFiliali((prev) => prev.filter((f) => f.id !== id && f._id !== id));
      setDeleteModalOpen(false);
      setSelectedFiliale(null);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  const filteredFiliali = filiali.filter(filiale =>
    (filters.filiale_id === '' || (filiale.filiale_id || '').toLowerCase().includes(filters.filiale_id.toLowerCase())) &&
    (filters.filiale_nome === '' || (filiale.filiale_cantiere || filiale.filiale_nome || '').toLowerCase().includes(filters.filiale_nome.toLowerCase())) &&
    (filters.filiale_indirizzo === '' || (filiale.filiale_indirizzo || '').toLowerCase().includes(filters.filiale_indirizzo.toLowerCase())) &&
    (filters.filiale_citta === '' || (filiale.filiale_citta || '').toLowerCase().includes(filters.filiale_citta.toLowerCase()))
  );

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="container">
      <h1>Filiali LOGI</h1>
      <table className="interactive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Azioni</th>
          </tr>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Filtra ID"
                value={filters.filiale_id}
                onChange={e => setFilters(f => ({ ...f, filiale_id: e.target.value }))}
                style={{ width: '90%' }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filtra Nome/Cantiere"
                value={filters.filiale_nome}
                onChange={e => setFilters(f => ({ ...f, filiale_nome: e.target.value }))}
                style={{ width: '90%' }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filtra Indirizzo"
                value={filters.filiale_indirizzo}
                onChange={e => setFilters(f => ({ ...f, filiale_indirizzo: e.target.value }))}
                style={{ width: '90%' }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filtra Città"
                value={filters.filiale_citta}
                onChange={e => setFilters(f => ({ ...f, filiale_citta: e.target.value }))}
                style={{ width: '90%' }}
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredFiliali.map((filiale) => (
            <tr key={filiale.id || filiale._id || filiale.filiale_id}>
              <td>{filiale.filiale_id}</td>
              <td>{filiale.filiale_cantiere || filiale.filiale_nome}</td>
              <td>{filiale.filiale_indirizzo}</td>
              <td>{filiale.filiale_citta}</td>
              <td>
                <IconButton color="primary" onClick={() => handleEdit(filiale)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(filiale)} size="small">
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditFilialeModal
        open={editModalOpen}
        filiale={selectedFiliale}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        filiale={selectedFiliale}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}