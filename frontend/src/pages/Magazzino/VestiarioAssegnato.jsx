import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from "react-table";
import "../DipendentiLogi.css"; // Importa lo stile della tabella

const VestiarioAssegnato = () => {
  const [assegnazioni, setAssegnazioni] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:5000/api/magazzino/vestiario_assegnato')
      .then(response => {
        setAssegnazioni(response.data);
      })
      .catch(error => {
        console.error('Errore durante il recupero delle assegnazioni:', error);
      });
  }, []);

  const memoizedColumns = useMemo(() => [
    { Header: "Tipo", accessor: "tipo" },
    { Header: "Taglia", accessor: "taglia" },
    { Header: "Quantità", accessor: "quantita" },
    { Header: "Divisione", accessor: "divisione" },
    { Header: "Filiale", accessor: "filiale" },
    { Header: "Data Assegnazione", accessor: "dataAssegnazione" },
  ], []);

  const memoizedData = useMemo(() => assegnazioni, [assegnazioni]);

  console.log("Dati assegnazioni:", memoizedData);
  console.log("Colonne tabella:", memoizedColumns);

  const tableInstance = useTable({ columns: memoizedColumns, data: memoizedData }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  if (assegnazioni.length === 0) {
    return <p>Nessuna assegnazione trovata.</p>;
  }

  return (
    <div className="table-container">
      <h1>Vestiario Assegnato</h1>
      <table {...getTableProps()} className="interactive-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    {cell.column.id === "dataAssegnazione"
                      ? new Date(cell.value).toLocaleDateString('it-IT')
                      : cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VestiarioAssegnato;
