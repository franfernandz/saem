// src/Components/InputFieldAnexo7.tsx

import React, { useCallback } from 'react';
import type { Anexo7Row } from '../types';
import { formatoDecimal } from '../utils/macros';

interface InputFieldAnexo7Props {
  row: Anexo7Row;
  onChange: (field: keyof Anexo7Row, value: string | number) => void;
}

export default function InputFieldAnexo7({ row, onChange }: InputFieldAnexo7Props) {
  const handleChange = useCallback((field: keyof Anexo7Row) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'mayoresSaldosAhorro'
      ? (parseFloat(e.target.value.replace(/[^0-9.-]/g, '')) || 0)
      : e.target.value;
    onChange(field, value);
  }, [onChange]);

  return (
    <tr>
      <td><input type="number" value={row.orden} onChange={handleChange('orden')} style={{ width: '60px', textAlign: 'right' }} /></td>
      <td><input type="text" value={row.nombreORazonSocial} onChange={handleChange('nombreORazonSocial')} style={{ width: '100%', minWidth: '240px' }} /></td>
      <td></td>
      <td></td>
      <td><input type="text" value={row.cuitCuilCdi} onChange={handleChange('cuitCuilCdi')} style={{ width: '140px' }} /></td>
      <td><input type="text" value={row.numeroAsociado} onChange={handleChange('numeroAsociado')} style={{ width: '120px' }} /></td>
      <td><input type="text" value={formatoDecimal(row.mayoresSaldosAhorro)} onChange={handleChange('mayoresSaldosAhorro')} style={{ width: '180px', textAlign: 'right' }} /></td>
    </tr>
  );
}
