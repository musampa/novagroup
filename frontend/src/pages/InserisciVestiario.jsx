import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function InserisciVestiario() {
  const [formData, setFormData] = useState([{ tipo: "", taglia: "", quantita: 1, divisione: "" }]);

  const categorie = [
    "Giaccone", "Felpa", "Maglia", "Pantaloni", "Scarpe", "Fratino", "Bretelle", "Portabadge", "Guanti"
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
    Guanti: ["8", "9", "10"]
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
      const response = await fetch("/api/magazzino/inserisci-vestiario", {
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
    <div className="form-wrapper">
      <h2 style={{ textTransform: 'uppercase', fontSize: 32, letterSpacing: 1, fontWeight: 700, color: '#fff', marginBottom: 24, textAlign: 'center' }}>Inserisci Vestiario</h2>
      <form onSubmit={handleSubmit} className="form-creation" style={{ background: '#232526', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px #0002', color: '#fff', maxWidth: 520, margin: '0 auto', border: 'none' }}>
        {formData.map((row, index) => (
          <div key={index} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <FormControl variant="standard" sx={{ minWidth: 120, flex: 1 }}>
              <InputLabel shrink style={{ color: '#51cbce' }}>Divisione</InputLabel>
              <Select
                name="divisione"
                value={row.divisione}
                onChange={e => handleChange(index, e)}
                required
                sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
                label="Divisione"
                displayEmpty
              >
                <MenuItem value=""><em>Seleziona...</em></MenuItem>
                <MenuItem value="logi">Logi</MenuItem>
                <MenuItem value="nova">Nova</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ minWidth: 120, flex: 1 }}>
              <InputLabel shrink style={{ color: '#51cbce' }}>Tipo</InputLabel>
              <Select
                name="tipo"
                value={row.tipo}
                onChange={e => handleChange(index, e)}
                required
                sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
                label="Tipo"
                displayEmpty
              >
                <MenuItem value=""><em>Seleziona...</em></MenuItem>
                {categorie.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ minWidth: 120, flex: 1 }}>
              <InputLabel shrink style={{ color: '#51cbce' }}>Taglia</InputLabel>
              <Select
                name="taglia"
                value={row.taglia}
                onChange={e => handleChange(index, e)}
                required
                sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
                label="Taglia"
                displayEmpty
                disabled={!row.tipo}
              >
                <MenuItem value=""><em>Seleziona...</em></MenuItem>
                {row.tipo && taglie[row.tipo].map((taglia) => (
                  <MenuItem key={taglia} value={taglia}>{taglia}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantità"
              name="quantita"
              type="number"
              value={row.quantita}
              onChange={e => handleChange(index, e)}
              required
              variant="standard"
              InputLabelProps={{ shrink: true }}
              sx={{ width: 90, input: { color: '#fff' }, label: { color: '#51cbce' } }}
              inputProps={{ min: 1 }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <button type="button" onClick={addRow} style={{ background: '#51cbce', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15 }}>Aggiungi riga</button>
        </div>
        <button type="submit" style={{ background: '#51cbce', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 600, fontSize: 16, marginTop: 8 }}>Inserisci</button>
      </form>
    </div>
  );
}
