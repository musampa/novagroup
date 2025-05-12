import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useFilters } from "react-table";

export default function MagazzinoLogi() {
  const [magazzinoLogi, setMagazzinoLogi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMagazzinoLogi = async () => {
      try {
        const response = await fetch("/api/magazzino/logi");
        if (!response.ok) {
          throw new Error("Errore durante il recupero dei dati del magazzino Logi");
        }
        const data = await response.json();
        console.log("Dati ricevuti da /api/magazzino/logi:", data);
        setMagazzinoLogi(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazzinoLogi();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "Tipo", accessor: "tipo" },
      { Header: "Taglia", accessor: "taglia" },
      { Header: "Quantità", accessor: "quantita" },
      { Header: "Data Inserimento", accessor: "dataInserimento", Cell: ({ value }) => {
          try {
            return value ? new Date(value).toLocaleDateString() : "N/A";
          } catch {
            return "Data non valida";
          }
        } },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: magazzinoLogi }, useFilters, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="magazzino-container">
      <h1>Magazzino Logi</h1>
      <table {...getTableProps()} className="magazzino-table interactive-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td key={cell.column.id} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">Nessun dato disponibile</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
