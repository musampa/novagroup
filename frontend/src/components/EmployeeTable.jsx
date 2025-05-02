import React from "react";

export default function EmployeeTable({ employees }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cognome</th>
          <th>Nome</th>
          <th>Mansione</th>
          <th>Filiale</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}