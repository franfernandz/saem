import type { ValoresSituacionAnexo4 } from '../types';

interface InputFieldAnexo4Props {
  values: ValoresSituacionAnexo4;
  onChange: (field: keyof ValoresSituacionAnexo4, value: number) => void;
  level: number;
  label?: string;
  col1?: string;
}

export default function InputFieldAnexo4({ values, onChange, level, label, col1 }: InputFieldAnexo4Props) {
  const paddingLeft = `${(level - 1) * 15}px`;

  const renderCell = (field: keyof ValoresSituacionAnexo4, value: number) => (
    <td>
      <input
        type="number"
        value={value}
        onChange={e => onChange(field, parseFloat(e.target.value) || 0)}
        style={{
          width: '80px',
          textAlign: 'right',
          background: '#000',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '4px',
        }}
      />
    </td>
  );

  return (
    <tr className={`level-${level}`}>
      {/* Columna A → Número o índice */}
      <td style={{ textAlign: 'center', width: '40px' }}>{col1 || ''}</td>

      {/* Columnas B y C → vacías */}
      <td></td>
      <td></td>

      {/* Columna D → Label */}
      <td style={{ paddingLeft, fontWeight: level === 1 ? 'bold' : 'normal' }}>{label}</td>

      {/* Columnas E–I → Inputs */}
      {renderCell('situacion1', values.situacion1)}
      {renderCell('situacion2', values.situacion2)}
      {renderCell('situacion3', values.situacion3)}
      {renderCell('situacion4', values.situacion4)}
      {renderCell('situacion5', values.situacion5)}
    </tr>
  );
}
