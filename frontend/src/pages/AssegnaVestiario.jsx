import React, { useState, useEffect } from "react";

export default function AssegnaVestiario() {
  const [formData, setFormData] = useState({
    divisione: "",
    filiale: "",
    tipo: "",
    taglia: "",
    quantita: 1,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filiali, setFiliali] = useState([]);
  const [tipiDisponibili, setTipiDisponibili] = useState([]);
  const [taglieDisponibili, setTaglieDisponibili] = useState([]);
  const [quantitaDisponibili, setQuantitaDisponibili] = useState([]);

  useEffect(() => {
    if (formData.divisione) {
      fetchFiliali();
      fetchDisponibilitaMagazzino();
    } else {
      setFiliali([]);
      setTipiDisponibili([]);
      setTaglieDisponibili([]);
      setQuantitaDisponibili([]);
    }
  }, [formData.divisione]);

  useEffect(() => {
    if (formData.tipo) {
      fetchTaglieDisponibili();
    } else {
      setTaglieDisponibili([]);
    }
  }, [formData.tipo]);

  useEffect(() => {
    if (formData.taglia) {
      fetchQuantitaDisponibili();
    } else {
      setQuantitaDisponibili([]);
    }
  }, [formData.taglia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchFiliali = async () => {
    try {
      const response = await fetch(`/api/filiali?divisione=${formData.divisione}`);
      if (!response.ok) throw new Error("Errore durante il recupero delle filiali");
      const data = await response.json();
      setFiliali(data);
    } catch (error) {
      console.error("Errore:", error);
      setFiliali([]);
    }
  };

  const fetchDisponibilitaMagazzino = async () => {
    try {
      const response = await fetch(`/api/magazzino/disponibilita?divisione=${formData.divisione}`);
      if (!response.ok) throw new Error("Errore durante il recupero della disponibilità di magazzino");
      const data = await response.json();
      setTipiDisponibili([...new Set(data.map((item) => item.tipo))]);
    } catch (error) {
      console.error("Errore:", error);
      setTipiDisponibili([]);
    }
  };

  const fetchTaglieDisponibili = async () => {
    try {
      const response = await fetch(`/api/magazzino/disponibilita?divisione=${formData.divisione}&tipo=${formData.tipo}`);
      if (!response.ok) throw new Error("Errore durante il recupero delle taglie disponibili");
      const data = await response.json();
      setTaglieDisponibili([...new Set(data.map((item) => item.taglia))]);
    } catch (error) {
      console.error("Errore:", error);
      setTaglieDisponibili([]);
    }
  };

  const fetchQuantitaDisponibili = async () => {
    try {
      const response = await fetch(`/api/magazzino/disponibilita?divisione=${formData.divisione}&tipo=${formData.tipo}&taglia=${formData.taglia}`);
      if (!response.ok) throw new Error("Errore durante il recupero della quantità disponibile");
      const data = await response.json();
      setQuantitaDisponibili(data.map((item) => item.quantita));
    } catch (error) {
      console.error("Errore:", error);
      setQuantitaDisponibili([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/magazzino/assegna-vestiario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Errore durante l'assegnazione del vestiario");

      setSuccessMessage("Vestiario assegnato con successo!");
      setErrorMessage("");
      setFormData({
        divisione: "",
        filiale: "",
        tipo: "",
        taglia: "",
        quantita: 1,
      });
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="assegna-vestiario-container">
      <h1>Assegna Vestiario</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="divisione">Divisione:</label>
          <select
            id="divisione"
            name="divisione"
            value={formData.divisione}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona Divisione</option>
            <option value="logi">Logi</option>
            <option value="nova">Nova</option>
          </select>
        </div>
        <div>
          <label htmlFor="filiale">Filiale:</label>
          <select
            id="filiale"
            name="filiale"
            value={formData.filiale}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona Filiale</option>
            {filiali.map((filiale) => (
              <option key={filiale.id} value={filiale.id}>
                {filiale.filiale_nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona Tipo</option>
            {tipiDisponibili.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="taglia">Taglia:</label>
          <select
            id="taglia"
            name="taglia"
            value={formData.taglia}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona Taglia</option>
            {taglieDisponibili.map((taglia) => (
              <option key={taglia} value={taglia}>
                {taglia}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantita">Quantità:</label>
          <input
            type="number"
            id="quantita"
            name="quantita"
            value={formData.quantita}
            onChange={handleChange}
            min="1"
            max={quantitaDisponibili.reduce((acc, curr) => acc + curr, 0)}
            required
          />
          <span>
            Disponibilità residua: {quantitaDisponibili.reduce((acc, curr) => acc + curr, 0)}
          </span>
        </div>
        <button type="submit">Assegna</button>
      </form>
    </div>
  );
}
