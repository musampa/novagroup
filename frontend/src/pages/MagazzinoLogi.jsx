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
      { Header: "Tipo", accessor: "tipo", Filter: ColumnFilter },
      { Header: "Taglia", accessor: "taglia", Filter: ColumnFilter },
      { Header: "Quantità", accessor: "quantita", Filter: ColumnFilter },
      { Header: "Data Inserimento", accessor: "dataInserimento", Filter: ColumnFilter, Cell: ({ value }) => {
          try {
            return value ? new Date(value).toLocaleDateString() : "N/A";
          } catch {
            return "Data non valida";
          }
        } },
    ],
    []
  );

  function ColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <input
        value={filterValue || ''}
        onChange={e => setFilter(e.target.value || undefined)}
        placeholder="Filtra..."
        style={{ width: '90%', marginTop: 4 }}
      />
    );
  }

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
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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
