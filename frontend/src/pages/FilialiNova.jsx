import React, { useEffect, useState } from "react";
import "../styles/Filiali.css";

export default function FilialiNova() {
  const [filiali, setFiliali] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiliali = async () => {
      try {
        const response = await fetch("/api/filiali/nova");
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
    console.log("Modifica filiale:", filiale);
    // Implement edit logic here
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/filiali/nova/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione della filiale");
      }
      setFiliali(filiali.filter((filiale) => filiale.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="container">
      <h1>Filiali NOVA</h1>
      <table className="interactive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filiali.map((filiale) => (
            <tr key={filiale.id}>
              <td>{filiale.filiale_id}</td>
              <td>{filiale.filiale_nome}</td>
              <td>{filiale.filiale_indirizzo}</td>
              <td>{filiale.filiale_citta}</td>
              <td>
                <button className="icon-btn" onClick={() => handleEdit(filiale)}>
                  <i className="fas fa-edit" title="Modifica"></i>
                </button>
                <button className="icon-btn" onClick={() => handleDelete(filiale.id)}>
                  <i className="fas fa-trash" title="Elimina"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}