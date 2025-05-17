import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

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
      // Trova la filiale selezionata
      const filialeObj = filiali.find(f => String(f.id || f._id || f.filiale_id || f.id_filiale) === String(formData.filiale));
      const filialePayload = filialeObj
        ? { filiale_id: filialeObj.filiale_id || filialeObj.id || filialeObj._id || filialeObj.id_filiale, filiale_nome: filialeObj.filiale_nome || filialeObj.filiale_cantiere || filialeObj.nome }
        : formData.filiale;
      const payload = { ...formData, filiale: filialePayload };
      const response = await fetch("/api/magazzino/assegna-vestiario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="form-wrapper">
      <h2 style={{ textTransform: 'uppercase', fontSize: 32, letterSpacing: 1, fontWeight: 700, color: '#fff', marginBottom: 24, textAlign: 'center' }}>Assegna Vestiario</h2>
      {successMessage && <p className="success-message" style={{ color: 'limegreen', textAlign: 'center' }}>{successMessage}</p>}
      {errorMessage && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
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
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            <MenuItem value="logi">Logi</MenuItem>
            <MenuItem value="nova">Nova</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Filiale</InputLabel>
          <Select
            name="filiale"
            value={formData.filiale}
            onChange={handleChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Filiale"
            displayEmpty
            disabled={!formData.divisione}
          >
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            {filiali.map((filiale) => (
              <MenuItem
                key={filiale.id || filiale._id || filiale.filiale_id || filiale.id_filiale}
                value={filiale.id || filiale._id || filiale.filiale_id || filiale.id_filiale}
              >
                {filiale.filiale_nome || filiale.filiale_cantiere || filiale.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Tipo</InputLabel>
          <Select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Tipo"
            displayEmpty
            disabled={!formData.divisione}
          >
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            {tipiDisponibili.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Taglia</InputLabel>
          <Select
            name="taglia"
            value={formData.taglia}
            onChange={handleChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Taglia"
            displayEmpty
            disabled={!formData.tipo}
          >
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            {taglieDisponibili.map((taglia) => (
              <MenuItem key={taglia} value={taglia}>{taglia}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Quantità"
          name="quantita"
          type="number"
          value={formData.quantita}
          onChange={handleChange}
          required
          variant="standard"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
          inputProps={{ min: 1, max: quantitaDisponibili.reduce((acc, curr) => acc + curr, 0) }}
        />
        <div style={{ color: '#51cbce', marginBottom: 12, fontSize: 15 }}>
          Disponibilità residua: {quantitaDisponibili.reduce((acc, curr) => acc + curr, 0)}
        </div>
        <Button type="submit" variant="contained" style={{ background: '#51cbce', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 16, marginTop: 8, width: '100%' }}>
          Assegna
        </Button>
      </form>
    </div>
  );
}
