// MiMutual.WebApp/src/App.tsx

import { useState, useEffect } from 'react';
import type {
  Anexo1Data, Anexo1GetResponse,
  Anexo2Data, Anexo2GetResponse,
  Anexo3Data, Anexo3GetResponse,
  Anexo4Data, Anexo4GetResponse,
  Anexo5Data, Anexo5GetResponse,
  Anexo7Data, Anexo7GetResponse
} from './types';
import { Anexo1Form } from './Components/Anexo1Form';
import Anexo2Form from './Components/Anexo2Form';
import { Anexo3Form } from './Components/Anexo3Form';
import { Header } from './Components/Header';
import { Nav } from './Components/Nav';
import { Breadcrumb } from './Components/Breadcrumb';
import { Modal } from './Components/Modal';
import './App.css';
import Anexo4Form from './Components/Anexo4Form';
import Anexo5Form from './Components/Anexo5Form';
import Anexo7Form from './Components/Anexo7Form';

// 1. Declaramos el tipo UNA SOLA VEZ
type ActiveView = 'anexo1' | 'anexo2' | 'anexo3' | 'anexo4' | 'anexo5' | 'anexo7';

// Estado inicial para el Anexo I
const initialAnexo1Data: Anexo1Data = {
  disponibilidades: {
    enPesos: { caja: { saldoPeriodo: 0, promedioPeriodo: 0 }, cuentaCorriente: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } },
    enMonedaExtranjera: { caja: { saldoPeriodo: 0, promedioPeriodo: 0 }, cuentaCorriente: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } }
  },
  inversiones: {
    enPesos: { cajaDeAhorro: { saldoPeriodo: 0, promedioPeriodo: 0 }, plazoFijo: { saldoPeriodo: 0, promedioPeriodo: 0 }, titulosPublicos: { saldoPeriodo: 0, promedioPeriodo: 0 }, tiCoCa: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } },
    enMonedaExtranjera: { cajaDeAhorro: { saldoPeriodo: 0, promedioPeriodo: 0 }, plazoFijo: { saldoPeriodo: 0, promedioPeriodo: 0 }, titulosPublicos: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } }
  }
};

// Estado inicial para el Anexo II
const initialAnexo2Data: Anexo2Data = {
  apartadoA: {
    recursosEnPesos: { ahorroATermino: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, ahorroVariableComun: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, ahorroVariableEspecial: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, otros: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 } },
    recursosEnMonedaExtranjera: { ahorroATermino: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, ahorroVariableComun: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, ahorroVariableEspecial: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, otros: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 } }
  },
  apartadoB: {
    ayudaEnPesos: { pagoIntegro: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, amortizable: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, otros: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 } },
    ayudaEnMonedaExtranjera: { pagoIntegro: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, amortizable: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 }, otros: { movimientos: { debe: 0, haber: 0 }, finPeriodo: 0, promedioPeriodo: 0, cuentasAsociadosVigentes: 0, tasaEstimuloEfectivaMensual: 0 } }
  }
};

// Estado inicial para el Anexo IV (estructura mínima de momento)
const initialAnexo4Data: Anexo4Data = {} as Anexo4Data;

// Estado inicial Anexo V
const initialAnexo5Data: Anexo5Data = {
  tablaPesos: {
    normal_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 } },
    normal_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 } },
    normal_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 } },
    riesgoBajo_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.03, montoAPrevisionar: 0 } },
    riesgoBajo_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.03, montoAPrevisionar: 0 } },
    riesgoBajo_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.03, montoAPrevisionar: 0 } },
    riesgoMedio_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.10, montoAPrevisionar: 0 } },
    riesgoMedio_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.10, montoAPrevisionar: 0 } },
    riesgoMedio_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.10, montoAPrevisionar: 0 } },
    riesgoAlto_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.15, montoAPrevisionar: 0 } },
    riesgoAlto_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.15, montoAPrevisionar: 0 } },
    riesgoAlto_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.15, montoAPrevisionar: 0 } },
    irrecuperable_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 1.00, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 } },
    irrecuperable_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 1.00, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 } },
    irrecuperable_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 1.00, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 } },
    total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0, montoAPrevisionar: 0 } },
  },
  tablaMonedaExtranjeraEnPesos: {
    normal_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 } },
    normal_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 } },
    normal_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.01, montoAPrevisionar: 0 } },
    riesgoBajo_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.03, montoAPrevisionar: 0 } },
    riesgoBajo_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.03, montoAPrevisionar: 0 } },
    riesgoBajo_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.05, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.03, montoAPrevisionar: 0 } },
    riesgoMedio_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.10, montoAPrevisionar: 0 } },
    riesgoMedio_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.10, montoAPrevisionar: 0 } },
    riesgoMedio_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.20, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.10, montoAPrevisionar: 0 } },
    riesgoAlto_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.15, montoAPrevisionar: 0 } },
    riesgoAlto_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.15, montoAPrevisionar: 0 } },
    riesgoAlto_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.15, montoAPrevisionar: 0 } },
    irrecuperable_pagoIntegro: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 1.00, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 } },
    irrecuperable_amortizable: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 1.00, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 } },
    irrecuperable_total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 1.00, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0.50, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0.25, montoAPrevisionar: 0 } },
    total: { sinGarantia: { ayudasEconomicas: 0, porcentaje: 0, montoAPrevisionar: 0 }, conGarantiaPersonal: { ayudasEconomicas: 0, porcentaje: 0, montoAPrevisionar: 0 }, conGarantiaReal: { ayudasEconomicas: 0, porcentaje: 0, montoAPrevisionar: 0 } },
  },
};

//Estado inicial para el Anexo III
const initialAnexo3Data: Anexo3Data = {
  ApartadoAInputs: {
    PorcentajeArt9IncB: 0.10,
  },
  ApartadoBInputs: {
    PatrimonioNeto: 0,
    InversionesInmuebles: 0,
    OtrosActivosFijos: 0,
    CargosDiferidos: 0,
    ActivosNoCorrientesNeto: 0,
  },
  ApartadoCInputs: {
    PorcentajeLimite: 0,
    MontoMaximo: 0,
    AhorrosQueSuperanLimite: 0,
    CantidadSociosAyuda: 0,
    CantidadSociosAhorro: 0,
    PorcentajeLimiteAyuda: 0,
    PorcentajeLimiteAhorro: 0,
  },
  ApartadoDInputs: {
    PromedioAyuda: 0,
    CantidadCuentas: 0,
    PromedioMaximoAyuda: 0,
  },
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
  ApartadoC_AhorrosSuperanLimite: 0,
  ApartadoC_CantSociosAhorro: 0,
  ApartadoD_PromedioAyudaTotal: 0,
  ApartadoD_CantidadCuentas: 0,
  ApartadoD_PromedioMaximo: 0,
};


type ModalState = {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  errorList?: string[];
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('anexo1');

  const [anexo1Data, setAnexo1Data] = useState<Anexo1Data>(initialAnexo1Data);
  const [anexo2Data, setAnexo2Data] = useState<Anexo2Data>(initialAnexo2Data);
  const [anexo3Data, setAnexo3Data] = useState<Anexo3Data>(initialAnexo3Data);
  const [anexo4Data, setAnexo4Data] = useState<Anexo4Data>(initialAnexo4Data);
  const [anexo5Data, setAnexo5Data] = useState<Anexo5Data>(initialAnexo5Data);
  const [anexo7Data, setAnexo7Data] = useState<Anexo7Data>({
    header: { asociacionMutual: '', domicilio: '', localidad: '', telefono: '', matricula: '', fechaArqueo: '', periodoMensual: '', mail: '', actaNumero: '' },
    rows: Array.from({ length: 20 }, (_, i) => ({ orden: i + 1, nombreORazonSocial: '', cuitCuilCdi: '', numeroAsociado: '', mayoresSaldosAhorro: 0 })),
    totalMayoresSaldos: 0,
  });

  const [savedStatus, setSavedStatus] = useState({ anexo1: false, anexo2: false, anexo3: false, anexo4: false, anexo5: false, anexo7: false });

  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false, type: 'success', title: '', message: '', errorList: []

  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [responseAnexo1, responseAnexo2, responseAnexo3, responseAnexo4, responseAnexo5, responseAnexo7] = await Promise.all([
          fetch('http://localhost:5236/api/anexo1'),
          fetch('http://localhost:5236/api/anexo2'),
          fetch('http://localhost:5236/api/anexo3'),
          fetch('http://localhost:5236/api/anexo4'),
          fetch('http://localhost:5236/api/anexo5'),
          fetch('http://localhost:5236/api/anexo7'),
        ]);

        if (!responseAnexo1.ok) throw new Error('Error al cargar datos del Anexo I');
        if (!responseAnexo2.ok) throw new Error('Error al cargar datos del Anexo II');
        if (!responseAnexo3.ok) throw new Error('Error al cargar datos del Anexo III');
        if (!responseAnexo4.ok) throw new Error('Error al cargar datos del Anexo IV');
        if (!responseAnexo5.ok) throw new Error('Error al cargar datos del Anexo V');
        if (!responseAnexo7.ok) throw new Error('Error al cargar datos del Anexo VII');

        const apiResponse1: Anexo1GetResponse = await responseAnexo1.json();
        const apiResponse2: Anexo2GetResponse = await responseAnexo2.json();
        const apiResponse3: Anexo3GetResponse = await responseAnexo3.json();
        const apiResponse4: Anexo4GetResponse = await responseAnexo4.json();
        const apiResponse5: Anexo5GetResponse = await responseAnexo5.json();
        const apiResponse7: Anexo7GetResponse = await responseAnexo7.json();

        if (apiResponse1.data) setAnexo1Data(apiResponse1.data);
        if (apiResponse2.data) setAnexo2Data(apiResponse2.data);
        if (apiResponse3.data) setAnexo3Data(apiResponse3.data);
        if (apiResponse4.data) setAnexo4Data(apiResponse4.data);
        if (apiResponse5.data) setAnexo5Data(apiResponse5.data);
        if (apiResponse7.data) setAnexo7Data(apiResponse7.data);

        setSavedStatus({
          anexo1: apiResponse1.isSaved,
          anexo2: apiResponse2.isSaved,
          anexo3: apiResponse3.isSaved,
          anexo4: apiResponse4.isSaved,
          anexo5: apiResponse5.isSaved,
          anexo7: apiResponse7.isSaved,
        });

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- LÓGICA PARA ANEXO I ---
  const handleSaveAnexo1 = async () => {
    try {
      const response = await fetch('http://localhost:5236/api/anexo1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anexo1Data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      setSavedStatus(prev => ({ ...prev, anexo1: true }));
      setModalState({ isOpen: true, type: 'success', title: '¡Éxito!', message: 'El Anexo I ha sido guardado.' });
    } catch (error: any) {
      console.error("Error al guardar Anexo I:", error);
      if (error && error.errors && Array.isArray(error.errors)) {
        setModalState({ isOpen: true, type: 'error', title: 'Corrija los errores:', message: 'Se encontraron problemas.', errorList: error.errors });
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudo guardar el Anexo I.' });
      }
    }
  };

  const handleDeleteAnexo1 = async () => {
    if (!window.confirm("¿Seguro que quieres borrar los datos del Anexo I?")) return;
    try {
      const response = await fetch('http://localhost:5236/api/anexo1', { method: 'DELETE' });
      if (!response.ok) throw new Error('Error del servidor al borrar');
      setAnexo1Data(initialAnexo1Data);
      setSavedStatus(prev => ({ ...prev, anexo1: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo I han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo I:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo I.' });
    }
  };

  // --- LÓGICA PARA ANEXO II (DEFINIDA UNA SOLA VEZ) ---
  const handleSaveAnexo2 = async () => {
    try {
      const response = await fetch('http://localhost:5236/api/anexo2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anexo2Data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      setSavedStatus(prev => ({ ...prev, anexo2: true }));
      setModalState({ isOpen: true, type: 'success', title: '¡Éxito!', message: 'El Anexo II ha sido guardado.' });
    } catch (error: any) {
      console.error("Error al guardar Anexo II:", error);
      if (error && error.errors && Array.isArray(error.errors)) {
        setModalState({ isOpen: true, type: 'error', title: 'Corrija los errores:', message: 'Se encontraron problemas.', errorList: error.errors });
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudo guardar el Anexo II.' });
      }
    }
  };

  const handleDeleteAnexo2 = async () => {
    if (!window.confirm("¿Seguro que quieres borrar los datos del Anexo II?")) return;
    try {
      const response = await fetch('http://localhost:5236/api/anexo2', { method: 'DELETE' });
      if (!response.ok) throw new Error('Error del servidor al borrar');
      setAnexo2Data(initialAnexo2Data);
      setSavedStatus(prev => ({ ...prev, anexo2: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo II han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo II:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo II.' });
    }
  };

  // --- LÓGICA PARA ANEXO III (DEFINIDA UNA SOLA VEZ) ---
  const handleSaveAnexo3 = async () => {
    await fetch('/api/Anexo3/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anexo3Data),
    });
    alert('Anexo III guardado');
  };

  const handleDeleteAnexo3 = async () => {
    await fetch('/api/Anexo3/delete', { method: 'POST' });
    setAnexo3Data({
      ApartadoAInputs: { PorcentajeArt9IncB: 0 },
      ApartadoBInputs: {
        PatrimonioNeto: 0,
        InversionesInmuebles: 0,
        OtrosActivosFijos: 0,
        CargosDiferidos: 0,
        ActivosNoCorrientesNeto: 0,
      },
      ApartadoCInputs: {
        PorcentajeLimite: 0,
        MontoMaximo: 0,
        AhorrosQueSuperanLimite: 0,
        CantidadSociosAyuda: 0,
        CantidadSociosAhorro: 0,
        PorcentajeLimiteAyuda: 0,
        PorcentajeLimiteAhorro: 0,
      },
      ApartadoDInputs: {
        PromedioAyuda: 0,
        CantidadCuentas: 0,
        PromedioMaximoAyuda: 0,
      },
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
      ApartadoC_AhorrosSuperanLimite: 0,
      ApartadoC_CantSociosAhorro: 0,
      ApartadoD_PromedioAyudaTotal: 0,
      ApartadoD_CantidadCuentas: 0,
      ApartadoD_PromedioMaximo: 0,
    });
    alert('Anexo III borrado');
  };

  // --- LÓGICA PARA ANEXO IV (placeholder) ---
  const handleSaveAnexo4 = async () => {
    try {
      const response = await fetch('http://localhost:5236/api/anexo4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anexo4Data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      setSavedStatus(prev => ({ ...prev, anexo4: true }));
      setModalState({ isOpen: true, type: 'success', title: '¡Éxito!', message: 'El Anexo IV ha sido guardado.' });
    } catch (error: any) {
      console.error("Error al guardar Anexo IV:", error);
      if (error && error.errors && Array.isArray(error.errors)) {
        setModalState({ isOpen: true, type: 'error', title: 'Corrija los errores:', message: 'Se encontraron problemas.', errorList: error.errors });
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudo guardar el Anexo IV.' });
      }
    }
  };

  const handleDeleteAnexo4 = async () => {
    if (!window.confirm("¿Seguro que quieres borrar los datos del Anexo IV?")) return;
    try {
      const response = await fetch('http://localhost:5236/api/anexo4', { method: 'DELETE' });
      if (!response.ok) throw new Error('Error del servidor al borrar');
      setAnexo4Data(initialAnexo4Data);
      setSavedStatus(prev => ({ ...prev, anexo4: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo IV han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo IV:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo IV.' });
    }
  };

  // --- LÓGICA PARA ANEXO V ---
  const handleSaveAnexo5 = async () => {
    try {
      const response = await fetch('http://localhost:5236/api/anexo5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anexo5Data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      setSavedStatus(prev => ({ ...prev, anexo5: true }));
      setModalState({ isOpen: true, type: 'success', title: '¡Éxito!', message: 'El Anexo V ha sido guardado.' });
    } catch (error: any) {
      console.error("Error al guardar Anexo V:", error);
      if (error && error.errors && Array.isArray(error.errors)) {
        setModalState({ isOpen: true, type: 'error', title: 'Corrija los errores:', message: 'Se encontraron problemas.', errorList: error.errors });
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudo guardar el Anexo V.' });
      }
    }
  };

  const handleDeleteAnexo5 = async () => {
    if (!window.confirm("¿Seguro que quieres borrar los datos del Anexo V?")) return;
    try {
      const response = await fetch('http://localhost:5236/api/anexo5', { method: 'DELETE' });
      if (!response.ok) throw new Error('Error del servidor al borrar');
      setAnexo5Data(initialAnexo5Data);
      setSavedStatus(prev => ({ ...prev, anexo5: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo V han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo V:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo V.' });
    }
  };

  // --- LÓGICA PARA ANEXO VII ---
  const handleSaveAnexo7 = async () => {
    try {
      const response = await fetch('http://localhost:5236/api/anexo7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anexo7Data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      setSavedStatus(prev => ({ ...prev, anexo7: true }));
      setModalState({ isOpen: true, type: 'success', title: '¡Éxito!', message: 'El Anexo VII ha sido guardado.' });
    } catch (error: any) {
      console.error("Error al guardar Anexo VII:", error);
      if (error && error.errors && Array.isArray(error.errors)) {
        setModalState({ isOpen: true, type: 'error', title: 'Corrija los errores:', message: 'Se encontraron problemas.', errorList: error.errors });
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudo guardar el Anexo VII.' });
      }
    }
  };

  const handleDeleteAnexo7 = async () => {
    if (!window.confirm("¿Seguro que quieres borrar los datos del Anexo VII?")) return;
    try {
      const response = await fetch('http://localhost:5236/api/anexo7', { method: 'DELETE' });
      if (!response.ok) throw new Error('Error del servidor al borrar');
      setAnexo7Data({
        header: { asociacionMutual: '', domicilio: '', localidad: '', telefono: '', matricula: '', fechaArqueo: '', periodoMensual: '', mail: '', actaNumero: '' },
        rows: Array.from({ length: 20 }, (_, i) => ({ orden: i + 1, nombreORazonSocial: '', cuitCuilCdi: '', numeroAsociado: '', mayoresSaldosAhorro: 0 })),
        totalMayoresSaldos: 0,
      });
      setSavedStatus(prev => ({ ...prev, anexo7: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo VII han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo VII:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo VII.' });
    }
  };

  // --- RENDERIZADO ---
  const renderActiveView = () => {
    switch (activeView) {
      case 'anexo1':
        // CORRECCIÓN: Nos aseguramos de pasar la función con el nombre correcto
        return <Anexo1Form data={anexo1Data} setData={setAnexo1Data} onSave={handleSaveAnexo1} onDelete={handleDeleteAnexo1} />;
      case 'anexo2':
        return <Anexo2Form data={anexo2Data} setData={setAnexo2Data} onSave={handleSaveAnexo2} onDelete={handleDeleteAnexo2} />;
      case 'anexo3':
        return <Anexo3Form data={anexo3Data} setData={setAnexo3Data} onSave={handleSaveAnexo3} onDelete={handleDeleteAnexo3} />;
      case 'anexo4':
        return <Anexo4Form onSave={handleSaveAnexo4} onDelete={handleDeleteAnexo4} />;
      case 'anexo5':
        return <Anexo5Form onSave={handleSaveAnexo5} onDelete={handleDeleteAnexo5} />;
      case 'anexo7':
        return <Anexo7Form onSave={handleSaveAnexo7} onDelete={handleDeleteAnexo7} />;
      default:
        return <p>Seleccione un anexo para comenzar.</p>;
    }
  };

  return (
    <div className="container">
      <Header />
      <Nav activeView={activeView} setActiveView={setActiveView} />
      <Breadcrumb status={savedStatus} />
      <main>{isLoading ? <p>Cargando aplicación...</p> : renderActiveView()}</main>
      <Modal
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        {...modalState}
      />
    </div>
  );
}

export default App;