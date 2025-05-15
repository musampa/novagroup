import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function CreaFiliale({ onCreate }) {
  const [formData, setFormData] = useState({
    filiale_nome: "",
    filiale_indirizzo: "",
    filiale_citta: "",
    divisione: "nova"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `/api/filiali/${formData.divisione}`;
      const { divisione, ...dataToSend } = formData;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error("Errore durante la creazione della filiale");
      }
      const newFiliale = await response.json();
      onCreate(newFiliale);
      setFormData({ filiale_nome: "", filiale_indirizzo: "", filiale_citta: "", divisione: "nova" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-wrapper">
      <h2 style={{ textTransform: 'uppercase', fontSize: 32, letterSpacing: 1, fontWeight: 700, color: '#fff', marginBottom: 24, textAlign: 'center' }}>Crea Filiale</h2>
      <form onSubmit={handleSubmit} className="form-creation" style={{ background: '#232526', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px #0002', color: '#fff', maxWidth: 420, margin: '0 auto', border: 'none' }}>
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Divisione</InputLabel>
          <Select
            name="divisione"
            value={formData.divisione}
            onChange={handleChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Divisione"
            displayEmpty
          >
            <MenuItem value="nova">NOVA</MenuItem>
            <MenuItem value="logi">LOGI</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Nome"
          name="filiale_nome"
          value={formData.filiale_nome}
          onChange={handleChange}
          required
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <TextField
          label="Indirizzo"
          name="filiale_indirizzo"
          value={formData.filiale_indirizzo}
          onChange={handleChange}
          required
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <TextField
          label="Città"
          name="filiale_citta"
          value={formData.filiale_citta}
          onChange={handleChange}
          required
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <button type="submit" style={{ background: '#51cbce', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 600, fontSize: 16, marginTop: 8 }}>Crea Filiale</button>
      </form>
    </div>
  );
}