// MiMutual.WebApp/src/components/Anexo1Form.tsx
// import { useMemo } from 'react';
// import type { Anexo1Data, ValorMonetario } from '../types';
// import { InputField } from './InputField';

// //función de formato para que esté disponible para TotalRow
// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat('es-AR', {
//     style: 'currency',
//     currency: 'ARS',
//   }).format(value);
// };

// // Componente reutilizable para las filas de totales (Sin cambios)
// function TotalRow({ label, values, level = 2 }: { label: string; values: ValorMonetario, level?: number }) {
//     const padding = level === 1 ? '0px' : '30px';
//     const className = level === 1 ? 'level-1' : 'level-2';
//     return (
//         <tr className={className}>
//             <td colSpan={1} style={{ paddingLeft: padding }}>{label}</td>
//             {/* 2. Aplicamos la función formatCurrency al valor que se muestra */}
//             {/*    y usamos type="text" para que el símbolo '$' y los puntos sean visibles. */}
//             <td><input type="text" value={formatCurrency(values.saldoPeriodo)} readOnly className="total" /></td>
//             <td><input type="text" value={formatCurrency(values.promedioPeriodo)} readOnly className="total" /></td>
//         </tr>
//     );
// }

// // 1. Definimos las props que el componente espera recibir, incluyendo onSave
// interface Anexo1FormProps {
//   data: Anexo1Data;
//   setData: React.Dispatch<React.SetStateAction<Anexo1Data>>;
//   onSave: () => void;
//   onDelete: () => void;
// }

// export function Anexo1Form({ data, setData, onSave, onDelete }: Anexo1FormProps) {
  
//   // 2. La función para manejar los cambios de los inputs (completa)
//   const handleInputChange = (path: string, field: keyof ValorMonetario, value: number) => {
//     setData(prevData => {
//       const newData = JSON.parse(JSON.stringify(prevData));
//       const pathParts = path.split('.');
//       let current = newData;
//       for (let i = 0; i < pathParts.length - 1; i++) {
//         current = current[pathParts[i]];
//       }
//       current[pathParts[pathParts.length - 1]][field] = value;
//       return newData;
//     });
//   };

//   // 3. La lógica para calcular los totales (completa)
//   const totales = useMemo(() => {
//         const d = data.disponibilidades;
//         const i = data.inversiones;
//         const totalDispPesos: ValorMonetario = { saldoPeriodo: d.enPesos.caja.saldoPeriodo + d.enPesos.cuentaCorriente.saldoPeriodo + d.enPesos.otros.saldoPeriodo, promedioPeriodo: d.enPesos.caja.promedioPeriodo + d.enPesos.cuentaCorriente.promedioPeriodo + d.enPesos.otros.promedioPeriodo };
//         const totalDispME: ValorMonetario = { saldoPeriodo: d.enMonedaExtranjera.caja.saldoPeriodo + d.enMonedaExtranjera.cuentaCorriente.saldoPeriodo + d.enMonedaExtranjera.otros.saldoPeriodo, promedioPeriodo: d.enMonedaExtranjera.caja.promedioPeriodo + d.enMonedaExtranjera.cuentaCorriente.promedioPeriodo + d.enMonedaExtranjera.otros.promedioPeriodo };
//         const totalDisponibilidades: ValorMonetario = { saldoPeriodo: totalDispPesos.saldoPeriodo + totalDispME.saldoPeriodo, promedioPeriodo: totalDispPesos.promedioPeriodo + totalDispME.promedioPeriodo };
//         const totalInvPesos: ValorMonetario = { saldoPeriodo: i.enPesos.cajaDeAhorro.saldoPeriodo + i.enPesos.plazoFijo.saldoPeriodo + i.enPesos.titulosPublicos.saldoPeriodo + i.enPesos.tiCoCa.saldoPeriodo + i.enPesos.otros.saldoPeriodo, promedioPeriodo: i.enPesos.cajaDeAhorro.promedioPeriodo + i.enPesos.plazoFijo.promedioPeriodo + i.enPesos.titulosPublicos.promedioPeriodo + i.enPesos.tiCoCa.promedioPeriodo + i.enPesos.otros.promedioPeriodo };
//         const totalInvME: ValorMonetario = { saldoPeriodo: i.enMonedaExtranjera.cajaDeAhorro.saldoPeriodo + i.enMonedaExtranjera.plazoFijo.saldoPeriodo + i.enMonedaExtranjera.titulosPublicos.saldoPeriodo + i.enMonedaExtranjera.otros.saldoPeriodo, promedioPeriodo: i.enMonedaExtranjera.cajaDeAhorro.promedioPeriodo + i.enMonedaExtranjera.plazoFijo.promedioPeriodo + i.enMonedaExtranjera.titulosPublicos.promedioPeriodo + i.enMonedaExtranjera.otros.promedioPeriodo };
//         const totalInversiones: ValorMonetario = { saldoPeriodo: totalInvPesos.saldoPeriodo + totalInvME.saldoPeriodo, promedioPeriodo: totalInvPesos.promedioPeriodo + totalInvME.promedioPeriodo };
//         const totalGeneral: ValorMonetario = { saldoPeriodo: totalDisponibilidades.saldoPeriodo + totalInversiones.saldoPeriodo, promedioPeriodo: totalDisponibilidades.promedioPeriodo + totalInversiones.promedioPeriodo };
//         return { totalDispPesos, totalDispME, totalDisponibilidades, totalInvPesos, totalInvME, totalInversiones, totalGeneral };
//   }, [data]);

//   return (
//     <div>
//         <h2>Anexo I: Disponibilidades e Inversiones</h2>
//         <table>
//             <thead>
//                 <tr><th>Concepto</th><th>Saldo en Período</th><th>Promedio Período</th></tr>
//             </thead>
//             {/* 4. La tabla completa, idéntica a la que funcionaba antes */}
//             <tbody>
//                 <TotalRow label="1. TOTAL DISPONIBILIDADES" values={totales.totalDisponibilidades} level={1} />
//                 <TotalRow label="1.1 Disponibilidades en Pesos" values={totales.totalDispPesos} level={2} />
//                 <InputField label="1.1.1 Caja" values={data.disponibilidades.enPesos.caja} onChange={(f, v) => handleInputChange('disponibilidades.enPesos.caja', f, v)} />
//                 <InputField label="1.1.2 Cuenta Corriente" values={data.disponibilidades.enPesos.cuentaCorriente} onChange={(f, v) => handleInputChange('disponibilidades.enPesos.cuentaCorriente', f, v)} />
//                 <InputField label="1.1.3 Otros" values={data.disponibilidades.enPesos.otros} onChange={(f, v) => handleInputChange('disponibilidades.enPesos.otros', f, v)} />
//                 <TotalRow label="1.2 Disponibilidades en Moneda Extranjera" values={totales.totalDispME} level={2} />
//                 <InputField label="1.2.1 Caja" values={data.disponibilidades.enMonedaExtranjera.caja} onChange={(f, v) => handleInputChange('disponibilidades.enMonedaExtranjera.caja', f, v)} />
//                 <InputField label="1.2.2 Cuenta Corriente" values={data.disponibilidades.enMonedaExtranjera.cuentaCorriente} onChange={(f, v) => handleInputChange('disponibilidades.enMonedaExtranjera.cuentaCorriente', f, v)} />
//                 <InputField label="1.2.3 Otros" values={data.disponibilidades.enMonedaExtranjera.otros} onChange={(f, v) => handleInputChange('disponibilidades.enMonedaExtranjera.otros', f, v)} />
//                 <TotalRow label="2. TOTAL INVERSIONES" values={totales.totalInversiones} level={1} />
//                 <TotalRow label="2.1 Inversiones en Pesos" values={totales.totalInvPesos} level={2} />
//                 <InputField label="2.1.1 Caja de Ahorro" values={data.inversiones.enPesos.cajaDeAhorro} onChange={(f, v) => handleInputChange('inversiones.enPesos.cajaDeAhorro', f, v)} />
//                 <InputField label="2.1.2 Plazo Fijo" values={data.inversiones.enPesos.plazoFijo} onChange={(f, v) => handleInputChange('inversiones.enPesos.plazoFijo', f, v)} />
//                 <InputField label="2.1.3 Títulos Públicos" values={data.inversiones.enPesos.titulosPublicos} onChange={(f, v) => handleInputChange('inversiones.enPesos.titulosPublicos', f, v)} />
//                 <InputField label="2.1.4 Ti Co Ca" values={data.inversiones.enPesos.tiCoCa} onChange={(f, v) => handleInputChange('inversiones.enPesos.tiCoCa', f, v)} />
//                 <InputField label="2.1.5 Otros" values={data.inversiones.enPesos.otros} onChange={(f, v) => handleInputChange('inversiones.enPesos.otros', f, v)} />
//                 <TotalRow label="2.2 Inversiones en Moneda Extranjera" values={totales.totalInvME} level={2} />
//                 <InputField label="2.2.1 Caja de Ahorro" values={data.inversiones.enMonedaExtranjera.cajaDeAhorro} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.cajaDeAhorro', f, v)} />
//                 <InputField label="2.2.2 Plazo Fijo" values={data.inversiones.enMonedaExtranjera.plazoFijo} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.plazoFijo', f, v)} />
//                 <InputField label="2.2.3 Títulos Públicos" values={data.inversiones.enMonedaExtranjera.titulosPublicos} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.titulosPublicos', f, v)} />
//                 <InputField label="2.2.4 Otros" values={data.inversiones.enMonedaExtranjera.otros} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.otros', f, v)} />
//                 <TotalRow label="3. TOTAL GENERAL" values={totales.totalGeneral} level={1} />
//             </tbody>
//         </table>
        
//         {/* 5. El nuevo botón de guardado que llama a la función onSave del padre */}
//         <div style={{ textAlign: 'right', marginTop: '20px' }}>
//             <button onClick={onSave} className="save-button">
//                 Guardar Anexo I
//             </button>
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px'}}>
//         {/* 2. Añadimos el nuevo botón de borrado */}
//         <button onClick={onDelete} className="delete-button">
//             Borrar Datos
//         </button>
//       </div>
//     </div>
//   );
// }

// MiMutual.WebApp/src/components/Anexo1Form.tsx
import { useMemo } from 'react';
import type { Anexo1Data, ValorMonetario } from '../types';
import { InputField } from './InputField';

// Función de formato para que esté disponible para TotalRow
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};

// Funciones de validación
const validateNegative = (value: number) => {
  if (value < 0) console.warn('Valor negativo detectado:', value);
};
const validateDecimals = (value: number) => {
  if (!Number.isInteger(value)) console.warn('Valor con decimales detectado:', value);
};
const validateRequired = (value: number) => {
  if (value === null || value === undefined) console.warn('Valor requerido vacío:', value);
};

// Componente reutilizable para las filas de totales
function TotalRow({ label, values, level = 2 }: { label: string; values: ValorMonetario, level?: number }) {
    const padding = level === 1 ? '0px' : '30px';
    const className = level === 1 ? 'level-1' : 'level-2';
    return (
        <tr className={className}>
            <td colSpan={1} style={{ paddingLeft: padding }}>{label}</td>
            <td><input type="text" value={formatCurrency(values.saldoPeriodo)} readOnly className="total" /></td>
            <td><input type="text" value={formatCurrency(values.promedioPeriodo)} readOnly className="total" /></td>
        </tr>
    );
}

interface Anexo1FormProps {
  data: Anexo1Data;
  setData: React.Dispatch<React.SetStateAction<Anexo1Data>>;
  onSave: () => void;
  onDelete: () => void;
}

export function Anexo1Form({ data, setData, onSave, onDelete }: Anexo1FormProps) {

  const handleInputChange = (path: string, field: keyof ValorMonetario, value: number) => {
    // 1. Validaciones
    validateNegative(value);
    validateDecimals(value);
    validateRequired(value);

    // 2. Actualización del estado
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const pathParts = path.split('.');
      let current = newData;
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]][field] = value;
      return newData;
    });
  };

  // 3. Cálculo de totales
  const totales = useMemo(() => {
        const d = data.disponibilidades;
        const i = data.inversiones;
        const totalDispPesos: ValorMonetario = { saldoPeriodo: d.enPesos.caja.saldoPeriodo + d.enPesos.cuentaCorriente.saldoPeriodo + d.enPesos.otros.saldoPeriodo, promedioPeriodo: d.enPesos.caja.promedioPeriodo + d.enPesos.cuentaCorriente.promedioPeriodo + d.enPesos.otros.promedioPeriodo };
        const totalDispME: ValorMonetario = { saldoPeriodo: d.enMonedaExtranjera.caja.saldoPeriodo + d.enMonedaExtranjera.cuentaCorriente.saldoPeriodo + d.enMonedaExtranjera.otros.saldoPeriodo, promedioPeriodo: d.enMonedaExtranjera.caja.promedioPeriodo + d.enMonedaExtranjera.cuentaCorriente.promedioPeriodo + d.enMonedaExtranjera.otros.promedioPeriodo };
        const totalDisponibilidades: ValorMonetario = { saldoPeriodo: totalDispPesos.saldoPeriodo + totalDispME.saldoPeriodo, promedioPeriodo: totalDispPesos.promedioPeriodo + totalDispME.promedioPeriodo };
        const totalInvPesos: ValorMonetario = { saldoPeriodo: i.enPesos.cajaDeAhorro.saldoPeriodo + i.enPesos.plazoFijo.saldoPeriodo + i.enPesos.titulosPublicos.saldoPeriodo + i.enPesos.tiCoCa.saldoPeriodo + i.enPesos.otros.saldoPeriodo, promedioPeriodo: i.enPesos.cajaDeAhorro.promedioPeriodo + i.enPesos.plazoFijo.promedioPeriodo + i.enPesos.titulosPublicos.promedioPeriodo + i.enPesos.tiCoCa.promedioPeriodo + i.enPesos.otros.promedioPeriodo };
        const totalInvME: ValorMonetario = { saldoPeriodo: i.enMonedaExtranjera.cajaDeAhorro.saldoPeriodo + i.enMonedaExtranjera.plazoFijo.saldoPeriodo + i.enMonedaExtranjera.titulosPublicos.saldoPeriodo + i.enMonedaExtranjera.otros.saldoPeriodo, promedioPeriodo: i.enMonedaExtranjera.cajaDeAhorro.promedioPeriodo + i.enMonedaExtranjera.plazoFijo.promedioPeriodo + i.enMonedaExtranjera.titulosPublicos.promedioPeriodo + i.enMonedaExtranjera.otros.promedioPeriodo };
        const totalInversiones: ValorMonetario = { saldoPeriodo: totalInvPesos.saldoPeriodo + totalInvME.saldoPeriodo, promedioPeriodo: totalInvPesos.promedioPeriodo + totalInvME.promedioPeriodo };
        const totalGeneral: ValorMonetario = { saldoPeriodo: totalDisponibilidades.saldoPeriodo + totalInversiones.saldoPeriodo, promedioPeriodo: totalDisponibilidades.promedioPeriodo + totalInversiones.promedioPeriodo };
        return { totalDispPesos, totalDispME, totalDisponibilidades, totalInvPesos, totalInvME, totalInversiones, totalGeneral };
  }, [data]);

  return (
    <div>
        <h2>Anexo I: Disponibilidades e Inversiones</h2>
        <table>
            <thead>
                <tr><th>Concepto</th><th>Saldo en Período</th><th>Promedio Período</th></tr>
            </thead>
            <tbody>
                <TotalRow label="1. TOTAL DISPONIBILIDADES" values={totales.totalDisponibilidades} level={1} />
                <TotalRow label="1.1 Disponibilidades en Pesos" values={totales.totalDispPesos} level={2} />
                <InputField label="1.1.1 Caja" values={data.disponibilidades.enPesos.caja} onChange={(f, v) => handleInputChange('disponibilidades.enPesos.caja', f, v)} />
                <InputField label="1.1.2 Cuenta Corriente" values={data.disponibilidades.enPesos.cuentaCorriente} onChange={(f, v) => handleInputChange('disponibilidades.enPesos.cuentaCorriente', f, v)} />
                <InputField label="1.1.3 Otros" values={data.disponibilidades.enPesos.otros} onChange={(f, v) => handleInputChange('disponibilidades.enPesos.otros', f, v)} />
                <TotalRow label="1.2 Disponibilidades en Moneda Extranjera" values={totales.totalDispME} level={2} />
                <InputField label="1.2.1 Caja" values={data.disponibilidades.enMonedaExtranjera.caja} onChange={(f, v) => handleInputChange('disponibilidades.enMonedaExtranjera.caja', f, v)} />
                <InputField label="1.2.2 Cuenta Corriente" values={data.disponibilidades.enMonedaExtranjera.cuentaCorriente} onChange={(f, v) => handleInputChange('disponibilidades.enMonedaExtranjera.cuentaCorriente', f, v)} />
                <InputField label="1.2.3 Otros" values={data.disponibilidades.enMonedaExtranjera.otros} onChange={(f, v) => handleInputChange('disponibilidades.enMonedaExtranjera.otros', f, v)} />
                <TotalRow label="2. TOTAL INVERSIONES" values={totales.totalInversiones} level={1} />
                <TotalRow label="2.1 Inversiones en Pesos" values={totales.totalInvPesos} level={2} />
                <InputField label="2.1.1 Caja de Ahorro" values={data.inversiones.enPesos.cajaDeAhorro} onChange={(f, v) => handleInputChange('inversiones.enPesos.cajaDeAhorro', f, v)} />
                <InputField label="2.1.2 Plazo Fijo" values={data.inversiones.enPesos.plazoFijo} onChange={(f, v) => handleInputChange('inversiones.enPesos.plazoFijo', f, v)} />
                <InputField label="2.1.3 Títulos Públicos" values={data.inversiones.enPesos.titulosPublicos} onChange={(f, v) => handleInputChange('inversiones.enPesos.titulosPublicos', f, v)} />
                <InputField label="2.1.4 Ti Co Ca" values={data.inversiones.enPesos.tiCoCa} onChange={(f, v) => handleInputChange('inversiones.enPesos.tiCoCa', f, v)} />
                <InputField label="2.1.5 Otros" values={data.inversiones.enPesos.otros} onChange={(f, v) => handleInputChange('inversiones.enPesos.otros', f, v)} />
                <TotalRow label="2.2 Inversiones en Moneda Extranjera" values={totales.totalInvME} level={2} />
                <InputField label="2.2.1 Caja de Ahorro" values={data.inversiones.enMonedaExtranjera.cajaDeAhorro} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.cajaDeAhorro', f, v)} />
                <InputField label="2.2.2 Plazo Fijo" values={data.inversiones.enMonedaExtranjera.plazoFijo} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.plazoFijo', f, v)} />
                <InputField label="2.2.3 Títulos Públicos" values={data.inversiones.enMonedaExtranjera.titulosPublicos} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.titulosPublicos', f, v)} />
                <InputField label="2.2.4 Otros" values={data.inversiones.enMonedaExtranjera.otros} onChange={(f, v) => handleInputChange('inversiones.enMonedaExtranjera.otros', f, v)} />
                <TotalRow label="3. TOTAL GENERAL" values={totales.totalGeneral} level={1} />
            </tbody>
        </table>

    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
      <button onClick={onSave} className="save-button">Guardar Anexo I</button>
      <button onClick={onDelete} className="delete-button">Borrar Datos</button>
    </div>
    </div>
  );
}
