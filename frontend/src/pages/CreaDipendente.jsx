import React, { useState, useEffect } from "react";
import "./CreaDipendente.css"; // Stile per il modulo
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';

const CreaDipendente = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { cognome, nome, mansione, divisione, filiale } = formData;
    if (!cognome || !nome || !mansione || !divisione || !filiale) {
        alert("Tutti i campi sono obbligatori!");
        return;
    }

    try {
        // Invia i dati al backend
        const response = await fetch("/api/dipendenti", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cognome,
                nome,
                mansione,
                divisione,
                filiale_id: filiale, // Usa il campo corretto
            }),
        });

        if (!response.ok) {
            throw new Error("Errore durante la creazione del dipendente");
        }

        const data = await response.json();
        console.log("Dipendente creato con successo:", data);
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
    } catch (error) {
        console.error("Errore:", error.message);
        alert("Errore durante la creazione del dipendente");
    }
};

  return (
    <div className="form-wrapper">
      <h2 style={{ textTransform: 'uppercase', fontSize: 32, letterSpacing: 1, fontWeight: 700, color: '#fff', marginBottom: 24, textAlign: 'center' }}>Crea Dipendente</h2>
      <form onSubmit={handleSubmit} className="form-creation" style={{ background: '#232526', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px #0002', color: '#fff', maxWidth: 420, margin: '0 auto', border: 'none' }}>
        <TextField
          label="Cognome"
          name="cognome"
          value={formData.cognome}
          onChange={handleInputChange}
          required
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <TextField
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Mansione</InputLabel>
          <Select
            name="mansione"
            value={formData.mansione}
            onChange={handleInputChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Mansione"
            displayEmpty
          >
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            <MenuItem value="Facchino">Facchino</MenuItem>
            <MenuItem value="Carrellista">Carrellista</MenuItem>
            <MenuItem value="Impiegato">Impiegato</MenuItem>
            <MenuItem value="Responsabile di cantiere">Responsabile di cantiere</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Divisione</InputLabel>
          <Select
            name="divisione"
            value={formData.divisione}
            onChange={handleDivisioneChange}
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
            onChange={handleInputChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Filiale"
            displayEmpty
            disabled={!formData.divisione || loadingFiliali}
          >
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            {filiali.map((filiale) => (
              <MenuItem key={filiale.id_filiale} value={filiale.id_filiale}>
                {filiale.filiale_cantiere}
              </MenuItem>
            ))}
          </Select>
          {loadingFiliali && <CircularProgress size={18} sx={{ color: '#51cbce', ml: 2 }} />}
        </FormControl>
        <button type="submit" style={{ background: '#51cbce', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 600, fontSize: 16, marginTop: 8 }}>Crea Dipendente</button>
      </form>
    </div>
  );
};

export default CreaDipendente;