import React, { useEffect, useState } from "react";

export default function AssegnazioniVestiario() {
  const [assegnazioni, setAssegnazioni] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAssegnazioni();
  }, []);

  const fetchAssegnazioni = async () => {
    try {
      const response = await fetch("/vestiario_assegnato");
      if (!response.ok) throw new Error("Errore durante il recupero delle assegnazioni");
      const data = await response.json();
      setAssegnazioni(data);
    } catch (error) {
      console.error("Errore:", error);
      setErrorMessage("Impossibile recuperare le assegnazioni.");
    }
  };

  return (
    <div className="assegnazioni-vestiario-container">
      <h1>Assegnazioni Vestiario</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>FILIALE</th>
            <th>TIPO</th>
            <th>TAGLIA</th>
            <th>QUANTITÀ</th>
            <th>DATA DI ASSEGNAZIONE</th>
          </tr>
        </thead>
        <tbody>
          {assegnazioni.length > 0 ? (
            assegnazioni.map((assegnazione, index) => (
              <tr key={index}>
                <td>{assegnazione.filiale}</td>
                <td>{assegnazione.tipo}</td>
                <td>{assegnazione.taglia}</td>
                <td>{assegnazione.quantita}</td>
                <td>{new Date(assegnazione.data).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nessuna assegnazione trovata.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
