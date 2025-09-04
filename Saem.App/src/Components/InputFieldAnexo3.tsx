// MiMutual.WebApp/src/components/InputFieldAnexo3.tsx

import { useState } from 'react';

interface InputFieldAnexo3Props {
  label: string;
  value?: number; // valor opcional para nuevos campos
  onChange: (value: number) => void; 
  isPercentage?: boolean;
  isReadOnly?: boolean;
  level?: number;
  fieldKey?: string; // identificador para backend (opcional)
}

const formatValue = (value: number = 0, isPercentage?: boolean) => {
  if (isPercentage) {
    return new Intl.NumberFormat('es-AR', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function InputFieldAnexo3({
  label,
  value = 0,
  onChange,
  isPercentage,
  isReadOnly,
  level = 3,
  fieldKey,
}: InputFieldAnexo3Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleFocus = () => {
    if (!isReadOnly) setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value
      .replace(/[^0-9.,-]/g, '')
      .replace(',', '.');

    const parsedValue = parseFloat(sanitizedValue);

    if (!isNaN(parsedValue)) {
      onChange(isPercentage && isEditing ? parsedValue / 100 : parsedValue);
    } else {
      onChange(0);
    }
  };

  const displayValue =
    isEditing && !isReadOnly
      ? (isPercentage ? (value * 100).toFixed(2) : value)
      : formatValue(value, isPercentage);

  const paddingLeft = `${level * 20}px`;

  return (
    <tr data-field={fieldKey}>
      <td style={{ paddingLeft }}>{label}</td>
      <td>
        <input
          type={isEditing && !isReadOnly ? 'number' : 'text'}
          inputMode="decimal"
          autoComplete="off"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={isReadOnly}
          className={isReadOnly ? 'total' : ''}
          step={isPercentage ? '0.01' : 'any'}
        />
      </td>
    </tr>
  );
}
