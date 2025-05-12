import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VestiarioAssegnato = () => {
  const [assegnazioni, setAssegnazioni] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:5000/vestiario-assegnato')
      .then(response => {
        setAssegnazioni(response.data);
      })
      .catch(error => {
        console.error('Errore durante il recupero delle assegnazioni:', error);
      });
  }, []);

  return (
    <div>
      <h1>Vestiario Assegnato</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Taglia</th>
            <th>Quantità</th>
            <th>Divisione</th>
            <th>Filiale</th>
            <th>Data Assegnazione</th>
          </tr>
        </thead>
        <tbody>
          {assegnazioni.map((assegnazione, index) => (
            <tr key={index}>
              <td>{assegnazione.tipo}</td>
              <td>{assegnazione.taglia}</td>
              <td>{assegnazione.quantita}</td>
              <td>{assegnazione.divisione}</td>
              <td>{assegnazione.filiale}</td>
              <td>{new Date(assegnazione.dataAssegnazione).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VestiarioAssegnato;
