import React from "react";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cognome</th>
          <th>Nome</th>
          <th>Mansione</th>
          <th>Filiale</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.cognome}</td>
            <td>{employee.nome}</td>
            <td>{employee.mansione}</td>
            <td>{employee.filiale_name}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(employee)}>Modifica</button>
              <button className="delete-btn" onClick={() => onDelete(employee.id)}>Elimina</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}