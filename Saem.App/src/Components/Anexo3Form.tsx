// Saem.App/src/components/Anexo3Form.tsx

import React, {  useState } from 'react';
import type { Anexo3Data } from '../types';
import { InputFieldAnexo3 } from './InputFieldAnexo3';
import { updateAnexo3Input } from '../utils/macros';

interface Anexo3FormProps {
  data: Anexo3Data;
  setData: React.Dispatch<React.SetStateAction<Anexo3Data>>;
  onSave: () => void;
  onDelete: () => void;
}



export function Anexo3Form({ data, setData, onSave, onDelete }: Anexo3FormProps) {
  // Los datos vienen como props desde App.tsx, no necesitamos useState local


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

  const handleInputChange = (
    apartado: 'ApartadoAInputs' | 'ApartadoBInputs' | 'ApartadoCInputs' | 'ApartadoDInputs',
    field: string,
    value: number
  ) => {
    setData(prev => updateAnexo3Input(prev, apartado, field, value));
  };

  // seguridad: normalizar estructura de `data` para evitar lecturas sobre `undefined`
  const defaults = {
    ApartadoAInputs: { PorcentajeArt9IncB: 0 },
    ApartadoBInputs: { PatrimonioNeto: 0, InversionesInmuebles: 0, OtrosActivosFijos: 0, CargosDiferidos: 0, ActivosNoCorrientesNeto: 0 },
    ApartadoCInputs: { PorcentajeLimite: 0, MontoMaximo: 0, AhorrosQueSuperanLimite: 0, CantidadSociosAyuda: 0, CantidadSociosAhorro: 0, PorcentajeLimiteAyuda: 0, PorcentajeLimiteAhorro: 0 },
    ApartadoDInputs: { PromedioAyuda: 0, CantidadCuentas: 0, PromedioMaximoAyuda: 0 },
    ApartadoA_SaldoPromedioTotalCuentasAhorroMutual: 0,
    ApartadoA_Total_1_3: 0,
    ApartadoA_SaldoPromedioDisponibilidadesInversiones: 0,
    ApartadoA_MargenDeficienciaPeriodo: 0,
    ApartadoB_CapitalLiquido: 0,
    ApartadoB_MaximoCaptacionCapitalLiquido: 0,
    ApartadoB_MaximoCaptacionPatrimonioNeto: 0,
    ApartadoB_CaptacionAhorroReferencia: 0,
    ApartadoB_MargenDeficienciaCapitalLiquido: 0,
    ApartadoB_MargenDeficienciaPatrimonioNeto: 0,
    ApartadoC_MontoMaximo: 0,
    ApartadoC_CapacidadPrestable: 0,
    ApartadoC_MaximoAyudaYAhorro: 0,
    ApartadoD_PromedioMaximoAyuda: 0,
    ApartadoC_CapitalLiquido: 0,
    ApartadoC_Maximo: 0,
    ApartadoC_AhorrosAsociados: 0,
    ApartadoC_Menos: 0,
    ApartadoC_FondoGarantia: 0,
    ApartadoC_Mas: 0,
    ApartadoC_CapitalLiquido2: 0,
    ApartadoC_PorcentajeAyuda: 0,
    ApartadoC_PorcentajeAhorro: 0,
    ApartadoC_MaximoAyudaAhorro: 0,
    ApartadoC_AyudasSuperanLimite: 0,
    ApartadoC_CantSociosAyuda: 0,
    ApartadoC_CantSociosAhorro: 0,
    ApartadoD_PromedioAyudaTotal: 0,
    ApartadoD_CantidadCuentas: 0,
    ApartadoD_PromedioMaximo: 0,
  } as const;

  const dataSafe = {
    ...defaults,
    ...(data || {}),
    ApartadoAInputs: { ...(defaults.ApartadoAInputs), ...((data && (data as any).ApartadoAInputs) || {}) },
    ApartadoBInputs: { ...(defaults.ApartadoBInputs), ...((data && (data as any).ApartadoBInputs) || {}) },
    ApartadoCInputs: { ...(defaults.ApartadoCInputs), ...((data && (data as any).ApartadoCInputs) || {}) },
    ApartadoDInputs: { ...(defaults.ApartadoDInputs), ...((data && (data as any).ApartadoDInputs) || {}) },
  } as any;

  // Componente auxiliar para mostrar valores calculados / read-only
  function DisplayRow({
    label,
    value,
    level = 2,
    isPercentage = false,
  }: {
    label: string;
    value: number;
    level?: number;
    isPercentage?: boolean;
  }) {
    return (
      <InputFieldAnexo3
        label={label}
        value={value}
        onChange={() => { }}
        isPercentage={isPercentage}
        isReadOnly={true}
        level={level}
      />
    );
  }

  return (
    <div>
      <h2>Anexo III: Relaciones</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {/* APARTADO A */}
            <tr className="level-1"><td colSpan={2}>APARTADO A: FONDO DE GARANTÍA (Artículo 9º)</td></tr><tr><td colSpan={2}></td></tr><tr className="level-2"><td colSpan={2}>1. PARTIDAS SUJETAS</td></tr><DisplayRow label="1.1 SALDO PROMEDIO TOTAL CUENTAS AHORRO MUTUAL (Importe renglón 3 Apartado A Columna b Anexo II )" value={dataSafe.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual} level={3} /><InputFieldAnexo3 label="1.2 PORCENTAJE s/art. 9º Inc. b)" value={dataSafe.ApartadoAInputs.PorcentajeArt9IncB} onChange={v => handleInputChange('ApartadoAInputs', 'PorcentajeArt9IncB', v)} isPercentage={true} level={3} /><DisplayRow label="1.3 TOTAL (renglón 1.1 x renglón 1.2)" value={dataSafe.ApartadoA_Total_1_3} level={3} /><tr><td colSpan={2}></td></tr><tr className="level-2"><td colSpan={2}>2. INTEGRACIÓN</td></tr><DisplayRow label="2.1 SALDO PROMEDIO DE DISPONIBILIDADES E INVERSIONES (Importe renglón 3 Anexo I )" value={dataSafe.ApartadoA_SaldoPromedioDisponibilidadesInversiones} level={3} /><tr><td colSpan={2}></td></tr><DisplayRow label="3. MARGEN (+) O DEFICIENCIA (-) DEL PERIODO (Resultado: renglón 2.1 menos renglón 1.3)" value={dataSafe.ApartadoA_MargenDeficienciaPeriodo} level={1} />

            {/* APARTADO B */}
            <td colSpan={2}> </td><tr className="level-1"><td colSpan={2}>APARTADO B: LIMITE MAXIMO CAPTACION AHORRO (Artículo 10º)</td></tr><td colSpan={2}> </td><DisplayRow label="1. CAPITAL LIQUIDO (Patrimonio Neto) - (Sumatoria renglones 1.2 a 1.5)" value={dataSafe.ApartadoB_CapitalLiquido} level={1} /><InputFieldAnexo3 label="1.1 Patrimonio Neto" value={dataSafe.ApartadoBInputs.PatrimonioNeto} onChange={v => handleInputChange('ApartadoBInputs', 'PatrimonioNeto', v)} level={3} /><tr className="level-2"><td colSpan={2} style={{ paddingLeft: '30px' }}>MENOS:</td></tr><InputFieldAnexo3 label="1.2 Inversiones en inmuebles" value={dataSafe.ApartadoBInputs.InversionesInmuebles} onChange={v => handleInputChange('ApartadoBInputs', 'InversionesInmuebles', v)} level={3} /><InputFieldAnexo3 label="1.3 Otros Activos Fijos" value={dataSafe.ApartadoBInputs.OtrosActivosFijos} onChange={v => handleInputChange('ApartadoBInputs', 'OtrosActivosFijos', v)} level={3} /><InputFieldAnexo3 label="1.4 Cargos Diferidos" value={dataSafe.ApartadoBInputs.CargosDiferidos} onChange={v => handleInputChange('ApartadoBInputs', 'CargosDiferidos', v)} level={3} /><InputFieldAnexo3 label="1.5 Activos No Corrientes (No vinculados al Servicio) - Pasivos No Corrientes asociados a los mismos" value={dataSafe.ApartadoBInputs.ActivosNoCorrientesNeto} onChange={v => handleInputChange('ApartadoBInputs', 'ActivosNoCorrientesNeto', v)} level={3} /><tr><td colSpan={2}></td></tr><tr className="level-2"><td colSpan={2}>2. MAXIMO DE CAPTACIÓN</td></tr><DisplayRow label="2.1 CAPITAL LIQUIDO (Renglón 1 Apartado B del Anexo III ) x 25 veces" value={dataSafe.ApartadoB_MaximoCaptacionCapitalLiquido} level={3} /><DisplayRow label="2.2 PATRIMONIO NETO (Renglón 1.1) x 15 veces" value={dataSafe.ApartadoB_MaximoCaptacionPatrimonioNeto} level={3} /><tr><td colSpan={2}></td></tr><DisplayRow label="3. CAPTACIÓN DE AHORRO (Renglón 3 Apartado A Columna b - Anexo II)" value={dataSafe.ApartadoB_CaptacionAhorroReferencia} level={3} /><tr><td colSpan={2}></td></tr><tr className="level-2"><td colSpan={2}>4. MARGEN (+) O DEFICIENCIA (-) DEL LIMITE</td></tr><DisplayRow label="Resultado: renglón 2.1 menos renglón 3" value={dataSafe.ApartadoB_MargenDeficienciaCapitalLiquido} level={3} /><DisplayRow label="Resultado : renglón 2.2 menos renglón 3" value={dataSafe.ApartadoB_MargenDeficienciaPatrimonioNeto} level={3} />
          </tbody>
        </table>
      </div>


      <h2>Anexo III: Relaciones Técnicas</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {/* APARTADO C */}
            <tr className="level-1"><td colSpan={2}>APARTADO C: MONTO MAXIMO POR ASOCIADO POR AYUDA Y AHORRO</td></tr><td colSpan={2}> </td>

            <DisplayRow
              label="1. CAPITAL LIQUIDO (Apartado B Punto 1.)"
              value={dataSafe.ApartadoC_CapitalLiquido}
              level={3}
            />
            <InputFieldAnexo3
              label="1.1 Porcentaje límite"
              value={dataSafe.ApartadoCInputs.PorcentajeLimite}
              onChange={v => handleInputChange('ApartadoCInputs', 'PorcentajeLimite', v)}
              isPercentage={true}
              level={3}
            />
            <DisplayRow
              label="1.2 Monto Máximo (13 % del Capital Líquido)"
              value={dataSafe.ApartadoC_Maximo}
              level={3}
            />
            <td colSpan={2}> </td><tr className="level-1" style={{ marginTop: '20px' }}><td colSpan={2}>APARTADO B: LIMITE MAXIMO CAPTACION AHORRO (Artículo 10º)</td></tr><td colSpan={2}> </td><DisplayRow label="1. CAPITAL LIQUIDO (Patrimonio Neto) - (Sumatoria renglones 1.2 a 1.5)" value={dataSafe.ApartadoB_CapitalLiquido} level={1} /><InputFieldAnexo3 label="1.1 Patrimonio Neto" value={dataSafe.ApartadoBInputs.PatrimonioNeto} onChange={v => handleInputChange('ApartadoBInputs', 'PatrimonioNeto', v)} level={3} /><tr className="level-2"><td colSpan={2} style={{ paddingLeft: '30px' }}>MENOS:</td></tr><InputFieldAnexo3 label="1.2 Inversiones en inmuebles" value={dataSafe.ApartadoBInputs.InversionesInmuebles} onChange={v => handleInputChange('ApartadoBInputs', 'InversionesInmuebles', v)} level={3} /><InputFieldAnexo3 label="1.3 Otros Activos Fijos" value={dataSafe.ApartadoBInputs.OtrosActivosFijos} onChange={v => handleInputChange('ApartadoBInputs', 'OtrosActivosFijos', v)} level={3} /><InputFieldAnexo3 label="1.4 Cargos Diferidos" value={dataSafe.ApartadoBInputs.CargosDiferidos} onChange={v => handleInputChange('ApartadoBInputs', 'CargosDiferidos', v)} level={3} /><InputFieldAnexo3 label="1.5 Activos No Corrientes (No vinculados al Servicio) - Pasivos No Corrientes asociados a los mismos" value={dataSafe.ApartadoBInputs.ActivosNoCorrientesNeto} onChange={v => handleInputChange('ApartadoBInputs', 'ActivosNoCorrientesNeto', v)} level={3} /><tr><td colSpan={2}></td></tr><tr className="level-2"><td colSpan={2}>2. MAXIMO DE CAPTACIÓN</td></tr><DisplayRow label="2.1 CAPITAL LIQUIDO (Renglón 1 Apartado B del Anexo III ) x 25 veces" value={dataSafe.ApartadoB_MaximoCaptacionCapitalLiquido} level={3} /><DisplayRow label="2.2 PATRIMONIO NETO (Renglón 1.1) x 15 veces" value={dataSafe.ApartadoB_MaximoCaptacionPatrimonioNeto} level={3} /><tr><td colSpan={2}></td></tr><DisplayRow label="3. CAPTACIÓN DE AHORRO (Renglón 3 Apartado A Columna b - Anexo II)" value={dataSafe.ApartadoB_CaptacionAhorroReferencia} level={3} /><tr><td colSpan={2}></td></tr><tr className="level-2"><td colSpan={2}>4. MARGEN (+) O DEFICIENCIA (-) DEL LIMITE</td></tr><DisplayRow label="Resultado: renglón 2.1 menos renglón 3" value={dataSafe.ApartadoB_MargenDeficienciaCapitalLiquido} level={3} /><DisplayRow label="Resultado : renglón 2.2 menos renglón 3" value={dataSafe.ApartadoB_MargenDeficienciaPatrimonioNeto} level={3} />
            <DisplayRow
              label="2. CAPACIDAD PRESTABLE (Suma del 2.1 menos  2.2  más 2.3)"
              value={dataSafe.ApartadoC_CapacidadPrestable}
              level={3}
            />
            <DisplayRow
              label="2.1 Ahorros de los Asociados (Apartado A -punto 1.1)"
              value={dataSafe.ApartadoC_AhorrosAsociados}
              level={3}
            />
            <DisplayRow
              label="Menos"
              value={dataSafe.ApartadoC_Menos}
              level={3}
            />
            <DisplayRow
              label="2.2 Fondo de Garantía Exigible (Apartado A -punto 1.3)"
              value={dataSafe.ApartadoC_FondoGarantia}
              level={3}
            />
            <DisplayRow
              label="Más"
              value={dataSafe.ApartadoC_Mas}
              level={3}
            />
            <DisplayRow
              label="2.3 Capital Líquido (Apartado B -punto 1.)"
              value={dataSafe.ApartadoC_CapitalLiquido2}
              level={3}
            />
            <DisplayRow
              label="2.4 Porcentaje Límite para Ayuda (8% de la Capacidad Prestable)"
              value={dataSafe.ApartadoC_PorcentajeAyuda}
              level={3}
              isPercentage={true}
            />
            <DisplayRow
              label="2.5 Porcentaje Límite para Ahorro (5% de la Capacidad Prestable o 10 % del Capital Liquido)"
              value={dataSafe.ApartadoC_PorcentajeAhorro}
              level={3}
              isPercentage={true}
            />

            <DisplayRow
              label="3. MAXIMO DE AYUDA Y AHORRO POR ASOCIADO"
              value={dataSafe.ApartadoC_MaximoAyudaAhorro}
              level={3}
            />
            <DisplayRow
              label="3.1 Ayudas Económicas que superan el Limite Maximo (Importe Mayor Entre 2.4 y 1.2)"
              value={dataSafe.ApartadoC_AyudasSuperanLimite}
              level={3}
            />
            <DisplayRow
              label="3.1.1 Ayudas Económicas - Cantidad de Socios que superan el Límite Máximo"
              value={dataSafe.ApartadoC_CantSociosAyuda}
              level={3}
            />
            <DisplayRow
              label="3.2 Ahorros que superan el Límite Mäximo (importe igual a 2.5)"
              value={dataSafe.ApartadoC_AhorrosSuperanLimite}
              level={3}
            />
            <DisplayRow
              label="3.2.1 Ahorro - Cantidad de Socios que superan el Límite Máximo"
              value={dataSafe.ApartadoC_CantSociosAhorro}
              level={3}
            />

            {/* APARTADO D */}
            <tr className="level-1" style={{ marginTop: '20px' }}>
              <td colSpan={2}>APARTADO D: PROMEDIO DE AYUDAS ECONÓMICAS P/ASOC.</td>
            </tr>
            <tr><td colSpan={2}></td></tr>

            <DisplayRow
              label="2.1 PROMEDIO TOTAL DE AYUDA ECONOMICA (Imp. Renglón 3 Apartado B Columna b Anexo II)"
              value={dataSafe.ApartadoD_PromedioAyudaTotal}
              level={3}
            />
            <DisplayRow
              label="2.2 CANTIDAD DE CUENTAS DE ASOCIADOS VIGENTES (Imp. Reng. 3 Apart. B Col. c Anexo II)"
              value={dataSafe.ApartadoD_CantidadCuentas}
              level={3}
            />
            <DisplayRow
              label="2.3 PROMEDIO MAXIMO DE AYUDA POR ASOCIADO (Imp. Reng. 2.1/2.2 Apart. D Anexo III)"
              value={dataSafe.ApartadoD_PromedioMaximo}
              level={3}
            />
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onSave} className="save-button">
          Guardar Anexo III
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="delete-button">
          Borrar Datos
        </button>
      </div>
      <DeleteModal />
    </div>



  );

}
