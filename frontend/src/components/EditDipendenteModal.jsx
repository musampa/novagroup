import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
      <DialogTitle>Modifica Dipendente</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Cognome"
          name="cognome"
          value={form.cognome || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Nome"
          name="nome"
          value={form.nome || ""}
          onChange={handleChange}
          fullWidth
        />
        <label style={{ display: 'block', marginTop: 8, marginBottom: 8 }}>
          Mansione:
          <select
            name="mansione"
            value={form.mansione || ""}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Seleziona...</option>
            <option value="Facchino">Facchino</option>
            <option value="Carrellista">Carrellista</option>
            <option value="Impiegato">Impiegato</option>
            <option value="Responsabile di cantiere">Responsabile di cantiere</option>
          </select>
        </label>
        <label style={{ display: 'block', marginTop: 8, marginBottom: 8 }}>
          Divisione:
          <select
            name="divisione"
            value={form.divisione || ""}
            onChange={handleDivisioneChange}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Seleziona...</option>
            <option value="logi">Logi</option>
            <option value="nova">Nova</option>
          </select>
        </label>
        <label style={{ display: 'block', marginTop: 8, marginBottom: 8 }}>
          Filiale:
          <select
            name="filiale_id"
            value={form.filiale_id || ""}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
            disabled={!form.divisione || loadingFiliali}
          >
            <option value="">Seleziona...</option>
            {filiali && filiali.map((filiale) => (
              <option key={filiale.id_filiale || filiale.filiale_id || filiale._id} value={filiale.id_filiale || filiale.filiale_id || filiale._id}>
                {filiale.filiale_cantiere || filiale.nome || filiale.filiale_nome}
              </option>
            ))}
          </select>
          {loadingFiliali && <p>Caricamento filiali...</p>}
        </label>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={handleSave} variant="contained">Salva</Button>
      </DialogActions>
    </Dialog>
  );
}
