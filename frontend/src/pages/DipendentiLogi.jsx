import React, { useEffect, useState } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import "./DipendentiLogi.css"; // Assicurati che il file CSS sia presente

// Componente per il filtro nella colonna
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)} // Imposta undefined per rimuovere il filtro
      placeholder={`Filtra...`}
      style={{
        width: "100%",
        padding: "5px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    />
  );
}

export default function DipendentiLogi() {
  const [dipendenti, setDipendenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDipendenti = async () => {
      try {
        const response = await fetch("/api/dipendenti?divisione=logi");
        if (!response.ok) {
          throw new Error(`Errore durante il recupero dei dipendenti: ${response.status}`);
        }
        const data = await response.json();
        setDipendenti(data || []); // Imposta un array vuoto per prevenire errori
      } catch (err) {
        console.error("Errore durante la chiamata API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDipendenti();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true, // Disabilita il filtro per questa colonna
      },
      {
        Header: "Nome",
        accessor: "nome",
        disableFilters: true, // Disabilita il filtro per questa colonna
      },
      {
        Header: "Cognome",
        accessor: "cognome",
        Filter: DefaultColumnFilter, // Aggiungi il filtro personalizzato
      },
      {
        Header: "Mansione",
        accessor: "mansione",
        disableFilters: true, // Disabilita il filtro per questa colonna
      },
      {
        Header: "Filiale",
        accessor: "filiale_nome",
        Filter: DefaultColumnFilter, // Aggiungi il filtro personalizzato
      },
    ],
    []
  );

  const data = React.useMemo(() => dipendenti, [dipendenti]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter, // Imposta un filtro di default
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Aggiungi la colonna di default con il filtro
    },
    useFilters, // Abilita i filtri
    useSortBy // Abilita l'ordinamento
  );

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="table-container">
      <h1>Lista Dipendenti LOGI</h1>
      {dipendenti.length === 0 ? (
        <p>Nessun dipendente trovato.</p>
      ) : (
        <table {...getTableProps()} className="interactive-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <div>{column.canFilter ? column.render("Filter") : null}</div>
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}