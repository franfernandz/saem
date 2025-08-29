// MiMutual.WebApp/src/components/Anexo2Form.tsx

import { useMemo } from 'react';
import type { Anexo2Data, FilaAnexo2 } from '../types';
import { InputFieldAnexo2 } from './InputFieldAnexo2';

// --- Componentes Reutilizables ---

function TotalRowAnexo2({ label, values }: { label: string, values: FilaAnexo2 }) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
    const formatPercent = (val: number) => `${(val * 100).toFixed(2)} %`;

    return (
        <tr className="level-1">
            <td>{label}</td>
            <td><input type="text" value={formatCurrency(values.movimientos.debe)} readOnly className="total"/></td>
            <td><input type="text" value={formatCurrency(values.movimientos.haber)} readOnly className="total"/></td>
            <td><input type="text" value={formatCurrency(values.finPeriodo)} readOnly className="total"/></td>
            <td><input type="text" value={formatCurrency(values.promedioPeriodo)} readOnly className="total"/></td>
            <td><input type="number" value={values.cuentasAsociadosVigentes} readOnly className="total"/></td>
            <td><input type="text" value={formatPercent(values.tasaEstimuloEfectivaMensual)} readOnly className="total"/></td>
        </tr>
    );
}

// --- Componente Principal del Formulario ---

interface Anexo2FormProps {
  data: Anexo2Data;
  setData: React.Dispatch<React.SetStateAction<Anexo2Data>>;
  onSave: () => void;
  onDelete: () => void;
}

export function Anexo2Form({ data, setData, onSave, onDelete }: Anexo2FormProps) {
  
  // La lógica para manejar los cambios de los inputs
  const handleInputChange = (path: string, field: keyof FilaAnexo2, value: any) => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const pathParts = path.split('.');
      let current = newData;
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const finalKey = pathParts[pathParts.length - 1];
      if (field === 'movimientos') {
          current[finalKey][field] = { ...current[finalKey][field], ...value };
      } else {
          current[finalKey][field] = value;
      }

      return newData;
    });
  };

  // La lógica para calcular los totales
  const totales = useMemo(() => {
    const sumarFilas = (filas: FilaAnexo2[]): FilaAnexo2 => {
        return filas.reduce((acc, fila) => ({
            movimientos: {
                debe: acc.movimientos.debe + fila.movimientos.debe,
                haber: acc.movimientos.haber + fila.movimientos.haber
            },
            finPeriodo: acc.finPeriodo + fila.finPeriodo,
            promedioPeriodo: acc.promedioPeriodo + fila.promedioPeriodo,
            cuentasAsociadosVigentes: acc.cuentasAsociadosVigentes + fila.cuentasAsociadosVigentes,
            tasaEstimuloEfectivaMensual: 0 // La tasa promedio no es una simple suma, la dejamos en 0
        }), { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 });
    };

    const apartadoA_pesos = sumarFilas(Object.values(data.apartadoA.recursosEnPesos));
    const apartadoA_me = sumarFilas(Object.values(data.apartadoA.recursosEnMonedaExtranjera));
    const totalApartadoA = sumarFilas([apartadoA_pesos, apartadoA_me]);
    
    const apartadoB_pesos = sumarFilas(Object.values(data.apartadoB.ayudaEnPesos));
    const apartadoB_me = sumarFilas(Object.values(data.apartadoB.ayudaEnMonedaExtranjera));
    const totalApartadoB = sumarFilas([apartadoB_pesos, apartadoB_me]);

    return { apartadoA_pesos, apartadoA_me, totalApartadoA, apartadoB_pesos, apartadoB_me, totalApartadoB };
  }, [data]);

  return (
    <div>
      <h1>Anexo II: Ahorro Mutual y Ayuda Económica Mutual</h1>
      
      {/* --- TABLA A: RECURSOS CAPTADOS --- */}
      <h2 style={{ marginTop: '2rem' }}>Apartado A: Recursos Captados</h2>
      <table>
        {/* LA CABECERA CORRECTA RESTAURADA */}
        <thead>
          <tr>
            <th rowSpan={2} style={{width: '25%'}}>Apartado A: Recursos Captados</th>
            <th colSpan={2}>Movimientos Deudores/Acreedores Mensuales</th>
            <th rowSpan={2}>Fin Período</th>
            <th rowSpan={2}>Promedio Período</th>
            <th rowSpan={2}>Cuentas Asociados Vigentes</th>
            <th rowSpan={2}>Tasa Estímulo Efectiva Mensual %</th>
          </tr>
          <tr>
            <th>Debe</th>
            <th>Haber</th>
          </tr>
        </thead>
        <tbody>
          <TotalRowAnexo2 label="1. Recursos en pesos" values={totales.apartadoA_pesos} />
          <InputFieldAnexo2 label="1.1 Ahorro a término" values={data.apartadoA.recursosEnPesos.ahorroATermino} onChange={(f, v) => handleInputChange('apartadoA.recursosEnPesos.ahorroATermino', f, v)} />
          <InputFieldAnexo2 label="1.2 Ahorro variable común" values={data.apartadoA.recursosEnPesos.ahorroVariableComun} onChange={(f, v) => handleInputChange('apartadoA.recursosEnPesos.ahorroVariableComun', f, v)} />
          <InputFieldAnexo2 label="1.3 Ahorro variable especial" values={data.apartadoA.recursosEnPesos.ahorroVariableEspecial} onChange={(f, v) => handleInputChange('apartadoA.recursosEnPesos.ahorroVariableEspecial', f, v)} />
          <InputFieldAnexo2 label="1.4 Otros" values={data.apartadoA.recursosEnPesos.otros} onChange={(f, v) => handleInputChange('apartadoA.recursosEnPesos.otros', f, v)} />

          <TotalRowAnexo2 label="2. Recursos en moneda extranjera" values={totales.apartadoA_me} />
          <InputFieldAnexo2 label="2.1 Ahorro a término" values={data.apartadoA.recursosEnMonedaExtranjera.ahorroATermino} onChange={(f, v) => handleInputChange('apartadoA.recursosEnMonedaExtranjera.ahorroATermino', f, v)} />
          <InputFieldAnexo2 label="2.2 Ahorro variable común" values={data.apartadoA.recursosEnMonedaExtranjera.ahorroVariableComun} onChange={(f, v) => handleInputChange('apartadoA.recursosEnMonedaExtranjera.ahorroVariableComun', f, v)} />
          <InputFieldAnexo2 label="2.3 Ahorro variable especial" values={data.apartadoA.recursosEnMonedaExtranjera.ahorroVariableEspecial} onChange={(f, v) => handleInputChange('apartadoA.recursosEnMonedaExtranjera.ahorroVariableEspecial', f, v)} />
          <InputFieldAnexo2 label="2.4 Otros" values={data.apartadoA.recursosEnMonedaExtranjera.otros} onChange={(f, v) => handleInputChange('apartadoA.recursosEnMonedaExtranjera.otros', f, v)} />

          <TotalRowAnexo2 label="3. Total general apartado A" values={totales.totalApartadoA} />
        </tbody>
      </table>

      {/* --- TABLA B: APLICACIONES --- */}
      <h2 style={{ marginTop: '2rem' }}>Apartado B: Aplicaciones</h2>
      <table>
        {/* LA CABECERA CORRECTA RESTAURADA */}
        <thead>
          <tr>
            <th rowSpan={2} style={{width: '25%'}}>Apartado B: Aplicaciones</th>
            <th colSpan={2}>Movimientos Deudores/Acreedores Mensuales</th>
            <th rowSpan={2}>Fin Período</th>
            <th rowSpan={2}>Promedio Período</th>
            <th rowSpan={2}>Cuentas Asociados Vigentes</th>
            <th rowSpan={2}>Tasa Estímulo Efectiva Mensual %</th>
          </tr>
          <tr>
            <th>Debe</th>
            <th>Haber</th>
          </tr>
        </thead>
        <tbody>
            <TotalRowAnexo2 label="1. Ayuda económica en pesos" values={totales.apartadoB_pesos} />
            <InputFieldAnexo2 label="1.1 Pago íntegro" values={data.apartadoB.ayudaEnPesos.pagoIntegro} onChange={(f, v) => handleInputChange('apartadoB.ayudaEnPesos.pagoIntegro', f, v)} />
            <InputFieldAnexo2 label="1.2 Amortizable" values={data.apartadoB.ayudaEnPesos.amortizable} onChange={(f, v) => handleInputChange('apartadoB.ayudaEnPesos.amortizable', f, v)} />
            <InputFieldAnexo2 label="1.3 Otros" values={data.apartadoB.ayudaEnPesos.otros} onChange={(f, v) => handleInputChange('apartadoB.ayudaEnPesos.otros', f, v)} />

            <TotalRowAnexo2 label="2. Ayuda económica moneda extranjera" values={totales.apartadoB_me} />
            <InputFieldAnexo2 label="2.1 Pago íntegro" values={data.apartadoB.ayudaEnMonedaExtranjera.pagoIntegro} onChange={(f, v) => handleInputChange('apartadoB.ayudaEnMonedaExtranjera.pagoIntegro', f, v)} />
            <InputFieldAnexo2 label="2.2 Amortizable" values={data.apartadoB.ayudaEnMonedaExtranjera.amortizable} onChange={(f, v) => handleInputChange('apartadoB.ayudaEnMonedaExtranjera.amortizable', f, v)} />
            <InputFieldAnexo2 label="2.3 Otros" values={data.apartadoB.ayudaEnMonedaExtranjera.otros} onChange={(f, v) => handleInputChange('apartadoB.ayudaEnMonedaExtranjera.otros', f, v)} />
            
            <TotalRowAnexo2 label="3. Total general apartado B" values={totales.totalApartadoB} />
        </tbody>
      </table>
      
      {/* Los botones, que ahora llaman a las funciones del padre */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onDelete} className="delete-button">Resetear Datos</button>
        <button onClick={onSave} className="save-button">Guardar Anexo II</button>
      </div>
    </div>
  );
}