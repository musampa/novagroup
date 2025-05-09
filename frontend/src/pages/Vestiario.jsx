import React, { useState } from "react";

const Vestiario = () => {
  // Stato per memorizzare i capi da inserire
  const [capi, setCapi] = useState([
    { tipo: "", taglia: "", quantita: 1 },
  ]);

  // Opzioni per i tipi e le taglie
  const tipiVestiario = [
    "Giaccone", "Felpa", "Maglia", "Pantaloni",
    "Scarpe", "Fratino", "Bretelle", "Portabadge",
  ];

  const taglie = {
    Giaccone: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Felpa: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Maglia: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Pantaloni: Array.from({ length: 29 }, (_, i) => (40 + i).toString()), // 40-68
    Scarpe: Array.from({ length: 11 }, (_, i) => (37 + i).toString()), // 37-47
    Fratino: ["Taglia unica"],
    Bretelle: ["Taglia unica"],
    Portabadge: ["Taglia unica"],
  };

  // Aggiungi un nuovo capo
  const aggiungiCapo = () => {
    setCapi([...capi, { tipo: "", taglia: "", quantita: 1 }]);
  };

  // Aggiorna i dettagli di un capo
  const aggiornaCapo = (index, field, value) => {
    const nuoviCapi = [...capi];
    nuoviCapi[index][field] = value;
    setCapi(nuoviCapi);
  };

  // Rimuovi un capo
  const rimuoviCapo = (index) => {
    const nuoviCapi = capi.filter((_, i) => i !== index);
    setCapi(nuoviCapi);
  };

  // Invia i dati al backend
  const inviaDati = async () => {
    try {
      const response = await fetch("/api/vestiario/bulk-insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(capi),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Capi inseriti con successo!");
        setCapi([{ tipo: "", taglia: "", quantita: 1 }]);
      } else {
        alert(`Errore: ${data.error}`);
      }
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un errore durante l'inserimento.");
    }
  };

  return (
    <div>
      <h1>Inserisci Vestiario</h1>
      {capi.map((capo, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <label>
            Tipo:
            <select
              value={capo.tipo}
              onChange={(e) => aggiornaCapo(index, "tipo", e.target.value)}
            >
              <option value="">Seleziona un tipo</option>
              {tipiVestiario.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
          <label>
            Taglia:
            <select
              value={capo.taglia}
              onChange={(e) => aggiornaCapo(index, "taglia", e.target.value)}
              disabled={!capo.tipo}
            >
              <option value="">Seleziona una taglia</option>
              {capo.tipo &&
                taglie[capo.tipo].map((taglia) => (
                  <option key={taglia} value={taglia}>
                    {taglia}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Quantità:
            <input
              type="number"
              value={capo.quantita}
              onChange={(e) =>
                aggiornaCapo(index, "quantita", parseInt(e.target.value) || 1)
              }
              min="1"
            />
          </label>
          <button onClick={() => rimuoviCapo(index)}>Rimuovi</button>
        </div>
      ))}
      <button onClick={aggiungiCapo}>Aggiungi un altro capo</button>
      <button onClick={inviaDati}>Inserisci</button>
    </div>
  );
};

export default Vestiario;