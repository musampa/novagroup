import React, { useEffect, useState } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import "./DipendentiNova.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import EditDipendenteModal from "../components/EditDipendenteModal";
import CreaDipendente from "./CreaDipendente";

export default function DipendentiNova() {
  const [dipendenti, setDipendenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDipendente, setSelectedDipendente] = useState(null);
  const [filiali, setFiliali] = useState([]);
  const [loadingFiliali, setLoadingFiliali] = useState(false);

  useEffect(() => {
    const fetchDipendenti = async () => {
      try {
        const response = await fetch("/api/dipendenti?divisione=nova");
        if (!response.ok) {
          throw new Error(`Errore durante il recupero dei dipendenti: ${response.status}`);
        }
        const data = await response.json();
        setDipendenti(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDipendenti();
  }, []);

  const fetchFilialiByDivisione = async (divisione) => {
    setLoadingFiliali(true);
    try {
      const response = await fetch(`/api/filiali?divisione=${divisione}`);
      if (!response.ok) throw new Error("Errore durante il recupero delle filiali");
      const data = await response.json();
      setFiliali(data);
    } catch (error) {
      setFiliali([]);
    } finally {
      setLoadingFiliali(false);
    }
  };

  useEffect(() => {
    if (editModalOpen && selectedDipendente?.divisione) {
      fetchFilialiByDivisione(selectedDipendente.divisione);
    }
  }, [editModalOpen, selectedDipendente?.divisione]);

  const handleEdit = (dipendente) => {
    setSelectedDipendente(dipendente);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updated) => {
    try {
      const id = selectedDipendente.id || selectedDipendente._id;
      const response = await fetch(`/api/dipendenti/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error("Errore durante la modifica del dipendente");
      setDipendenti((prev) =>
        prev.map((f) => (f.id === id || f._id === id ? { ...f, ...updated } : f))
      );
      setEditModalOpen(false);
      setSelectedDipendente(null);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  const handleDelete = (dipendente) => {
    setSelectedDipendente(dipendente);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = selectedDipendente.id || selectedDipendente._id;
      const response = await fetch(`/api/dipendenti/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Errore durante l'eliminazione del dipendente");
      setDipendenti((prev) => prev.filter((f) => f.id !== id && f._id !== id));
      setDeleteModalOpen(false);
      setSelectedDipendente(null);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('cognome', { header: 'Cognome' }),
    columnHelper.accessor('nome', { header: 'Nome' }),
    columnHelper.accessor('filiale_nome', { header: 'Filiale' }),
    columnHelper.accessor('mansione', { header: 'Mansione' }),
    columnHelper.accessor('divisione', { header: 'Divisione' }),
  ];

  const table = useReactTable({
    data: dipendenti,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="table-container" style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '200px', border: 'none' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Lista Dipendenti NOVA</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f3f4f6' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div>
                    {header.column.getCanFilter() ? (
                      <input
                        type="text"
                        value={header.column.getFilterValue() || ''}
                        onChange={e => header.column.setFilterValue(e.target.value)}
                        placeholder="Filtra..."
                        style={{ width: '90%', marginTop: 4 }}
                      />
                    ) : null}
                  </div>
                </th>
              ))}
              <th>Azioni</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {flexRender(cell.column.columnDef.cell || cell.column.columnDef.header, cell.getContext())}
                </td>
              ))}
              <td style={{ textAlign: 'center' }}>
                <IconButton color="primary" onClick={() => handleEdit(row.original)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(row.original)} size="small">
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modale modifica dipendente */}
      <EditDipendenteModal
        open={editModalOpen}
        dipendente={selectedDipendente}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
        filiali={filiali}
        loadingFiliali={loadingFiliali}
      />
      {/* Modale conferma eliminazione */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          Sei sicuro di voler eliminare il dipendente <b>{selectedDipendente?.nome} {selectedDipendente?.cognome}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Annulla</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Elimina</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}