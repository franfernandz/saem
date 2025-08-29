// MiMutual.WebApp/src/components/InputField.tsx

import { useState } from 'react'; 
import type { ValorMonetario } from '../types';

// 2. Creamos una función de formato reutilizable
// Usa la API de Internacionalización de JavaScript, que es la forma moderna de hacerlo.
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};

interface InputFieldProps {
  label: string;
  values: ValorMonetario;
  onChange: (field: keyof ValorMonetario, value: number) => void;
}

export function InputField({ label, values, onChange }: InputFieldProps) {

  const [isEditing, setIsEditing] = useState({ saldoPeriodo: false, promedioPeriodo: false });

  const handleFocus = (field: keyof ValorMonetario) => {
    // Cuando el usuario hace clic, activamos el modo edición para ese campo
    setIsEditing({ ...isEditing, [field]: true });
  };
    const handleBlur = (field: keyof ValorMonetario) => {
    // Cuando el usuario sale del campo, desactivamos el modo edición
    setIsEditing({ ...isEditing, [field]: false });
  };

  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    onChange(name as keyof ValorMonetario, parseFloat(sanitizedValue) || 0);
  };

  return (
    <tr>
      <td style={{ paddingLeft: '60px' }}>{label}</td>
      <td>
        <input
          // 4. El tipo de input ahora es dinámico
          type={isEditing.saldoPeriodo ? 'number' : 'text'}
          inputMode="decimal"
          autoComplete="off"
          name="saldoPeriodo"
          // 5. El valor mostrado también es dinámico
          value={isEditing.saldoPeriodo ? values.saldoPeriodo : formatCurrency(values.saldoPeriodo)}
          onChange={handleChange}
          onFocus={() => handleFocus('saldoPeriodo')}
          onBlur={() => handleBlur('saldoPeriodo')}
        />
      </td>
      <td>
        <input
          type={isEditing.promedioPeriodo ? 'number' : 'text'}
          inputMode="decimal"
          autoComplete="off"
          name="promedioPeriodo"
          value={isEditing.promedioPeriodo ? values.promedioPeriodo : formatCurrency(values.promedioPeriodo)}
          onChange={handleChange}
          onFocus={() => handleFocus('promedioPeriodo')}
          onBlur={() => handleBlur('promedioPeriodo')}
        />
      </td>
    </tr>
  );
}