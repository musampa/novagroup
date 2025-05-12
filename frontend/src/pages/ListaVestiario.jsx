import React, { useEffect, useState } from "react";

export default function ListaVestiario() {
  const [vestiario, setVestiario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVestiario = async () => {
      try {
        const response = await fetch("/api/vestiario/lista");
        if (!response.ok) {
          throw new Error("Errore durante il recupero della lista del vestiario");
        }
        const data = await response.json();
        setVestiario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVestiario();
  }, []);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="vestiario-container">
      <h1>Lista Vestiario</h1>
      <table className="vestiario-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Taglia</th>
            <th>Quantità</th>
            <th>Data Inserimento</th>
          </tr>
        </thead>
        <tbody>
          {vestiario.map((item) => (
            <tr key={item.id}>
              <td>{item.tipo}</td>
              <td>{item.taglia}</td>
              <td>{item.quantita}</td>
              <td>{new Date(item.data_inserimento).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
