import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function ConfirmDeleteModal({ open, filiale, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Conferma eliminazione</DialogTitle>
      <DialogContent>
        Sei sicuro di voler eliminare la filiale <b>{filiale?.filiale_cantiere || filiale?.filiale_nome}</b>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Elimina</Button>
      </DialogActions>
    </Dialog>
  );
}
