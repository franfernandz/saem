// src/Components/InputFieldAnexo2.tsx
import React, { useState, useCallback } from 'react';
import type { FilaAnexo2, Movimientos } from '../types';
import { formatoDecimal } from '../utils/macros'; // Asegúrate de que esta ruta sea correcta

interface InputFieldAnexo2Props {
  label: string;
  values: FilaAnexo2;
  onChange: (field: keyof FilaAnexo2 | `movimientos.${keyof Movimientos}`, value: number) => void;
  onBlur: (value: number | string, name: string) => void;
}

const InputFieldAnexo2: React.FC<InputFieldAnexo2Props> = ({ label, values, onChange, onBlur }) => {
  // Estado para controlar qué campo está siendo editado (number vs text)
  // Usamos una estructura más plana para `isEditing` para simplificar la lógica de actualización
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({
    'movimientos.debe': false,
    'movimientos.haber': false,
    'finPeriodo': false,
    'promedioPeriodo': false,
    'cuentasAsociadosVigentes': false,
    'tasaEstimuloEfectivaMensual': false,
  });

  const handleFocus = useCallback((fieldPath: string) => {
    setIsEditing(prev => ({ ...prev, [fieldPath]: true }));
  }, []);

  const handleBlurHandler = useCallback((fieldPath: string, event: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(prev => ({ ...prev, [fieldPath]: false }));
    const value = parseFloat(event.target.value.replace(/[^0-9.-]/g, '')) || 0;
    onBlur(value, event.target.name);
  }, [onBlur]);


  const handleChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const sanitizedValue = event.target.value.replace(/[^0-9.-]/g, '');
    const numericValue = parseFloat(sanitizedValue) || 0;
    onChange(fieldPath as keyof FilaAnexo2 | `movimientos.${keyof Movimientos}`, numericValue);
  }, [onChange]);


  // Función para renderizar un input individual para debe/haber/finPeriodo, etc.
  const renderInput = (fullFieldPath: string, displayValue: number) => {
    const currentIsEditing = isEditing[fullFieldPath];
    const valueToShow = currentIsEditing ? displayValue : formatoDecimal(displayValue);

    const isFinPeriodo = fullFieldPath === 'finPeriodo';

    return (
      <input
        type={currentIsEditing && !isFinPeriodo ? 'number' : 'text'}
        inputMode={isFinPeriodo ? undefined : 'decimal'}
        autoComplete="off"
        name={fullFieldPath}
        value={valueToShow}
        onChange={(e) => !isFinPeriodo && handleChangeHandler(e, fullFieldPath)}
        onFocus={() => !isFinPeriodo && handleFocus(fullFieldPath)}
        onBlur={(e) => handleBlurHandler(fullFieldPath, e)}
        style={{ width: '90px', textAlign: 'right' }}
        readOnly={isFinPeriodo}
      />
    );
  };

  return (
    <tr><td style={{ paddingLeft: '60px' }}>{label}</td><td>{renderInput('movimientos.debe', values.movimientos.debe)}</td><td>{renderInput('movimientos.haber', values.movimientos.haber)}</td><td>{renderInput('finPeriodo', values.finPeriodo)}</td><td>{renderInput('promedioPeriodo', values.promedioPeriodo)}</td><td>{renderInput('cuentasAsociadosVigentes', values.cuentasAsociadosVigentes)}</td><td>{renderInput('tasaEstimuloEfectivaMensual', values.tasaEstimuloEfectivaMensual)}</td></tr>
  );
};

export default InputFieldAnexo2;