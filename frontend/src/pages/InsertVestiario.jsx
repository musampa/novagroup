import React, { useState } from "react";
import { inserisciMagazzino } from "../api";

const InsertVestiario = () => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ tipo: "", taglia: "", quantita: 1, divisione: "" });

  const categories = {
    Giaccone: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Felpa: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Maglia: ["XXXL", "XXL", "XL", "L", "M", "S"],
    Pantaloni: Array.from({ length: 29 }, (_, i) => (40 + i).toString()),
    Scarpe: Array.from({ length: 11 }, (_, i) => (37 + i).toString()),
    Fratino: ["Taglia unica"],
    Bretelle: ["Taglia unica"],
    Portabadge: ["Taglia unica"],
  };

  const handleAddItem = () => {
if (!currentItem.divisione) {
      alert("Seleziona una divisione prima di aggiungere l'articolo.");
      return;
    }
    setItems([...items, currentItem]);
    setCurrentItem({ tipo: "", taglia: "", quantita: 1, divisione: "" });
  };

  const handleSubmit = async () => {
    try {
      await inserisciMagazzino(items);
      alert("Dati inviati con successo al magazzino!");
    setItems([]);
} catch (error) {
      alert("Errore durante l'invio dei dati al magazzino.");
    }
  };

  return (
    <div>
      <h1>Inserisci Vestiario</h1>
      <div>
        <label>
          Tipo:
          <select
            value={currentItem.tipo}
            onChange={(e) => setCurrentItem({ ...currentItem, tipo: e.target.value, taglia: "" })}
          >
            <option value="">Seleziona un tipo</option>
            {Object.keys(categories).map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>
      </div>
      {currentItem.tipo && (
        <div>
          <label>
            Taglia:
            <select
              value={currentItem.taglia}
              onChange={(e) => setCurrentItem({ ...currentItem, taglia: e.target.value })}
            >
              <option value="">Seleziona una taglia</option>
              {categories[currentItem.tipo].map((taglia) => (
                <option key={taglia} value={taglia}>
                  {taglia}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
<div>
        <label>
          Divisione:
          <select
            value={currentItem.divisione}
            onChange={(e) => setCurrentItem({ ...currentItem, divisione: e.target.value })}
          >
            <option value="">Seleziona una divisione</option>
            <option value="logi">Logi</option>
            <option value="nova">Nova</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Quantità:
          <input
            type="number"
            min="1"
            value={currentItem.quantita}
            onChange={(e) => setCurrentItem({ ...currentItem, quantita: parseInt(e.target.value, 10) })}
          />
        </label>
      </div>
      <button onClick={handleAddItem}>Aggiungi</button>
      <div>
        <h2>Articoli da inserire:</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.tipo} - {item.taglia} - {item.quantita} - {item.divisione}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>Invia al Magazzino</button>
    </div>
  );
};

export default InsertVestiario;