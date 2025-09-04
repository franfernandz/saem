// src/Components/InputFieldAnexo5.tsx

import React, { useCallback, useState } from 'react';
import { formatoDecimal } from '../utils/macros';
import type { Anexo5Fila } from '../types';

interface InputFieldAnexo5Props {
  label: string;
  values: Anexo5Fila;
  onChange: (
    grupo: 'sinGarantia' | 'conGarantiaPersonal' | 'conGarantiaReal',
    field: 'ayudasEconomicas' | 'porcentaje',
    value: number
  ) => void;
  level?: 1 | 2 | 3 | 4;
}

const InputFieldAnexo5: React.FC<InputFieldAnexo5Props> = ({ label, values, onChange, level = 2 }) => {
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const paddingLeft = level === 1 ? '0px' : level === 2 ? '30px' : level === 3 ? '60px' : '90px';

  const handleFocus = useCallback((key: string) => setEditing(prev => ({ ...prev, [key]: true })), []);
  const handleBlur = useCallback((key: string) => setEditing(prev => ({ ...prev, [key]: false })), []);
  const handleChange = useCallback((key: string, raw: string, cb: (n: number) => void) => {
    const sanitized = raw.replace(/[^0-9.-]/g, '');
    const n = parseFloat(sanitized);
    cb(Number.isFinite(n) ? n : 0);
  }, []);

  const renderGroup = (
    grupo: 'sinGarantia' | 'conGarantiaPersonal' | 'conGarantiaReal',
    labelAyudas: string
  ) => {
    const ayudasKey = `${grupo}.ayudasEconomicas`;
    const pctKey = `${grupo}.porcentaje`;

    const ayudas = (values as any)[grupo].ayudasEconomicas as number;
    const porcentaje = (values as any)[grupo].porcentaje as number;
    const monto = (values as any)[grupo].montoAPrevisionar as number;

    const ayudasEditing = editing[ayudasKey];
    const pctEditing = editing[pctKey];

    return (
      <>
        <td>
          <input
            type={ayudasEditing ? 'number' : 'text'}
            name={ayudasKey}
            inputMode="decimal"
            value={ayudasEditing ? ayudas : formatoDecimal(ayudas)}
            onFocus={() => handleFocus(ayudasKey)}
            onBlur={() => handleBlur(ayudasKey)}
            onChange={(e) => handleChange(ayudasKey, e.target.value, (n) => onChange(grupo, 'ayudasEconomicas', n))}
            style={{ width: '140px', textAlign: 'right' }}
          />
        </td>
        <td>
          <input
            type={pctEditing ? 'number' : 'text'}
            name={pctKey}
            inputMode="decimal"
            value={pctEditing ? porcentaje : formatoDecimal(porcentaje)}
            onFocus={() => handleFocus(pctKey)}
            onBlur={() => handleBlur(pctKey)}
            onChange={(e) => handleChange(pctKey, e.target.value, (n) => onChange(grupo, 'porcentaje', n))}
            style={{ width: '80px', textAlign: 'right' }}
          />
        </td>
        <td>
          <input type="text" readOnly className="total" value={formatoDecimal(monto)} style={{ width: '140px', textAlign: 'right' }} />
        </td>
      </>
    );
  };

  return (
    <tr className={`level-${level}`}>
      <td style={{ paddingLeft }}>{label}</td>
      {/* SIN GARANTIA */}
      {renderGroup('sinGarantia', 'SIN GARANTIA')}
      {/* CON GARANTIA PERSONAL */}
      {renderGroup('conGarantiaPersonal', 'C/GTIA. PERS.')}
      {/* CON GARANTIA REAL */}
      {renderGroup('conGarantiaReal', 'C/GTIA. REAL')}
    </tr>
  );
};

export default InputFieldAnexo5;
