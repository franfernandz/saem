import { useState } from 'react';
import type { Anexo7Data, Anexo7Row } from '../types';
import InputFieldAnexo7 from './InputFieldAnexo7';
import { computeAnexo7, validarAnexo7, updateAnexo7Row } from '../utils/macros';
import axios, { AxiosError } from 'axios';


interface Anexo7FormProps {
  data: Anexo7Data;
  setData: React.Dispatch<React.SetStateAction<Anexo7Data>>;
  onSave: (data: Anexo7Data) => void;
  onDelete: () => void;
}


export default function Anexo7Form({ data, setData, onSave, onDelete }: Anexo7FormProps) {
  const emptyRow: Anexo7Row = {
    orden: 0,
    nombreORazonSocial: "",
    cuitCuilCdi: "",
    numeroAsociado: "",
    mayoresSaldosAhorro: 0,
  };

  if (!data?.rows || data.rows.length === 0) {
  setData(prev => ({
    ...prev,
    rows: [
      {
        orden: 1,
        nombreORazonSocial: "",
        cuitCuilCdi: "",
        numeroAsociado: "",
        mayoresSaldosAhorro: 0,
      },
    ],
  }));// Evita renderizar hasta que se actualice el estado
}

  // 🔹 Estado para mostrar el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const baseEmptyRow: Anexo7Row = {
    orden: 0,
    nombreORazonSocial: "",
    cuitCuilCdi: "",
    numeroAsociado: "",
    mayoresSaldosAhorro: 0,
  };

  // Agregar fila
   const addNewRow = () => {
    if (data.rows.length >= 20) {
      alert("No se pueden agregar más de 20 filas.");
      return;
    }

    setData((prev: Anexo7Data) => ({
      ...prev,
      rows: [...prev.rows, { ...baseEmptyRow, orden: prev.rows.length + 1 }],
    }));
  };

  // Eliminar fila
 const removeRow = (index: number) => {
    setData((prev: Anexo7Data) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index),
    }));
  };

  
  // Cambiar valor de una celda
  const onChangeRow = (idx: number, field: keyof Anexo7Row, value: string | number) => {
    setData((prev: Anexo7Data) => ({
      ...prev,
      rows: prev.rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    }));
  };

  // 🔹 Modal de confirmación de borrado
  const DeleteModal: React.FC = () => {
    if (!showDeleteModal) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}>
          <h3>¿Estás seguro de borrar los datos del Anexo VII?</h3>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "20px" }}>
            <button
              onClick={() => {
                onDelete(); // 👈 Llama al handleDeleteAnexo7 (desde App.tsx)
                setShowDeleteModal(false);
              }}
              className="delete-button"
            >
              Borrar Datos
            </button>
            <button onClick={() => setShowDeleteModal(false)} className="save-button">
              Conservar Datos
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2>Anexo VII - Mayores Saldos de Ahorro</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Nombre o Razón Social</th>
              <th>CUIT/CUIL/CDI</th>
              <th>N° Asociado</th>
              <th>Mayores Saldos Ahorro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows ?? []).map((row, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center" }}>{row.orden}</td>
                <td>
                  <input
                    type="text"
                    value={row.nombreORazonSocial}
                    onChange={e => onChangeRow(idx, "nombreORazonSocial", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.cuitCuilCdi}
                    onChange={e => onChangeRow(idx, "cuitCuilCdi", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.numeroAsociado}
                    onChange={e => onChangeRow(idx, "numeroAsociado", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.mayoresSaldosAhorro}
                    onChange={e => onChangeRow(idx, "mayoresSaldosAhorro", parseFloat(e.target.value) || 0)}
                    style={{ textAlign: "right" }}
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeRow(idx)}
                    className="delete-button"
                    disabled={data.rows.length <= 1}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button onClick={addNewRow} className="modal-button">+ Agregar fila</button>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={() => onSave(data)} className="save-button">Guardar Anexo VII</button>
        <button onClick={() => setShowDeleteModal(true)} className="delete-button" style={{ marginLeft: "1rem" }}>
          Borrar datos
        </button>
      </div>
      <DeleteModal />
    </div>
  );
}
