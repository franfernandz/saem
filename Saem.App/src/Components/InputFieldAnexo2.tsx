// MiMutual.WebApp/src/components/InputFieldAnexo2.tsx

import type { FilaAnexo2 } from '../types';

interface InputFieldAnexo2Props {
  label: string;
  values: FilaAnexo2;
  onChange: (field: keyof FilaAnexo2, value: any) => void;
}

export function InputFieldAnexo2({ label, values, onChange }: InputFieldAnexo2Props) {
  
  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>, subField?: 'debe' | 'haber') => {
    const { name, value } = event.target;
    const numericValue = parseFloat(value) || 0;

    if (subField) {
        onChange(name as keyof FilaAnexo2, { [subField]: numericValue });
    } else {
        onChange(name as keyof FilaAnexo2, numericValue);
    }
  };

  return (
    <tr>
      <td style={{ paddingLeft: '30px' }}>{label}</td>
      <td><input type="number" name="movimientos" value={values.movimientos.debe} onChange={(e) => handleNumericChange(e, 'debe')} /></td>
      <td><input type="number" name="movimientos" value={values.movimientos.haber} onChange={(e) => handleNumericChange(e, 'haber')} /></td>
      <td><input type="number" name="finPeriodo" value={values.finPeriodo} onChange={handleNumericChange} /></td>
      <td><input type="number" name="promedioPeriodo" value={values.promedioPeriodo} onChange={handleNumericChange} /></td>
      <td><input type="number" name="cuentasAsociadosVigentes" value={values.cuentasAsociadosVigentes} onChange={handleNumericChange} /></td>
      <td><input type="number" name="tasaEstimuloEfectivaMensual" value={values.tasaEstimuloEfectivaMensual} onChange={handleNumericChange} step="0.01" /></td>
    </tr>
  );
}