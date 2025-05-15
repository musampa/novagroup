import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function EditFilialeModal({ open, filiale, onClose, onSave }) {
  const [form, setForm] = useState(filiale || {});

  React.useEffect(() => {
    setForm(filiale || {});
  }, [filiale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Filiale</DialogTitle>
      <DialogContent>
        <label style={{ display: 'block', marginTop: 8, marginBottom: 8 }}>
          Divisione:
          <select
            name="divisione"
            value={form.divisione || "nova"}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="nova">NOVA</option>
            <option value="logi">LOGI</option>
          </select>
        </label>
        <TextField
          margin="dense"
          label="ID"
          name="filiale_id"
          value={form.filiale_id || ""}
          onChange={handleChange}
          fullWidth
          disabled
        />
        <TextField
          margin="dense"
          label="Nome"
          name="filiale_nome"
          value={form.filiale_nome || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Cantiere"
          name="filiale_cantiere"
          value={form.filiale_cantiere || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Indirizzo"
          name="filiale_indirizzo"
          value={form.filiale_indirizzo || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Città"
          name="filiale_citta"
          value={form.filiale_citta || ""}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={handleSave} variant="contained">Salva</Button>
      </DialogActions>
    </Dialog>
  );
}
