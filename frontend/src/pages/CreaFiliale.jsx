import React, { useState } from "react";

export default function CreaFiliale({ onCreate }) {
  const [formData, setFormData] = useState({
    filiale_id: "",
    filiale_nome: "",
    filiale_indirizzo: "",
    filiale_citta: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/filiali/nova`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Errore durante la creazione della filiale");
      }
      const newFiliale = await response.json();
      onCreate(newFiliale);
      setFormData({ filiale_id: "", filiale_nome: "", filiale_indirizzo: "", filiale_citta: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-creation">
        <label>
          ID:
          <input
            type="text"
            name="filiale_id"
            value={formData.filiale_id}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nome:
          <input
            type="text"
            name="filiale_nome"
            value={formData.filiale_nome}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Indirizzo:
          <input
            type="text"
            name="filiale_indirizzo"
            value={formData.filiale_indirizzo}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Città:
          <input
            type="text"
            name="filiale_citta"
            value={formData.filiale_citta}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Crea Filiale</button>
      </form>
    </div>
  );
}