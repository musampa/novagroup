import React, { useState } from "react";

export default function InserisciVestiario() {
  const [formData, setFormData] = useState([{ tipo: "", taglia: "", quantita: 1, divisione: "" }]);

  const categorie = [
    "Giaccone", "Felpa", "Maglia", "Pantaloni", "Scarpe", "Fratino", "Bretelle", "Portabadge"
  ];

  const taglie = {
    Giaccone: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Felpa: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Maglia: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Pantaloni: Array.from({ length: 29 }, (_, i) => (40 + i).toString()),
    Scarpe: Array.from({ length: 11 }, (_, i) => (37 + i).toString()),
    Fratino: ["Taglia unica"],
    Bretelle: ["Taglia unica"],
    Portabadge: ["Taglia unica"],
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
  };

  const addRow = () => {
    setFormData([...formData, { tipo: "", taglia: "", quantita: 1, divisione: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/magazzino/inserisci-vestiario", { // Corretto endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'inserimento del vestiario");
      }

      alert("Vestiario inserito con successo!");
      setFormData([{ tipo: "", taglia: "", quantita: 1, divisione: "" }]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="inserisci-vestiario-container">
      <h1>Inserisci Vestiario</h1>
      <form onSubmit={handleSubmit}>
        {formData.map((row, index) => (
          <div key={index} className="form-row">
            <select
              name="tipo"
              value={row.tipo}
              onChange={(e) => handleChange(index, e)}
              required
            >
              <option value="">Seleziona un tipo</option>
              {categorie.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            {row.tipo && (
              <select
                name="taglia"
                value={row.taglia}
                onChange={(e) => handleChange(index, e)}
                required
              >
                <option value="">Seleziona una taglia</option>
                {taglie[row.tipo].map((taglia) => (
                  <option key={taglia} value={taglia}>{taglia}</option>
                ))}
              </select>
            )}
            <input
              type="number"
              name="quantita"
              placeholder="Quantità"
              value={row.quantita}
              onChange={(e) => handleChange(index, e)}
              min="1"
              required
            />
            <select
              name="divisione"
              value={row.divisione}
              onChange={(e) => handleChange(index, e)}
              required
            >
              <option value="">Seleziona Divisione</option>
              <option value="logi">Logi</option>
              <option value="nova">Nova</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addRow}>Aggiungi Riga</button>
        <button type="submit">Inserisci</button>
      </form>
    </div>
  );
}
