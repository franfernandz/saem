// src/Components/Anexo7Form.tsx

import React, { useState } from 'react';
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
    rows: Array.from({ length: 20 }, (_, i) => makeEmptyRow(i + 1)),
    totalMayoresSaldos: 0,
  }));

  const updateHeader = (field: keyof Anexo7Data['header']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, header: { ...prev.header, [field]: e.target.value } }));
  };

  const onChangeRow = (index: number) => (field: keyof Anexo7Row, value: string | number) => {
    setData(prev => updateAnexo7Row(prev, index, field, value));
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
            <tr>
              <th>ASOCIADOS CON MAYOR VOLUMEN DE OPERATORIA MENSUAL</th>
              <th></th><th></th><th></th><th></th><th></th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Asociación Mutual:</td>
              <td><input type="text" value={data.header.asociacionMutual} onChange={updateHeader('asociacionMutual')} /></td>
              <td></td><td></td>
              <td>Localidad:</td>
              <td><input type="text" value={data.header.localidad} onChange={updateHeader('localidad')} /></td>
              <td></td>
            </tr>
            <tr>
              <td>Domicilio:</td>
              <td><input type="text" value={data.header.domicilio} onChange={updateHeader('domicilio')} /></td>
              <td></td><td></td>
              <td>TE:</td>
              <td><input type="text" value={data.header.telefono} onChange={updateHeader('telefono')} /></td>
              <td></td>
            </tr>
            <tr>
              <td>Fecha Arqueo:</td>
              <td><input type="text" value={data.header.fechaArqueo} onChange={updateHeader('fechaArqueo')} /></td>
              <td></td><td></td>
              <td>Acta Nº</td>
              <td><input type="text" value={data.header.actaNumero} onChange={updateHeader('actaNumero')} /></td>
              <td><input type="text" value={data.header.fechaArqueo} onChange={updateHeader('fechaArqueo')} /></td>
            </tr>
            <tr>
              <td>Periodo Mensual Bajo Informe:</td>
              <td></td>
              <td><input type="text" value={data.header.periodoMensual} onChange={updateHeader('periodoMensual')} /></td>
              <td></td>
              <td>Mail:</td>
              <td><input type="text" value={data.header.mail} onChange={updateHeader('mail')} /></td>
              <td></td>
            </tr>
            <tr>
              <td>Orden</td>
              <td>Apellido y Nombre / Razón Social</td>
              <td></td>
              <td></td>
              <td>CUIT/CUIL/CDI</td>
              <td>Número de Asociado</td>
              <td>Mayores Saldos de Ahorro</td>
            </tr>
            {data.rows.map((r, idx) => (
              <InputFieldAnexo7 key={r.orden} row={r} onChange={(f, v) => onChangeRow(idx)(f, v)} />
            ))}
            <tr>
              <td>21</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>Total</td>
              <td><input type="text" readOnly className="total" value={data.totalMayoresSaldos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
        <button onClick={handleSave} className="save-button">Guardar Anexo VII</button>
        <button onClick={onDelete} className="delete-button">Borrar Datos</button>
      </div>
    </div>
  );
}
