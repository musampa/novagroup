import React, { useEffect, useState } from "react";

export default function Magazzino() {
  const [magazzinoNova, setMagazzinoNova] = useState([]);
  const [magazzinoLogi, setMagazzinoLogi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMagazzino = async () => {
      try {
        const [novaResponse, logiResponse] = await Promise.all([
          fetch("/api/magazzino/nova"),
          fetch("/api/magazzino/logi"),
        ]);

        if (!novaResponse.ok || !logiResponse.ok) {
          throw new Error("Errore durante il recupero dei dati del magazzino");
        }

        const [novaData, logiData] = await Promise.all([
          novaResponse.json(),
          logiResponse.json(),
        ]);

        setMagazzinoNova(novaData);
        setMagazzinoLogi(logiData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazzino();
  }, []);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="magazzino-container">
      <h1>Magazzino</h1>
      <p>Seleziona una delle opzioni dal menu per visualizzare i dati.</p>
    </div>
  );
}