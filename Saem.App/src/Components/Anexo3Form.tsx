// MiMutual.WebApp/src/components/Anexo3Form.tsx

import React from 'react';
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

  const handleInputChange = (
    apartado: 'ApartadoAInputs' | 'ApartadoBInputs' | 'ApartadoCInputs' | 'ApartadoDInputs',
    field: string,
    value: number
  ) => {
    setData(prev => updateAnexo3Input(prev, apartado, field, value));
  };

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
            <tr className="level-1">
              <td colSpan={2}>APARTADO A: FONDO DE GARANTÍA (Artículo 9º)</td>
            </tr>
            <tr><td colSpan={2}></td></tr>
            <tr className="level-2"><td colSpan={2}>1. PARTIDAS SUJETAS</td></tr>
            <DisplayRow
              label="1.1 SALDO PROMEDIO TOTAL CUENTAS AHORRO MUTUAL (Importe renglón 3 Apartado A Columna b Anexo II )"
              value={data.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual}
              level={3}
            />
            <InputFieldAnexo3
              label="1.2 PORCENTAJE s/art. 9º Inc. b)"
              value={data.ApartadoAInputs.PorcentajeArt9IncB}
              onChange={v => handleInputChange('ApartadoAInputs', 'PorcentajeArt9IncB', v)}
              isPercentage={true}
              level={3}
            />
            <DisplayRow
              label="1.3 TOTAL (renglón 1.1 x renglón 1.2)"
              value={data.ApartadoA_Total_1_3}
              level={3}
            />
            <tr><td colSpan={2}></td></tr>
            <tr className="level-2"><td colSpan={2}>2. INTEGRACIÓN</td></tr>
            <DisplayRow
              label="2.1 SALDO PROMEDIO DE DISPONIBILIDADES E INVERSIONES (Importe renglón 3 Anexo I )"
              value={data.ApartadoA_SaldoPromedioDisponibilidadesInversiones}
              level={3}
            />
            <tr><td colSpan={2}></td></tr>
            <DisplayRow
              label="3. MARGEN (+) O DEFICIENCIA (-) DEL PERIODO (Resultado: renglón 2.1 menos renglón 1.3)"
              value={data.ApartadoA_MargenDeficienciaPeriodo}
              level={1}
            />

            {/* APARTADO B */}
            <tr className="level-1" style={{ marginTop: '20px' }}>
              <td colSpan={2}>APARTADO B: LIMITE MAXIMO CAPTACION AHORRO (Artículo 10º)</td>
            </tr>
            <DisplayRow
              label="1. CAPITAL LIQUIDO (Patrimonio Neto) - (Sumatoria renglones 1.2 a 1.5)"
              value={data.ApartadoB_CapitalLiquido}
              level={1}
            />
            <InputFieldAnexo3
              label="1.1 Patrimonio Neto"
              value={data.ApartadoBInputs.PatrimonioNeto}
              onChange={v => handleInputChange('ApartadoBInputs', 'PatrimonioNeto', v)}
              level={3}
            />
            <tr className="level-2"><td colSpan={2} style={{ paddingLeft: '30px' }}>MENOS:</td></tr>
            <InputFieldAnexo3
              label="1.2 Inversiones en inmuebles"
              value={data.ApartadoBInputs.InversionesInmuebles}
              onChange={v => handleInputChange('ApartadoBInputs', 'InversionesInmuebles', v)}
              level={3}
            />
            <InputFieldAnexo3
              label="1.3 Otros Activos Fijos"
              value={data.ApartadoBInputs.OtrosActivosFijos}
              onChange={v => handleInputChange('ApartadoBInputs', 'OtrosActivosFijos', v)}
              level={3}
            />
            <InputFieldAnexo3
              label="1.4 Cargos Diferidos"
              value={data.ApartadoBInputs.CargosDiferidos}
              onChange={v => handleInputChange('ApartadoBInputs', 'CargosDiferidos', v)}
              level={3}
            />
            <InputFieldAnexo3
              label="1.5 Activos No Corrientes (No vinculados al Servicio) - Pasivos No Corrientes asociados a los mismos"
              value={data.ApartadoBInputs.ActivosNoCorrientesNeto}
              onChange={v => handleInputChange('ApartadoBInputs', 'ActivosNoCorrientesNeto', v)}
              level={3}
            />
            <tr><td colSpan={2}></td></tr>
            <tr className="level-2"><td colSpan={2}>2. MAXIMO DE CAPTACIÓN</td></tr>
            <DisplayRow
              label="2.1 CAPITAL LIQUIDO (Renglón 1 Apartado B del Anexo III ) x 25 veces"
              value={data.ApartadoB_MaximoCaptacionCapitalLiquido}
              level={3}
            />
            <DisplayRow
              label="2.2 PATRIMONIO NETO (Renglón 1.1) x 15 veces"
              value={data.ApartadoB_MaximoCaptacionPatrimonioNeto}
              level={3}
            />
            <tr><td colSpan={2}></td></tr>
            <DisplayRow
              label="3. CAPTACIÓN DE AHORRO (Renglón 3 Apartado A Columna b - Anexo II)"
              value={data.ApartadoB_CaptacionAhorroReferencia}
              level={3}
            />
            <tr><td colSpan={2}></td></tr>
            <tr className="level-2"><td colSpan={2}>4. MARGEN (+) O DEFICIENCIA (-) DEL LIMITE</td></tr>
            <DisplayRow
              label="Resultado: renglón 2.1 menos renglón 3"
              value={data.ApartadoB_MargenDeficienciaCapitalLiquido}
              level={3}
            />
            <DisplayRow
              label="Resultado : renglón 2.2 menos renglón 3"
              value={data.ApartadoB_MargenDeficienciaPatrimonioNeto}
              level={3}
            />
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
            <tr className="level-1">
              <td colSpan={2}>APARTADO C: MONTO MAXIMO POR ASOCIADO POR AYUDA Y AHORRO</td>
            </tr>
            <tr><td colSpan={2}></td></tr>

            <DisplayRow
              label="1. CAPITAL LIQUIDO (Apartado B Punto 1.)"
              value={data.ApartadoC_CapitalLiquido}
              level={3}
            />
            <InputFieldAnexo3
              label="1.1 Porcentaje límite"
              value={data.ApartadoCInputs.PorcentajeLimite}
              onChange={v => handleInputChange('ApartadoCInputs', 'PorcentajeLimite', v)}
              isPercentage={true}
              level={3}
            />
            <DisplayRow
              label="1.2 Monto Máximo (13 % del Capital Líquido)"
              value={data.ApartadoC_Maximo}
              level={3}
            />

            <DisplayRow
              label="2. CAPACIDAD PRESTABLE (Suma del 2.1 menos  2.2  más 2.3)"
              value={data.ApartadoC_CapacidadPrestable}
              level={3}
            />
            <DisplayRow
              label="2.1 Ahorros de los Asociados (Apartado A -punto 1.1)"
              value={data.ApartadoC_AhorrosAsociados}
              level={3}
            />
            <DisplayRow
              label="Menos"
              value={data.ApartadoC_Menos}
              level={3}
            />
            <DisplayRow
              label="2.2 Fondo de Garantía Exigible (Apartado A -punto 1.3)"
              value={data.ApartadoC_FondoGarantia}
              level={3}
            />
            <DisplayRow
              label="Más"
              value={data.ApartadoC_Mas}
              level={3}
            />
            <DisplayRow
              label="2.3 Capital Líquido (Apartado B -punto 1.)"
              value={data.ApartadoC_CapitalLiquido2}
              level={3}
            />
            <DisplayRow
              label="2.4 Porcentaje Límite para Ayuda (8% de la Capacidad Prestable)"
              value={data.ApartadoC_PorcentajeAyuda}
              level={3}
              isPercentage={true}
            />
            <DisplayRow
              label="2.5 Porcentaje Límite para Ahorro (5% de la Capacidad Prestable o 10 % del Capital Liquido)"
              value={data.ApartadoC_PorcentajeAhorro}
              level={3}
              isPercentage={true}
            />

            <DisplayRow
              label="3. MAXIMO DE AYUDA Y AHORRO POR ASOCIADO"
              value={data.ApartadoC_MaximoAyudaAhorro}
              level={3}
            />
            <DisplayRow
              label="3.1 Ayudas Económicas que superan el Limite Maximo (Importe Mayor Entre 2.4 y 1.2)"
              value={data.ApartadoC_AyudasSuperanLimite}
              level={3}
            />
            <DisplayRow
              label="3.1.1 Ayudas Económicas - Cantidad de Socios que superan el Límite Máximo"
              value={data.ApartadoC_CantSociosAyuda}
              level={3}
            />
            <DisplayRow
              label="3.2 Ahorros que superan el Límite Mäximo (importe igual a 2.5)"
              value={data.ApartadoC_AhorrosSuperanLimite}
              level={3}
            />
            <DisplayRow
              label="3.2.1 Ahorro - Cantidad de Socios que superan el Límite Máximo"
              value={data.ApartadoC_CantSociosAhorro}
              level={3}
            />

            {/* APARTADO D */}
            <tr className="level-1" style={{ marginTop: '20px' }}>
              <td colSpan={2}>APARTADO D: PROMEDIO DE AYUDAS ECONÓMICAS P/ASOC.</td>
            </tr>
            <tr><td colSpan={2}></td></tr>

            <DisplayRow
              label="2.1 PROMEDIO TOTAL DE AYUDA ECONOMICA (Imp. Renglón 3 Apartado B Columna b Anexo II)"
              value={data.ApartadoD_PromedioAyudaTotal}
              level={3}
            />
            <DisplayRow
              label="2.2 CANTIDAD DE CUENTAS DE ASOCIADOS VIGENTES (Imp. Reng. 3 Apart. B Col. c Anexo II)"
              value={data.ApartadoD_CantidadCuentas}
              level={3}
            />
            <DisplayRow
              label="2.3 PROMEDIO MAXIMO DE AYUDA POR ASOCIADO (Imp. Reng. 2.1/2.2 Apart. D Anexo III)"
              value={data.ApartadoD_PromedioMaximo}
              level={3}
            />
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onSave} className="save-button">
          Guardar Anexo III
        </button>
        <button onClick={onDelete} className="delete-button">
          Borrar Datos
        </button>
      </div>

    </div>



  );

}
