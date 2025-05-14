import React, { useEffect, useState } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import "./DipendentiLogiMantine.css";

export default function DipendentiLogi() {
  const [dipendenti, setDipendenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ id: '', cognome: '', mansione: '', filiale_nome: '' });

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value || '', // Assicurati che il valore sia sempre una stringa
    }));
  };

  useEffect(() => {
    const fetchDipendenti = async () => {
      try {
        const response = await fetch("/api/dipendenti?divisione=logi");
        if (!response.ok) {
          throw new Error(`Errore durante il recupero dei dipendenti: ${response.status}`);
        }
        const data = await response.json();
        setDipendenti(data || []);
      } catch (err) {
        console.error("Errore durante la chiamata API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDipendenti();
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('nome', {
      header: 'Nome',
    }),
    columnHelper.accessor('cognome', {
      header: 'Cognome',
    }),
    columnHelper.accessor('mansione', {
      header: 'Mansione',
    }),
    columnHelper.accessor('filiale_nome', {
      header: 'Filiale',
    }),
  ];

  const filteredData = dipendenti.filter(dipendente =>
    (!filters.id || dipendente.id.toString().includes(filters.id)) &&
    (!filters.cognome || dipendente.cognome.toLowerCase().includes(filters.cognome.toLowerCase())) &&
    (!filters.mansione || dipendente.mansione.toLowerCase().includes(filters.mansione.toLowerCase())) &&
    (!filters.filiale_nome || dipendente.filiale_nome.toLowerCase().includes(filters.filiale_nome.toLowerCase()))
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  return (
    <div className="table-container" style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '200px', border: 'none' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Lista Dipendenti LOGI</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtra per ID"
          value={filters.id}
          onChange={(e) => handleFilterChange('id', e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Filtra per Cognome"
          value={filters.cognome}
          onChange={(e) => handleFilterChange('cognome', e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Filtra per Mansione"
          value={filters.mansione}
          onChange={(e) => handleFilterChange('mansione', e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Filtra per Filiale"
          value={filters.filiale_nome}
          onChange={(e) => handleFilterChange('filiale_nome', e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f3f4f6' }}>
                  {header.column.columnDef.header}
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
                  {cell.getValue()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}