import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import './AssegnazioniVestiario.css';

export default function AssegnazioniVestiario() {
  const [assegnazioni, setAssegnazioni] = useState([]);
  const [filiali, setFiliali] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchAssegnazioni(), fetchFiliali()]);
    setLoading(false);
  };

  const fetchAssegnazioni = async () => {
    try {
      const response = await fetch("/vestiario_assegnato");
      if (!response.ok) throw new Error("Errore durante il recupero delle assegnazioni");
      const data = await response.json();
      setAssegnazioni(data);
    } catch (error) {
      setErrorMessage("Impossibile recuperare le assegnazioni.");
    }
  };

  const fetchFiliali = async () => {
    try {
      const [nova, logi] = await Promise.all([
        fetch("/api/filiali/nova").then(r => r.json()),
        fetch("/api/filiali/logi").then(r => r.json())
      ]);
      setFiliali([...nova, ...logi]);
    } catch (error) {
      setFiliali([]);
    }
  };

  // Cerca il nome della filiale (filiale_nome) dato l'id
  const getNomeFiliale = (id) => {
    const f = filiali.find(f => String(f.id || f._id || f.filiale_id) === String(id));
    return f ? (f.filiale_nome || f.filiale_cantiere || f.nome || '-') : '-';
  };

  const handleDelete = async (assegnazione) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa assegnazione?")) return;
    try {
      const response = await fetch(`/api/magazzino/vestiario_assegnato/${assegnazione._id || assegnazione.id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: assegnazione.tipo,
          taglia: assegnazione.taglia,
          quantita: assegnazione.quantita,
          divisione: assegnazione.divisione
        })
      });
      if (!response.ok) throw new Error("Errore durante la cancellazione");
      await fetchAll();
    } catch (error) {
      setErrorMessage("Errore durante la cancellazione dell'assegnazione.");
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#51cbce', marginBottom: 24, textAlign: 'center', fontWeight: 700, letterSpacing: 1 }}>Assegnazioni Vestiario</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading ? <p>Caricamento...</p> : (
        <table className="interactive-table">
          <thead>
            <tr>
              <th>Filiale</th>
              <th>Tipo</th>
              <th>Taglia</th>
              <th>Quantità</th>
              <th>Data di assegnazione</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {assegnazioni.length > 0 ? (
              assegnazioni.map((assegnazione, index) => (
                <tr key={index}>
                  <td>{getNomeFiliale(assegnazione.filiale)}</td>
                  <td>{assegnazione.tipo}</td>
                  <td>{assegnazione.taglia}</td>
                  <td>{assegnazione.quantita}</td>
                  <td>{new Date(assegnazione.dataAssegnazione || assegnazione.data).toLocaleDateString()}</td>
                  <td>
                    <Button color="error" size="small" onClick={() => handleDelete(assegnazione)} style={{ minWidth: 0, padding: 4 }}>
                      <DeleteIcon />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nessuna assegnazione trovata.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
