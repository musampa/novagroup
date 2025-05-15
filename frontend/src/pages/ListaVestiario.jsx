import React, { useEffect, useState } from "react";

export default function ListaVestiario() {
  const [vestiario, setVestiario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ tipo: '', taglia: '', quantita: '', data_inserimento: '' });

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

  const filteredVestiario = vestiario.filter(item =>
    (filters.tipo === '' || (item.tipo || '').toLowerCase().includes(filters.tipo.toLowerCase())) &&
    (filters.taglia === '' || (item.taglia || '').toLowerCase().includes(filters.taglia.toLowerCase())) &&
    (filters.quantita === '' || String(item.quantita || '').includes(filters.quantita)) &&
    (filters.data_inserimento === '' || (item.data_inserimento && new Date(item.data_inserimento).toLocaleDateString().includes(filters.data_inserimento)))
  );

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="vestiario-container">
      <h1>Lista Vestiario</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Filtra Tipo"
          value={filters.tipo}
          onChange={e => setFilters(f => ({ ...f, tipo: e.target.value }))}
          style={{ width: 120 }}
        />
        <input
          type="text"
          placeholder="Filtra Taglia"
          value={filters.taglia}
          onChange={e => setFilters(f => ({ ...f, taglia: e.target.value }))}
          style={{ width: 80 }}
        />
        <input
          type="text"
          placeholder="Filtra Quantità"
          value={filters.quantita}
          onChange={e => setFilters(f => ({ ...f, quantita: e.target.value }))}
          style={{ width: 80 }}
        />
        <input
          type="text"
          placeholder="Filtra Data (gg/mm/aaaa)"
          value={filters.data_inserimento}
          onChange={e => setFilters(f => ({ ...f, data_inserimento: e.target.value }))}
          style={{ width: 140 }}
        />
      </div>
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
          {filteredVestiario.map((item) => (
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
