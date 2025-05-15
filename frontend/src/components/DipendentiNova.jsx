import React, { useEffect, useState } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import "./DipendentiNova.css";

export default function DipendentiNova() {
  const [dipendenti, setDipendenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    const fetchDipendenti = async () => {
      try {
        const response = await fetch("/api/dipendenti?divisione=nova");
        if (!response.ok) {
          throw new Error(`Errore durante il recupero dei dipendenti: ${response.status}`);
        }
        const data = await response.json();
        setDipendenti(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDipendenti();
  }, []);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('cognome', { header: 'Cognome' }),
    columnHelper.accessor('nome', { header: 'Nome' }),
    columnHelper.accessor('filiale_nome', { header: 'Filiale' }),
    columnHelper.accessor('mansione', { header: 'Mansione' }),
    columnHelper.accessor('divisione', { header: 'Divisione' }),
  ];

  const table = useReactTable({
    data: dipendenti,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="table-container" style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '200px', border: 'none' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Lista Dipendenti NOVA</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f3f4f6' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div>
                    {header.column.getCanFilter() ? (
                      <input
                        type="text"
                        value={header.column.getFilterValue() || ''}
                        onChange={e => header.column.setFilterValue(e.target.value)}
                        placeholder={`Filtra...`}
                        style={{ width: '90%', marginTop: 4 }}
                      />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {flexRender(cell.column.columnDef.cell || cell.column.columnDef.header, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}