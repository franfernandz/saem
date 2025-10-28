// src/Components/Anexo5Form.tsx

import { useState } from 'react';
import type { Anexo5Data, Anexo5Tabla } from '../types';
import InputFieldAnexo5 from './InputFieldAnexo5';
import { computeAnexo5, validarAnexo5 } from '../utils/macros';

interface Anexo5FormProps {
  data: Anexo5Data;
  setData: React.Dispatch<React.SetStateAction<Anexo5Data>>;
  onSave: () => void;
  onDelete: () => void;
}

function createEmptyFila(pctSin: number, pctPers: number, pctReal: number) {
  return {
    sinGarantia: { ayudasEconomicas: 0, porcentaje: pctSin, montoAPrevisionar: 0 },
    conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: pctPers, montoAPrevisionar: 0 },
    conGarantiaReal: { ayudasEconomicas: 0, porcentaje: pctReal, montoAPrevisionar: 0 },
  };
}

function createTablaWithDefaults(): Anexo5Tabla {
  const normalSin = 0.01, normalPers = 0.01, normalReal = 0.01;
  const bajoSin = 0.05, bajoPers = 0.05, bajoReal = 0.03;
  const medioSin = 0.20, medioPers = 0.20, medioReal = 0.10;
  const altoSin = 0.50, altoPers = 0.25, altoReal = 0.15;
  const irrSin = 1.00, irrPers = 0.50, irrReal = 0.25;
  return {
    normal_pagoIntegro: createEmptyFila(normalSin, normalPers, normalReal),
    normal_amortizable: createEmptyFila(normalSin, normalPers, normalReal),
    normal_total: createEmptyFila(normalSin, normalPers, normalReal),

    riesgoBajo_pagoIntegro: createEmptyFila(bajoSin, bajoPers, bajoReal),
    riesgoBajo_amortizable: createEmptyFila(bajoSin, bajoPers, bajoReal),
    riesgoBajo_total: createEmptyFila(bajoSin, bajoPers, bajoReal),

    riesgoMedio_pagoIntegro: createEmptyFila(medioSin, medioPers, medioReal),
    riesgoMedio_amortizable: createEmptyFila(medioSin, medioPers, medioReal),
    riesgoMedio_total: createEmptyFila(medioSin, medioPers, medioReal),

    riesgoAlto_pagoIntegro: createEmptyFila(altoSin, altoPers, altoReal),
    riesgoAlto_amortizable: createEmptyFila(altoSin, altoPers, altoReal),
    riesgoAlto_total: createEmptyFila(altoSin, altoPers, altoReal),

    irrecuperable_pagoIntegro: createEmptyFila(irrSin, irrPers, irrReal),
    irrecuperable_amortizable: createEmptyFila(irrSin, irrPers, irrReal),
    irrecuperable_total: createEmptyFila(irrSin, irrPers, irrReal),

    total: createEmptyFila(0, 0, 0),
  };
}

export default function Anexo5Form({ onSave, onDelete,}: Anexo5FormProps) {

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

  const [data, setData] = useState<Anexo5Data>(computeAnexo5({
    tablaPesos: createTablaWithDefaults(),
    tablaMonedaExtranjeraEnPesos: createTablaWithDefaults(),
  }));

  const updateFila = (
    tabla: 'tablaPesos' | 'tablaMonedaExtranjeraEnPesos',
    filaKey: keyof Anexo5Tabla
  ) => (
    grupo: 'sinGarantia' | 'conGarantiaPersonal' | 'conGarantiaReal',
    field: 'ayudasEconomicas' | 'porcentaje',
    value: number
  ) => {
      setData(prev => {
        const next: Anexo5Data = JSON.parse(JSON.stringify(prev));
        (next[tabla][filaKey] as any)[grupo][field] = value;
        return computeAnexo5(next);
      });
    };

  const handleSave = () => {
    const errores = validarAnexo5(data);
    if (errores.length) {
      alert('Corrija los errores:\n' + errores.join('\n'));
      return;
    }

    // Función para aplanar una fila en 3 valores
    const flattenFila = (fila: any) => [fila.sinGarantia.ayudasEconomicas, fila.conGarantiaPersonal.ayudasEconomicas, fila.conGarantiaReal.ayudasEconomicas];

    const payload = {
      matricula: 0,
      grado: 0,
      provincia: 0,
      periodo: "2025-09-24",
      entradaWeb: "web",
      t1: flattenFila(data.tablaPesos.normal_pagoIntegro)[0],
      t1b: flattenFila(data.tablaPesos.normal_pagoIntegro)[1],
      t1c: flattenFila(data.tablaPesos.normal_pagoIntegro)[2],
      t2: flattenFila(data.tablaPesos.normal_amortizable)[0],
      t2b: flattenFila(data.tablaPesos.normal_amortizable)[1],
      t2c: flattenFila(data.tablaPesos.normal_amortizable)[2],
      t3: flattenFila(data.tablaPesos.normal_total)[0],
      t3b: flattenFila(data.tablaPesos.normal_total)[1],
      t3c: flattenFila(data.tablaPesos.normal_total)[2],
      t4: flattenFila(data.tablaPesos.riesgoBajo_pagoIntegro)[0],
      t4b: flattenFila(data.tablaPesos.riesgoBajo_pagoIntegro)[1],
      t4c: flattenFila(data.tablaPesos.riesgoBajo_pagoIntegro)[2],
      t5: flattenFila(data.tablaPesos.riesgoBajo_amortizable)[0],
      t5b: flattenFila(data.tablaPesos.riesgoBajo_amortizable)[1],
      t5c: flattenFila(data.tablaPesos.riesgoBajo_amortizable)[2],
      t6: flattenFila(data.tablaPesos.riesgoBajo_total)[0],
      t6b: flattenFila(data.tablaPesos.riesgoBajo_total)[1],
      t6c: flattenFila(data.tablaPesos.riesgoBajo_total)[2],
      t7: flattenFila(data.tablaPesos.riesgoMedio_pagoIntegro)[0],
      t7b: flattenFila(data.tablaPesos.riesgoMedio_pagoIntegro)[1],
      t7c: flattenFila(data.tablaPesos.riesgoMedio_pagoIntegro)[2],
      t8: flattenFila(data.tablaPesos.riesgoMedio_amortizable)[0],
      t8b: flattenFila(data.tablaPesos.riesgoMedio_amortizable)[1],
      t8c: flattenFila(data.tablaPesos.riesgoMedio_amortizable)[2],
      t9: flattenFila(data.tablaPesos.riesgoMedio_total)[0],
      t9b: flattenFila(data.tablaPesos.riesgoMedio_total)[1],
      t9c: flattenFila(data.tablaPesos.riesgoMedio_total)[2],
      t10: flattenFila(data.tablaPesos.riesgoAlto_pagoIntegro)[0],
      t10b: flattenFila(data.tablaPesos.riesgoAlto_pagoIntegro)[1],
      t10c: flattenFila(data.tablaPesos.riesgoAlto_pagoIntegro)[2],
      t11: flattenFila(data.tablaPesos.riesgoAlto_amortizable)[0],
      t11b: flattenFila(data.tablaPesos.riesgoAlto_amortizable)[1],
      t11c: flattenFila(data.tablaPesos.riesgoAlto_amortizable)[2],
      t12: flattenFila(data.tablaPesos.riesgoAlto_total)[0],
      t12b: flattenFila(data.tablaPesos.riesgoAlto_total)[1],
      t12c: flattenFila(data.tablaPesos.riesgoAlto_total)[2],
      t13: flattenFila(data.tablaPesos.irrecuperable_pagoIntegro)[0],
      t13b: flattenFila(data.tablaPesos.irrecuperable_pagoIntegro)[1],
      t13c: flattenFila(data.tablaPesos.irrecuperable_pagoIntegro)[2],
      t14: flattenFila(data.tablaPesos.irrecuperable_amortizable)[0],
      t14b: flattenFila(data.tablaPesos.irrecuperable_amortizable)[1],
      t14c: flattenFila(data.tablaPesos.irrecuperable_amortizable)[2],
      usuario: "usuario123",
      fyH: new Date().toISOString()
    };

    fetch('/api/Anexo5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if (!res.ok) throw new Error('Error al guardar Anexo V');
      alert('Datos guardados correctamente');
    }).catch(err => {
      alert(err.message);
    });
  };

  return (
    <div className="anexo5-form">
      <h2 className="text-lg font-semibold mb-4">Anexo V - Pautas de previsionamiento</h2>

      <div className="table-wrapper" style={{ marginBottom: '20px' }}>
        <h3>Pesos</h3>
        <table>
          <thead>
            <tr>
              <th>CATEGORIA</th>
              <th>Ayudas Económicas (S/GTIA)</th><th>Monto a Previsionar (S/GTIA)</th><th>%</th>
              <th>Ayudas Económicas (C/GTIA PERS)</th><th>Monto a Previsionar (C/GTIA PERS)</th><th>%</th>
              <th>Ayudas Económicas (C/GTIA REAL)</th><th>Monto a Previsionar (C/GTIA REAL)</th><th>%</th>
            </tr>
          </thead>
          <tbody>
            <InputFieldAnexo5 label="NORMAL (Situación 1) - Pago íntegro" values={data.tablaPesos.normal_pagoIntegro} onChange={updateFila('tablaPesos', 'normal_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="NORMAL (Situación 1) - Amortizable" values={data.tablaPesos.normal_amortizable} onChange={updateFila('tablaPesos', 'normal_amortizable')} level={2} />
            <InputFieldAnexo5 label="NORMAL (Situación 1) - TOTAL" values={data.tablaPesos.normal_total} onChange={updateFila('tablaPesos', 'normal_total')} level={1} />

            <InputFieldAnexo5 label="RIESGO BAJO (Situación 2) - Pago íntegro" values={data.tablaPesos.riesgoBajo_pagoIntegro} onChange={updateFila('tablaPesos', 'riesgoBajo_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="RIESGO BAJO (Situación 2) - Amortizable" values={data.tablaPesos.riesgoBajo_amortizable} onChange={updateFila('tablaPesos', 'riesgoBajo_amortizable')} level={2} />
            <InputFieldAnexo5 label="RIESGO BAJO (Situación 2) - TOTAL" values={data.tablaPesos.riesgoBajo_total} onChange={updateFila('tablaPesos', 'riesgoBajo_total')} level={1} />

            <InputFieldAnexo5 label="RIESGO MEDIO (Situación 3) - Pago íntegro" values={data.tablaPesos.riesgoMedio_pagoIntegro} onChange={updateFila('tablaPesos', 'riesgoMedio_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="RIESGO MEDIO (Situación 3) - Amortizable" values={data.tablaPesos.riesgoMedio_amortizable} onChange={updateFila('tablaPesos', 'riesgoMedio_amortizable')} level={2} />
            <InputFieldAnexo5 label="RIESGO MEDIO (Situación 3) - TOTAL" values={data.tablaPesos.riesgoMedio_total} onChange={updateFila('tablaPesos', 'riesgoMedio_total')} level={1} />

            <InputFieldAnexo5 label="RIESGO ALTO (Situación 4) - Pago íntegro" values={data.tablaPesos.riesgoAlto_pagoIntegro} onChange={updateFila('tablaPesos', 'riesgoAlto_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="RIESGO ALTO (Situación 4) - Amortizable" values={data.tablaPesos.riesgoAlto_amortizable} onChange={updateFila('tablaPesos', 'riesgoAlto_amortizable')} level={2} />
            <InputFieldAnexo5 label="RIESGO ALTO (Situación 4) - TOTAL" values={data.tablaPesos.riesgoAlto_total} onChange={updateFila('tablaPesos', 'riesgoAlto_total')} level={1} />

            <InputFieldAnexo5 label="IRRECUPERABLES (Situación 5) - Pago íntegro" values={data.tablaPesos.irrecuperable_pagoIntegro} onChange={updateFila('tablaPesos', 'irrecuperable_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="IRRECUPERABLES (Situación 5) - Amortizable" values={data.tablaPesos.irrecuperable_amortizable} onChange={updateFila('tablaPesos', 'irrecuperable_amortizable')} level={2} />
            <InputFieldAnexo5 label="IRRECUPERABLES (Situación 5) - TOTAL" values={data.tablaPesos.irrecuperable_total} onChange={updateFila('tablaPesos', 'irrecuperable_total')} level={1} />

            <InputFieldAnexo5 label="TOTAL EN PESOS" values={data.tablaPesos.total} onChange={updateFila('tablaPesos', 'total')} level={1} />
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3>Moneda Extranjera en Pesos</h3>
        <table>
          <thead>
            <tr>
              <th>CATEGORIA</th>
              <th>Ayudas Económicas (S/GTIA)</th><th>Monto a Previsionar (S/GTIA)</th><th>%</th>
              <th>Ayudas Económicas (C/GTIA PERS)</th><th>Monto a Previsionar (C/GTIA PERS)</th><th>%</th>
              <th>Ayudas Económicas (C/GTIA REAL)</th><th>Monto a Previsionar (C/GTIA REAL)</th><th>%</th>
            </tr>
          </thead>
          <tbody>
            <InputFieldAnexo5 label="NORMAL (Situación 1) - Pago íntegro" values={data.tablaMonedaExtranjeraEnPesos.normal_pagoIntegro} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'normal_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="NORMAL (Situación 1) - Amortizable" values={data.tablaMonedaExtranjeraEnPesos.normal_amortizable} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'normal_amortizable')} level={2} />
            <InputFieldAnexo5 label="NORMAL (Situación 1) - TOTAL" values={data.tablaMonedaExtranjeraEnPesos.normal_total} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'normal_total')} level={1} />

            <InputFieldAnexo5 label="RIESGO BAJO (Situación 2) - Pago íntegro" values={data.tablaMonedaExtranjeraEnPesos.riesgoBajo_pagoIntegro} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoBajo_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="RIESGO BAJO (Situación 2) - Amortizable" values={data.tablaMonedaExtranjeraEnPesos.riesgoBajo_amortizable} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoBajo_amortizable')} level={2} />
            <InputFieldAnexo5 label="RIESGO BAJO (Situación 2) - TOTAL" values={data.tablaMonedaExtranjeraEnPesos.riesgoBajo_total} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoBajo_total')} level={1} />

            <InputFieldAnexo5 label="RIESGO MEDIO (Situación 3) - Pago íntegro" values={data.tablaMonedaExtranjeraEnPesos.riesgoMedio_pagoIntegro} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoMedio_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="RIESGO MEDIO (Situación 3) - Amortizable" values={data.tablaMonedaExtranjeraEnPesos.riesgoMedio_amortizable} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoMedio_amortizable')} level={2} />
            <InputFieldAnexo5 label="RIESGO MEDIO (Situación 3) - TOTAL" values={data.tablaMonedaExtranjeraEnPesos.riesgoMedio_total} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoMedio_total')} level={1} />

            <InputFieldAnexo5 label="RIESGO ALTO (Situación 4) - Pago íntegro" values={data.tablaMonedaExtranjeraEnPesos.riesgoAlto_pagoIntegro} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoAlto_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="RIESGO ALTO (Situación 4) - Amortizable" values={data.tablaMonedaExtranjeraEnPesos.riesgoAlto_amortizable} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoAlto_amortizable')} level={2} />
            <InputFieldAnexo5 label="RIESGO ALTO (Situación 4) - TOTAL" values={data.tablaMonedaExtranjeraEnPesos.riesgoAlto_total} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'riesgoAlto_total')} level={1} />

            <InputFieldAnexo5 label="IRRECUPERABLES (Situación 5) - Pago íntegro" values={data.tablaMonedaExtranjeraEnPesos.irrecuperable_pagoIntegro} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'irrecuperable_pagoIntegro')} level={2} />
            <InputFieldAnexo5 label="IRRECUPERABLES (Situación 5) - Amortizable" values={data.tablaMonedaExtranjeraEnPesos.irrecuperable_amortizable} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'irrecuperable_amortizable')} level={2} />
            <InputFieldAnexo5 label="IRRECUPERABLES (Situación 5) - TOTAL" values={data.tablaMonedaExtranjeraEnPesos.irrecuperable_total} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'irrecuperable_total')} level={1} />

            <InputFieldAnexo5 label="TOTAL MONEDA EXTRANJERA EN PESOS" values={data.tablaMonedaExtranjeraEnPesos.total} onChange={updateFila('tablaMonedaExtranjeraEnPesos', 'total')} level={1} />
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onSave} className="save-button">Guardar Anexo V</button>
        <button onClick={() => setShowDeleteModal(true)} className="delete-button">Borrar Datos</button>
      </div>
      <DeleteModal />
    </div>
  );
}
