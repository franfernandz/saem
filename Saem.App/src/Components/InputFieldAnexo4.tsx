// src/Components/InputFieldAnexo4.tsx

import React, { useState, useCallback } from 'react';
import { formatoDecimal } from '../utils/macros';

export interface ValoresSituacionAnexo4 {
  situacion1: number; // Normal (hasta 30 días)
  situacion2: number; // Riesgo bajo (31 a 90)
  situacion3: number; // Riesgo medio (91 a 180)
  situacion4: number; // Riesgo alto (181 a 365)
  situacion5: number; // Irrecuperable (> 365)
}

interface InputFieldAnexo4Props {
  label: string;
  values: ValoresSituacionAnexo4;
  onChange: (field: keyof ValoresSituacionAnexo4, value: number) => void;
  onBlur?: (value: number | string, name: string) => void;
  level?: 1 | 2 | 3 | 4;
  readOnly?: boolean;
}

const InputFieldAnexo4: React.FC<InputFieldAnexo4Props> = ({ label, values, onChange, onBlur, level = 3, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({
    situacion1: false,
    situacion2: false,
    situacion3: false,
    situacion4: false,
    situacion5: false,
  });

  const paddingLeft = level === 1 ? '0px' : level === 2 ? '30px' : level === 3 ? '60px' : '90px';

  const handleFocus = useCallback((fieldKey: keyof ValoresSituacionAnexo4) => {
    setIsEditing(prev => ({ ...prev, [fieldKey]: true }));
  }, []);

  const handleBlur = useCallback((fieldKey: keyof ValoresSituacionAnexo4, event: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(prev => ({ ...prev, [fieldKey]: false }));
    const value = parseFloat(event.target.value.replace(/[^0-9.-]/g, '')) || 0;
    onBlur && onBlur(value, event.target.name);
  }, [onBlur]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, fieldKey: keyof ValoresSituacionAnexo4) => {
    const sanitizedValue = event.target.value.replace(/[^0-9.-]/g, '');
    const numericValue = parseFloat(sanitizedValue) || 0;
    onChange(fieldKey, numericValue);
  }, [onChange]);

  const renderCell = (fieldKey: keyof ValoresSituacionAnexo4, displayValue: number) => {
    const editing = isEditing[fieldKey as string];
    const valueToShow = editing ? displayValue : formatoDecimal(displayValue);
    return (
      <td>
        <input
          type={editing ? 'number' : 'text'}
          inputMode="decimal"
          autoComplete="off"
          name={String(fieldKey)}
          value={valueToShow}
          onChange={(e) => !readOnly && handleChange(e, fieldKey)}
          onFocus={() => !readOnly && handleFocus(fieldKey)}
          onBlur={(e) => handleBlur(fieldKey, e)}
          readOnly={readOnly}
          style={{ width: '120px', textAlign: 'right' }}
        />
      </td>
    );
  };

  return (
    <tr className={`level-${level}`}>
      <td style={{ paddingLeft }}>{label}</td>
      {renderCell('situacion1', values.situacion1)}
      {renderCell('situacion2', values.situacion2)}
      {renderCell('situacion3', values.situacion3)}
      {renderCell('situacion4', values.situacion4)}
      {renderCell('situacion5', values.situacion5)}
    </tr>
  );
};

export default InputFieldAnexo4;
