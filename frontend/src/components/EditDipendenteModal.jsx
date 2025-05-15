import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function EditDipendenteModal({ open, dipendente, onClose, onSave, filiali, loadingFiliali }) {
  const [form, setForm] = useState(dipendente || {});

  useEffect(() => {
    setForm(dipendente || {});
  }, [dipendente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDivisioneChange = (e) => {
    setForm((prev) => ({ ...prev, divisione: e.target.value, filiale_id: "" }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <span style={{ textTransform: 'uppercase', fontSize: 28, letterSpacing: 1, fontWeight: 700, color: '#fff' }}>
          Modifica Dipendente
        </span>
      </DialogTitle>
      <DialogContent style={{ background: '#232526', color: '#fff', borderRadius: 10 }}>
        <TextField
          margin="dense"
          label="Cognome"
          name="cognome"
          value={form.cognome || ""}
          onChange={handleChange}
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <TextField
          margin="dense"
          label="Nome"
          name="nome"
          value={form.nome || ""}
          onChange={handleChange}
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#51cbce' } }}
        />
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink style={{ color: '#51cbce' }}>Mansione</InputLabel>
          <Select
            name="mansione"
            value={form.mansione || ""}
            onChange={handleChange}
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
            value={form.divisione || ""}
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
            name="filiale_id"
            value={form.filiale_id || ""}
            onChange={handleChange}
            required
            sx={{ color: '#fff', '.MuiSelect-icon': { color: '#51cbce' } }}
            label="Filiale"
            displayEmpty
            disabled={!form.divisione || loadingFiliali}
          >
            <MenuItem value=""><em>Seleziona...</em></MenuItem>
            {filiali && filiali.map((filiale) => (
              <MenuItem key={filiale.id_filiale || filiale.filiale_id || filiale._id} value={filiale.id_filiale || filiale.filiale_id || filiale._id}>
                {filiale.filiale_cantiere || filiale.nome || filiale.filiale_nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {loadingFiliali && <p style={{ color: '#51cbce' }}>Caricamento filiali...</p>}
      </DialogContent>
      <DialogActions style={{ background: '#232526', borderRadius: '0 0 10px 10px' }}>
        <Button onClick={onClose} style={{ color: '#fff' }}>Annulla</Button>
        <Button onClick={handleSave} variant="contained" style={{ background: '#51cbce', color: '#fff' }}>Salva</Button>
      </DialogActions>
    </Dialog>
  );
}
