import React, { useEffect, useState } from "react";
import { DataTable } from 'mantine-datatable';
import "./DipendentiLogi.css"; // Assicurati che il file CSS sia presente

export default function DipendentiLogi() {
  const [dipendenti, setDipendenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDipendenti = async () => {
      try {
        const response = await fetch("/api/dipendenti?divisione=logi");
        if (!response.ok) {
          throw new Error(`Errore durante il recupero dei dipendenti: ${response.status}`);
        }
        const data = await response.json();
        setDipendenti(data || []);
      } catch (err) {
        console.error("Errore durante la chiamata API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDipendenti();
  }, []);

  useEffect(() => {
    console.log("Dati dipendenti ricevuti:", dipendenti);
  }, [dipendenti]);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="table-container" style={{ border: '2px solid blue', padding: '20px', backgroundColor: '#f9f9f9 !important', minHeight: '200px' }}>
      <h1>Lista Dipendenti LOGI</h1>
      {console.log("Rendering DataTable con records:", dipendenti)}
      {console.log("Dati passati a DataTable:", dipendenti)}
      <DataTable
        style={{ display: 'block', width: '100%', border: '1px solid #ddd', backgroundColor: '#fff' }}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        records={dipendenti}
        columns={[
          { accessor: 'id', title: 'ID' },
          { accessor: 'nome', title: 'Nome' },
          { accessor: 'cognome', title: 'Cognome' },
          { accessor: 'mansione', title: 'Mansione' },
          { accessor: 'filiale_nome', title: 'Filiale' },
        ]}
      />
      {dipendenti.length === 0 && <p>Nessun dato disponibile per la tabella.</p>}
    </div>
  );
}