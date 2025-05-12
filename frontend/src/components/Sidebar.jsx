import React from "react";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export default function Sidebar({ onMenuSelect }) {
  return (
    <div style={{ height: "calc(100vh - 60px)", width: "250px", background: "#f4f4f4", marginTop: "60px" }}>
      <Navigation
        activeItemId="/dashboard"
        onSelect={({ itemId }) => onMenuSelect(itemId)} // Passa solo itemId alla funzione onMenuSelect
        items={[
          {
            title: "Dipendenti",
            itemId: "/dipendenti",
            subNav: [
              { title: "Lista Dipendenti NOVA", itemId: "/dipendenti/nova" },
              { title: "Lista Dipendenti LOGI", itemId: "/dipendenti/logi" },
              { title: "Crea Dipendenti", itemId: "/dipendenti/crea" },
              { title: "Modifica Dipendenti", itemId: "/dipendenti/modifica" },
              { title: "Elimina Dipendenti", itemId: "/dipendenti/elimina" },
            ],
          },
          {
            title: "Filiali",
            itemId: "/filiali",
            subNav: [
              { title: "Lista Filiali NOVA", itemId: "/filiali/nova" },
              { title: "Lista Filiali LOGI", itemId: "/filiali/logi" },
              { title: "Crea Filiale", itemId: "/filiali/crea" },
              { title: "Modifica Filiale", itemId: "/filiali/modifica" },
              { title: "Elimina Filiale", itemId: "/filiali/elimina" },
            ],
          },
          {
            title: "Magazzino",
            itemId: "/magazzino",
            subNav: [
              { title: "Magazzino Logi", itemId: "/magazzino/logi" },
              { title: "Magazzino Nova", itemId: "/magazzino/nova" },
              { title: "Inserisci Vestiario", itemId: "/magazzino/inserisci" },
              { title: "Assegna Vestiario", itemId: "/magazzino/assegna" },
              { title: "Vestiario Assegnato", itemId: "/magazzino/vestiario-assegnato" },
            ],
            action: "openSubmenuOnly", // Aggiunto per evitare di mostrare dati
          },
          {
            title: "Mezzi",
            itemId: "/mezzi",
            subNav: [
              { title: "Visualizza Mezzi NOVA", itemId: "/mezzi/nova" },
              { title: "Visualizza Mezzi LOGI", itemId: "/mezzi/logi" },
              { title: "Crea Mezzo", itemId: "/mezzi/crea" },
              { title: "Modifica Mezzo", itemId: "/mezzi/modifica" },
              { title: "Cancella Mezzo", itemId: "/mezzi/cancella" },
            ],
          },
        ]}
      />
    </div>
  );
}