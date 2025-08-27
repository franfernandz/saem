// MiMutual.WebApp/src/components/InputField.tsx

import type { ValorMonetario } from '../src/types';

interface InputFieldProps {
  label: string;
  values: ValorMonetario;
  onChange: (field: keyof ValorMonetario, value: number) => void;
}

export function InputField({ label, values, onChange }: InputFieldProps) {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Limpiamos el valor para permitir solo números y un punto decimal
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    // Convertimos el valor limpio a número y llamamos a la función del padre
    onChange(name as keyof ValorMonetario, parseFloat(sanitizedValue) || 0);
  };

  return (
    <tr>
      <td style={{ paddingLeft: '60px' }}>{label}</td>
      <td>
        <input
          type="text" // 1. Cambiado de "number" a "text"
          inputMode="decimal" // 2. Muestra un teclado numérico en móviles
          autoComplete="off" // 3. Evita el autocompletado molesto del navegador
          name="saldoPeriodo"
          value={values.saldoPeriodo}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text" // 1. Cambiado de "number" a "text"
          inputMode="decimal" // 2. Muestra un teclado numérico en móviles
          autoComplete="off" // 3. Evita el autocompletado molesto del navegador
          name="promedioPeriodo"
          value={values.promedioPeriodo}
          onChange={handleChange}
        />
      </td>
    </tr>
  );
}