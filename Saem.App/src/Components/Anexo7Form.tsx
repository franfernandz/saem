// src/Components/Anexo7Form.tsx

import { useState } from 'react';
import type { Anexo7Data, Anexo7Row } from '../types';
import InputFieldAnexo7 from './InputFieldAnexo7';
import { computeAnexo7, validarAnexo7, updateAnexo7Row } from '../utils/macros';

interface Anexo7FormProps {
  onSave: () => void;
  onDelete: () => void;
}

export default function Anexo7Form({ onSave, onDelete }: Anexo7FormProps) {
  const makeEmptyRow = (orden: number): Anexo7Row => ({ orden, nombreORazonSocial: '', cuitCuilCdi: '', numeroAsociado: '', mayoresSaldosAhorro: 0 });

  const [data, setData] = useState<Anexo7Data>(computeAnexo7({
    header: {
      asociacionMutual: '', domicilio: '', localidad: '', telefono: '', matricula: '', fechaArqueo: '', periodoMensual: '', mail: '', actaNumero: ''
    },
    rows: [makeEmptyRow(1)], // Solo una fila inicial
    totalMayoresSaldos: 0,
  }));

  const onChangeRow = (index: number) => (field: keyof Anexo7Row, value: string | number) => {
    setData(prev => updateAnexo7Row(prev, index, field, value));
  };

  const addNewRow = () => {
    setData(prev => {
      const newOrder = prev.rows.length + 1;
      const newRow = makeEmptyRow(newOrder);
      const newData = {
        ...prev,
        rows: [...prev.rows, newRow]
      };
      return computeAnexo7(newData);
    });
  };

  const removeRow = (index: number) => {
    // Solo permitir eliminar filas agregadas dinámicamente (índice > 0)
    if (index === 0) return;
    
    setData(prev => {
      const newRows = prev.rows.filter((_, idx) => idx !== index);
      // Reordenar los números de orden
      const reorderedRows = newRows.map((row, idx) => ({ ...row, orden: idx + 1 }));
      const newData = {
        ...prev,
        rows: reorderedRows
      };
      return computeAnexo7(newData);
    });
  };

  const handleSave = () => {
    const errores = validarAnexo7(data);
    if (errores.length) {
      alert('Corrija los errores:\n' + errores.join('\n'));
      return;
    }
    onSave();
  };

  return (
    <div className="anexo7-form">
      <h2 className="text-lg font-semibold mb-4">Anexo VII - Asociados con mayor volumen de operatoria mensual</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            
          </thead>
          <tbody>
            <tr>
              <td>Orden</td>
              <td>Apellido y Nombre / Razón Social</td>
              <td></td>
              <td></td>
              <td>CUIT/CUIL/CDI</td>
              <td>Número de Asociado</td>
              <td>Mayores Saldos de Ahorro</td>
              {data.rows.length > 1 && <td>Acciones</td>}
            </tr>
            {data.rows.map((r, idx) => (
              <InputFieldAnexo7 
                key={`${r.orden}-${idx}`} 
                row={r} 
                onChange={(f, v) => onChangeRow(idx)(f, v)}
                onRemove={() => removeRow(idx)}
                showRemoveButton={idx > 0} // Solo mostrar botón en filas agregadas (índice > 0)
              />
            ))}
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{data.rows.length + 1}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
              <td><input type="text" readOnly className="total" value={data.totalMayoresSaldos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></td>
              {data.rows.length > 1 && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={addNewRow} className="add-button" style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}>
          + Agregar Fila
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSave} className="save-button">Guardar Anexo VII</button>
          <button onClick={onDelete} className="delete-button">Borrar Datos</button>
        </div>
      </div>
    </div>
  );
}
