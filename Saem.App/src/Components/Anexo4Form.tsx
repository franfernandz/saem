// src/Components/Anexo4Form.tsx
import { useState } from 'react';
import InputFieldAnexo4 from './InputFieldAnexo4';
import type { Anexo4Data, ValoresSituacionAnexo4 } from '../types';
import { validarAnexo4Completo } from '../utils/macros';
import axios from 'axios';


// onSave, onDelete

interface Anexo4FormProps {
  data: Anexo4Data;
  setData: React.Dispatch<React.SetStateAction<Anexo4Data>>;
  onSave: () => void;
  onDelete: () => void;
}
export function Anexo4Form({ onDelete, onSave  }: Anexo4FormProps) {

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

  const emptyVals = (): ValoresSituacionAnexo4 => ({
    situacion1: 0, situacion2: 0, situacion3: 0, situacion4: 0, situacion5: 0
  });



  const [data, setData] = useState<Anexo4Data>({
    totalGeneralAyudaEconomica: emptyVals(),
    pagoIntegro: emptyVals(),
    pagoIntegroVencido: emptyVals(),
    pagoIntegroAVencer: emptyVals(),
    pagoIntegroAVencer_30: emptyVals(),
    pagoIntegroAVencer_30a89: emptyVals(),
    pagoIntegroAVencer_90mas: emptyVals(),
    amortizable: emptyVals(),
    amortizableVencido: emptyVals(),
    amortizableAVencer: emptyVals(),
    amortizableAVencer_3m: emptyVals(),
    amortizableAVencer_6m: emptyVals(),
    amortizableAVencer_12m: emptyVals(),
    amortizableAVencer_resto: emptyVals(),
    porcentajeAyudaConGtiaReal: 0,
    porcentajeAyudaConGtiaPers: 0,
    previsionesIncobrablesAcumuladas: 0,
    previsionesAConstituir: 0,
  });

  const updateFila = (key: keyof Anexo4Data) => (field: keyof ValoresSituacionAnexo4, value: number) => {
    setData(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] as ValoresSituacionAnexo4),
        [field]: value,
      }
    }));
  };

  return (
    <div className="anexo4-form">
      <h2 className="text-lg font-semibold mb-4">Anexo IV - Estado de las ayudas económicas</h2>

      <div className="table-wrapper anexo4-table">
        <table>
          <colgroup>
            <col style={{ width: '50px' }} /> {/* Label */}
            <col style={{ width: '10px' }} /> {/* Columna B vacía */}
            <col style={{ width: '100px' }} /> {/* Columna C vacía */}
            <col style={{ width: '250px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '300px' }} />
          </colgroup>

          <thead>
            <tr>
              <th aria-hidden="true"></th>
              <th></th>
              <th></th>
              <th>SAL. DE DEU.</th>
              <th>SITUACION 1<br />NORMAL (hasta 30 días)</th>
              <th>SITUACION 2<br />RIESGO BAJO (31-90 días)</th>
              <th>SITUACION 3<br />RIESGO MEDIO (91-180 días)</th>
              <th>SITUACION 4<br />RIESGO ALTO (181-365 días)</th>
              <th>SITUACION 5<br />IRRECUPERABLE (&gt;365 días)</th>
            </tr>
          </thead>

          <tbody>

            <InputFieldAnexo4
              label="1. TOTAL GENERAL AYUDA ECONOMICA"
              values={data.totalGeneralAyudaEconomica}
              onChange={updateFila('totalGeneralAyudaEconomica')}
              level={1}
              col1="1"
            />

            <InputFieldAnexo4
              label="PAGO INTEGRO (sumat. Rengl. 1.1.1 al 1.1.2)"
              values={data.pagoIntegro}
              onChange={updateFila('pagoIntegro')}
              level={2}
            />

            <InputFieldAnexo4
              label="1.1.1 VENCIDO"
              values={data.pagoIntegroVencido}
              onChange={updateFila('pagoIntegroVencido')}
              level={3}
            />

            <InputFieldAnexo4
              label="1.1.2 A VENCER (sumat.rengl. 1.1.2.1 a 1.1.2.3)"
              values={data.pagoIntegroAVencer}
              onChange={updateFila('pagoIntegroAVencer')}
              level={3}
            />

            <InputFieldAnexo4
              label="1.1.2.1 Hasta 30 días"
              values={data.pagoIntegroAVencer_30}
              onChange={updateFila('pagoIntegroAVencer_30')}
              level={4}
            />

            <InputFieldAnexo4
              label="1.1.2.2 De 30 a 89 días"
              values={data.pagoIntegroAVencer_30a89}
              onChange={updateFila('pagoIntegroAVencer_30a89')}
              level={4}
            />

            <InputFieldAnexo4
              label="1.1.2.3 90 dias en más"
              values={data.pagoIntegroAVencer_90mas}
              onChange={updateFila('pagoIntegroAVencer_90mas')}
              level={4}
            />

            <InputFieldAnexo4
              label="AMORTIZABLE (sumat.Rengl.1.2.1 a 1.2.2.)"
              values={data.amortizable}
              onChange={updateFila('amortizable')}
              level={1}
              col1="2"
            />

            <InputFieldAnexo4
              label="1.2.1 VENCIDO"
              values={data.amortizableVencido}
              onChange={updateFila('amortizableVencido')}
              level={3}
            />

            <InputFieldAnexo4
              label="1.2.2 A VENCER (sumat.rengl. 1.2.2.1  a 1.2.2.4)"
              values={data.amortizableAVencer}
              onChange={updateFila('amortizableAVencer')}
              level={2}
            />

            <InputFieldAnexo4
              label="1.2.2.1 Hasta 3 meses"
              values={data.amortizableAVencer_3m}
              onChange={updateFila('amortizableAVencer_3m')}
              level={4}
            />

            <InputFieldAnexo4
              label="1.2.2.2 Hasta 6 meses"
              values={data.amortizableAVencer_6m}
              onChange={updateFila('amortizableAVencer_6m')}
              level={4}
            />

            <InputFieldAnexo4
              label="1.2.2.3 Hasta 12 meses"
              values={data.amortizableAVencer_12m}
              onChange={updateFila('amortizableAVencer_12m')}
              level={4}
            />

            <InputFieldAnexo4
              label="1.2.2.4 Resto"
              values={data.amortizableAVencer_resto}
              onChange={updateFila('amortizableAVencer_resto')}
              level={4}
            />




            <tr className="level-1">
              <td style={{ textAlign: 'center' }}>2</td>

              <td>PORCENTAJE AYUDA ECON. C/GTIA. REAL</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <input type="number" value={data.porcentajeAyudaConGtiaReal} onChange={e => setData(prev => ({ ...prev, porcentajeAyudaConGtiaReal: parseFloat(e.target.value) || 0 }))} style={{ width: '180px', textAlign: 'right' }} />
              </td>
              <td>%</td>
              <td></td>
              <td></td>
            </tr>
            <tr className="level-1">
              <td style={{ textAlign: 'center' }}>3</td>
              <td>PORCENTAJE AYUDA ECON. C/GTIA. PERS.</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <input type="number" value={data.porcentajeAyudaConGtiaPers} onChange={e => setData(prev => ({ ...prev, porcentajeAyudaConGtiaPers: parseFloat(e.target.value) || 0 }))} style={{ width: '180px', textAlign: 'right' }} />
              </td>
              <td>%</td>
              <td></td>
              <td></td>
            </tr>
            <tr className="level-1">
              <td style={{ textAlign: 'center' }}>4</td>
              <td>PREVISIONES INCOBRABLES ACUMULADAS</td>
              <td></td>
              <td></td>
              <td></td>

              <td>
                <input type="number" value={data.previsionesIncobrablesAcumuladas} onChange={e => setData(prev => ({ ...prev, previsionesIncobrablesAcumuladas: parseFloat(e.target.value) || 0 }))} style={{ width: '180px', textAlign: 'right' }} />
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr className="level-1">
              <td style={{ textAlign: 'center' }}>5</td>
              <td>PREVISIONES A CONSTITUIR (Anexo V)</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <input type="number" value={data.previsionesAConstituir} onChange={e => setData(prev => ({ ...prev, previsionesAConstituir: parseFloat(e.target.value) || 0 }))} style={{ width: '180px', textAlign: 'right' }} />
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
          <button onClick={onSave} className="save-button">Guardar Anexo IV</button>
          {/* <button onClick={onSave} className="save-button">Guardar Anexo I (local)</button> */}
          <button onClick={() => setShowDeleteModal(true)} className="delete-button">Borrar Datos</button>
        </div>

      </div>
      <DeleteModal />
    </div>
  );
}
