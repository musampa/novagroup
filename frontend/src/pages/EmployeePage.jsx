import React, { useEffect, useState } from "react";
import DipendentiNova from "./DipendentiNova";

export default function EmployeePage() {
  const [dipendenti, setDipendenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Recupera i dipendenti
    const fetchDipendenti = async () => {
      try {
        const response = await fetch("/api/dipendenti?divisione=nova");
        if (!response.ok) {
          throw new Error("Errore durante il recupero dei dipendenti");
        }
        const data = await response.json();
        setDipendenti(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDipendenti();
  }, []);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div>
      <h1>Elenco Dipendenti</h1>
      <DipendentiNova dipendenti={dipendenti} />
    </div>
  );
}