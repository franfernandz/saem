

import { useMemo, useState } from 'react';
import type { Anexo1Data, ValorMonetario } from '../types';
import { InputField } from './InputField';
import axios, { AxiosError } from "axios";
import userAPI from './userApi.tsx'

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


// Mapea Anexo1Data al formato plano requerido por la API externa
function mapAnexo1ToExternalJson(data: Anexo1Data) {
  // Por ahora, hardcodea todos los campos menos los t1a/t1b...t22a/t22b
  // Puedes ajustar el mapeo según la estructura real de tu tabla
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const fyH = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.000Z`;
  // Genera un string único para entradaWeb
  // Ejemplo: mapea los primeros campos, el resto puedes completarlo igual

  return {
    matricula: 123456, // hardcodeado
    grado: 666,
    provincia: 666,
    periodo: "2025-01", // puedes ajustar según tu lógica
    
    t1a: data.disponibilidades.enPesos.caja.saldoPeriodo,
    t1b: data.disponibilidades.enPesos.caja.promedioPeriodo,
    t2a: data.disponibilidades.enPesos.cuentaCorriente.saldoPeriodo,
    t2b: data.disponibilidades.enPesos.cuentaCorriente.promedioPeriodo,
    t3a: data.disponibilidades.enPesos.otros.saldoPeriodo,
    t3b: data.disponibilidades.enPesos.otros.promedioPeriodo,
    t4a: data.disponibilidades.enMonedaExtranjera.caja.saldoPeriodo,
    t4b: data.disponibilidades.enMonedaExtranjera.caja.promedioPeriodo,
    t5a: data.disponibilidades.enMonedaExtranjera.cuentaCorriente.saldoPeriodo,
    t5b: data.disponibilidades.enMonedaExtranjera.cuentaCorriente.promedioPeriodo,
    t6a: data.disponibilidades.enMonedaExtranjera.otros.saldoPeriodo,
    t6b: data.disponibilidades.enMonedaExtranjera.otros.promedioPeriodo,
    t7a: data.inversiones.enPesos.cajaDeAhorro.saldoPeriodo,
    t7b: data.inversiones.enPesos.cajaDeAhorro.promedioPeriodo,
    t8a: data.inversiones.enPesos.plazoFijo.saldoPeriodo,
    t8b: data.inversiones.enPesos.plazoFijo.promedioPeriodo,
    t9a: data.inversiones.enPesos.titulosPublicos.saldoPeriodo,
    t9b: data.inversiones.enPesos.titulosPublicos.promedioPeriodo,
    t10a: data.inversiones.enPesos.tiCoCa.saldoPeriodo,
    t10b: data.inversiones.enPesos.tiCoCa.promedioPeriodo,
    t11a: data.inversiones.enPesos.otros.saldoPeriodo,
    t11b: data.inversiones.enPesos.otros.promedioPeriodo,
    t12a: data.inversiones.enMonedaExtranjera.cajaDeAhorro.saldoPeriodo,
    t12b: data.inversiones.enMonedaExtranjera.cajaDeAhorro.promedioPeriodo,
    t13a: data.inversiones.enMonedaExtranjera.plazoFijo.saldoPeriodo,
    t13b: data.inversiones.enMonedaExtranjera.plazoFijo.promedioPeriodo,
    t14a: data.inversiones.enMonedaExtranjera.titulosPublicos.saldoPeriodo,
    t14b: data.inversiones.enMonedaExtranjera.titulosPublicos.promedioPeriodo,
    t15a: data.inversiones.enMonedaExtranjera.otros.saldoPeriodo,
    t15b: data.inversiones.enMonedaExtranjera.otros.promedioPeriodo,
    // El resto de los campos t16a...t22b puedes poner 0 o 666 por ahora
    t16a: 666, t16b: 666, t17a: 666, t17b: 666, t18a: 666, t18b: 666, t19a: 666, t19b: 666, t20a: 666, t20b: 666, t21a: 666, t21b: 666, t22a: 666, t22b: 666,
    usuario: "usuario-demo",
    fyH
  };
}

export function Anexo1Form({ data, setData, onDelete, onSave }: Anexo1FormProps) {

  //Modal de borrado de datos
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  
    // 🔹 Modal de confirmación
    const DeleteModal: React.FC = () => {
      if (!showDeleteModal) return null;
      return (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}>
            <h3>¿Estás seguro de borrar los datos?</h3>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "20px" }}>
              <button
                onClick={() => {
                  onDelete();              // 👈 solo acá se borran los datos
                  setShowDeleteModal(false);
                }}
                className="delete-button"
              >
                Borrar Datos
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="save-button"
              >
                Conservar Datos
              </button>
            </div>
          </div>
        </div>
      );
    };

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

  // Nueva función para guardar en la API externa
  const handleSaveExternal = async () => {
    const jsonPayload = mapAnexo1ToExternalJson(data);

    const config = {
      'mode': 'no-cors' as RequestMode, // Intenta evitar problemas de CORS
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
        "Cache-Control": "no-cache"
      }
    };

    try {
      await axios.post(
        "/ServiciosSAEM/api/Anexo1",
        jsonPayload,
        config
      );
      alert("Datos enviados correctamente a la API externa.");
    } catch (err) {
      let errorMessage = "Error al enviar datos a la API externa.";

      // Check if this is an Axios error
      if (err instanceof AxiosError) {
        // You can choose to ignore specific status codes
        if (err.status === 404) {
          errorMessage = "La ruta de la API es incorrecta.";
          console.warn(errorMessage);
          return;
        }

        // Log detailed error information
        console.error("Error detalles:");
        console.error("Status: ", err.status);
        console.error("Message: ", err.message);
        console.error("Stack: ", err.stack);
        console.error("Request URL: ", err.request?.url);
        console.error("Response Data: ", err.response?.data);

        // If it's a valid error, re-throw it
        throw err;
      } else {
        // For any other type of error, log and re-throw
        console.error("Error no gestionado:");
        console.error(err);
        throw err;
      }
    }
  };


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
        <button onClick={() => setShowDeleteModal(true)} className="delete-button">Borrar Datos</button>
      </div>
      <DeleteModal />
    </div>
  );
}






