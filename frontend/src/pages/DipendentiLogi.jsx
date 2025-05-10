import React, { useEffect, useState } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import "./DipendentiLogi.css"; // Assicurati che il file CSS sia presente
import EmployeeTable from "../components/EmployeeTable";

// Componente per il filtro nella colonna
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)} // Imposta undefined per rimuovere il filtro
      placeholder={`Filtra...`}
      style={{
        width: "100%",
        padding: "5px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    />
  );
}

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
        console.log("Dati ricevuti dal backend:", data);
        setDipendenti(data || []); // Imposta un array vuoto per prevenire errori
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
    console.log("Dipendenti LOGI:", dipendenti);
  }, [dipendenti]);

  const handleEdit = (dipendente) => {
    console.log("Modifica dipendente:", dipendente);
    // Implementa la logica di modifica qui
  };

  const handleDelete = (id) => {
    console.log("Elimina dipendente con ID:", id);
    // Implementa la logica di eliminazione qui
  };

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  console.log("Dipendenti trovati:", dipendenti);

  return (
    <div className="table-container">
      <h1>Lista Dipendenti LOGI</h1>
      {dipendenti.length === 0 ? (
        <p>Nessun dipendente trovato.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Filiale</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {dipendenti.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.nome}</td>
                <td>{employee.cognome}</td>
                <td>{employee.filiale_nome || "Sconosciuta"}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Modifica</button>
                  <button onClick={() => handleDelete(employee.id)}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}