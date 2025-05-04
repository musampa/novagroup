import React, { useState, useEffect } from "react";
import "./CreaDipendente.css"; // Stile per il modulo

export default function CreaDipendente() {
  const [formData, setFormData] = useState({
    cognome: "",
    nome: "",
    mansione: "",
    divisione: "",
    filiale: "",
  });

  const [filiali, setFiliali] = useState([]);
  const [loadingFiliali, setLoadingFiliali] = useState(false);

  const handleDivisioneChange = async (event) => {
    const divisioneSelezionata = event.target.value;

    setFormData({ ...formData, divisione: divisioneSelezionata, filiale: "" });

    if (!divisioneSelezionata) {
      setFiliali([]);
      return;
    }

    // Recupera le filiali dal backend per la divisione selezionata
    setLoadingFiliali(true);
    try {
      const response = await fetch(`/api/filiali?divisione=${divisioneSelezionata}`);
      if (!response.ok) {
        throw new Error("Errore durante il recupero delle filiali");
      }
      const data = await response.json();
      setFiliali(data); // Imposta le filiali nel menu a tendina
    } catch (error) {
      console.error("Errore:", error.message);
      setFiliali([]);
    } finally {
      setLoadingFiliali(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validazione dei campi obbligatori
    const { cognome, nome, mansione, divisione, filiale } = formData;
    if (!cognome || !nome || !mansione || !divisione || !filiale) {
      alert("Tutti i campi sono obbligatori!");
      return;
    }

    // Invia i dati al backend
    console.log("Form inviato con i seguenti dati:", formData);
    alert("Dipendente creato con successo!");

    // Reset del modulo
    setFormData({
      cognome: "",
      nome: "",
      mansione: "",
      divisione: "",
      filiale: "",
    });
    setFiliali([]);
  };

  return (
    <div className="form-wrapper">
      <h2>Crea Dipendente</h2>
      <form onSubmit={handleSubmit} className="form-creation">
        <div className="form-group">
          <label>Cognome:</label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mansione:</label>
          <select
            name="mansione"
            value={formData.mansione}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleziona...</option>
            <option value="Facchino">Facchino</option>
            <option value="Carrellista">Carrellista</option>
            <option value="Impiegato">Impiegato</option>
            <option value="Responsabile di cantiere">Responsabile di cantiere</option>
          </select>
        </div>
        <div className="form-group">
          <label>Divisione:</label>
          <select
            name="divisione"
            value={formData.divisione}
            onChange={handleDivisioneChange}
            required
          >
            <option value="">Seleziona...</option>
            <option value="logi">Logi</option>
            <option value="nova">Nova</option>
          </select>
        </div>
        <div className="form-group">
          <label>Filiale:</label>
          <select
            name="filiale"
            value={formData.filiale}
            onChange={handleInputChange}
            required
            disabled={!formData.divisione || loadingFiliali}
          >
            <option value="">Seleziona...</option>
            {filiali.map((filiale) => (
              <option key={filiale.id_filiale} value={filiale.id_filiale}>
                {filiale.filiale_cantiere}
              </option>
            ))}
          </select>
          {loadingFiliali && <p>Caricamento filiali...</p>}
        </div>
        <button type="submit">Crea Dipendente</button>
      </form>
    </div>
  );
}