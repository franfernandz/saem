// MiMutual.WebApp/src/App.tsx

import { useState, useEffect } from 'react';
import JSZip from 'jszip';
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
  type: 'success' | 'error' | 'confirm' | 'loading' | 'download';
  title: string;
  message: string;
  errorList?: string[];
};


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

  // Leer savedStatus de localStorage si existe
  const getInitialSavedStatus = () => {
    try {
      const stored = localStorage.getItem('saem_saved_status');
      if (stored) return JSON.parse(stored);
    } catch {}
    return { anexo1: false, anexo2: false, anexo3: false, anexo4: false, anexo5: false, anexo7: false };
  };
  type SavedStatus = { anexo1: boolean; anexo2: boolean; anexo3: boolean; anexo4: boolean; anexo5: boolean; anexo7: boolean };
  const [savedStatus, setSavedStatus] = useState<SavedStatus>(getInitialSavedStatus);
  // Guardar savedStatus en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('saem_saved_status', JSON.stringify(savedStatus));
  }, [savedStatus]);


  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false, type: 'success', title: '', message: '', errorList: []
  });

  // --- Estado y helpers para exportar Excel de todos los anexos ---
  const [isExporting, setIsExporting] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [excelUrl, setExcelUrl] = useState<string | null>(null);

  // Helper para saber si todos los anexos están guardados
  const allSaved = Object.values(savedStatus).every(Boolean);

  // Helper para obtener nombre de archivo Excel
  function getExcelFileName() {
    const entidad = anexo7Data.header?.asociacionMutual || 'Entidad';
    const fecha = anexo7Data.header?.fechaArqueo || new Date().toISOString().slice(0, 10);
    return `SAEM_${entidad.replace(/\s+/g, '_')}_${fecha.replace(/\//g, '-')}.zip`;
  }

  // Handler para el botón "Grabar formulario"
  const handleGrabarFormulario = () => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar grabación',
      message: '¿Desea grabar el formulario y descargar el Excel con todos los Anexos?'
    });
  };

  // Handler para confirmar en el modal
  const handleConfirmGrabar = async () => {
    // Guardar todos los anexos en LocalStorage como JSON
    const allData = {
      anexo1: anexo1Data,
      anexo2: anexo2Data,
      anexo3: anexo3Data,
      anexo4: anexo4Data,
      anexo5: anexo5Data,
      anexo7: anexo7Data,
      fecha: new Date().toISOString()
    };
    try {
      localStorage.setItem('saem_formulario', JSON.stringify(allData));
    } catch (e) {
      // Si falla, mostrar un error pero continuar con el Excel
      console.error('No se pudo guardar en LocalStorage', e);
    }
    setModalState({
      isOpen: true,
      type: 'loading',
      title: 'Generando Excel...',
      message: 'Por favor espere mientras se genera el archivo.'
    });
    setIsExporting(true);
    setShowDownload(false);
    setExcelUrl(null);
    setTimeout(() => {
      exportToCSVZip();
    }, 800);
  };

  // Exportar todos los anexos a Excel
  // Helper para convertir un objeto anidado a array de { Campo, Valor }

  // Generic object flattener with label mapping
  type Row = { Campo: string; Valor: any };
  // Map internal keys to user-friendly labels (add more as needed)
  const fieldLabels: Record<string, string> = {
    // Anexo I
    'disponibilidades.enPesos.caja.saldoPeriodo': 'Caja en Pesos - Saldo Periodo',
    'disponibilidades.enPesos.caja.promedioPeriodo': 'Caja en Pesos - Promedio Periodo',
    'disponibilidades.enPesos.cuentaCorriente.saldoPeriodo': 'Cuenta Corriente en Pesos - Saldo Periodo',
    'disponibilidades.enPesos.cuentaCorriente.promedioPeriodo': 'Cuenta Corriente en Pesos - Promedio Periodo',
    'disponibilidades.enPesos.otros.saldoPeriodo': 'Otros en Pesos - Saldo Periodo',
    'disponibilidades.enPesos.otros.promedioPeriodo': 'Otros en Pesos - Promedio Periodo',
    'disponibilidades.enMonedaExtranjera.caja.saldoPeriodo': 'Caja en Moneda Extranjera - Saldo Periodo',
    'disponibilidades.enMonedaExtranjera.caja.promedioPeriodo': 'Caja en Moneda Extranjera - Promedio Periodo',
    'disponibilidades.enMonedaExtranjera.cuentaCorriente.saldoPeriodo': 'Cuenta Corriente en Moneda Extranjera - Saldo Periodo',
    'disponibilidades.enMonedaExtranjera.cuentaCorriente.promedioPeriodo': 'Cuenta Corriente en Moneda Extranjera - Promedio Periodo',
    'disponibilidades.enMonedaExtranjera.otros.saldoPeriodo': 'Otros en Moneda Extranjera - Saldo Periodo',
    'disponibilidades.enMonedaExtranjera.otros.promedioPeriodo': 'Otros en Moneda Extranjera - Promedio Periodo',
    // Anexo III (labels from form)
    'ApartadoA_SaldoPromedioTotalCuentasAhorroMutual': '1.1 SALDO PROMEDIO TOTAL CUENTAS AHORRO MUTUAL (Importe renglón 3 Apartado A Columna b Anexo II )',
    'ApartadoAInputs.PorcentajeArt9IncB': '1.2 PORCENTAJE s/art. 9º Inc. b)',
    'ApartadoA_Total_1_3': '1.3 TOTAL (renglón 1.1 x renglón 1.2)',
    'ApartadoA_SaldoPromedioDisponibilidadesInversiones': '2.1 SALDO PROMEDIO DE DISPONIBILIDADES E INVERSIONES (Importe renglón 3 Anexo I )',
    'ApartadoA_MargenDeficienciaPeriodo': '3. MARGEN (+) O DEFICIENCIA (-) DEL PERIODO (Resultado: renglón 2.1 menos renglón 1.3)',
    'ApartadoB_CapitalLiquido': '1. CAPITAL LIQUIDO (Patrimonio Neto) - (Sumatoria renglones 1.2 a 1.5)',
    'ApartadoBInputs.PatrimonioNeto': '1.1 Patrimonio Neto',
    'ApartadoBInputs.InversionesInmuebles': '1.2 Inversiones en inmuebles',
    'ApartadoBInputs.OtrosActivosFijos': '1.3 Otros Activos Fijos',
    'ApartadoBInputs.CargosDiferidos': '1.4 Cargos Diferidos',
    'ApartadoBInputs.ActivosNoCorrientesNeto': '1.5 Activos No Corrientes (No vinculados al Servicio) - Pasivos No Corrientes asociados a los mismos',
    'ApartadoB_MaximoCaptacionCapitalLiquido': '2.1 CAPITAL LIQUIDO (Renglón 1 Apartado B del Anexo III ) x 25 veces',
    'ApartadoB_MaximoCaptacionPatrimonioNeto': '2.2 PATRIMONIO NETO (Renglón 1.1) x 15 veces',
    'ApartadoB_CaptacionAhorroReferencia': '3. CAPTACIÓN DE AHORRO (Renglón 3 Apartado A Columna b - Anexo II)',
    'ApartadoB_MargenDeficienciaCapitalLiquido': '4.1 MARGEN (+) O DEFICIENCIA (-) DEL LIMITE (Resultado: renglón 2.1 menos renglón 3)',
    'ApartadoB_MargenDeficienciaPatrimonioNeto': '4.2 MARGEN (+) O DEFICIENCIA (-) DEL LIMITE (Resultado : renglón 2.2 menos renglón 3)',
    'ApartadoC_CapitalLiquido': '1. CAPITAL LIQUIDO (Apartado B Punto 1.)',
    'ApartadoCInputs.PorcentajeLimite': '1.1 Porcentaje límite',
    'ApartadoC_Maximo': '1.2 Monto Máximo (13 % del Capital Líquido)',
    'ApartadoC_CapacidadPrestable': '2. CAPACIDAD PRESTABLE (Suma del 2.1 menos  2.2  más 2.3)',
    'ApartadoC_AhorrosAsociados': '2.1 Ahorros de los Asociados (Apartado A -punto 1.1)',
    'ApartadoC_Menos': 'Menos',
    'ApartadoC_FondoGarantia': '2.2 Fondo de Garantía Exigible (Apartado A -punto 1.3)',
    'ApartadoC_Mas': 'Más',
    'ApartadoC_CapitalLiquido2': '2.3 Capital Líquido (Apartado B -punto 1.)',
    'ApartadoC_PorcentajeAyuda': '2.4 Porcentaje Límite para Ayuda (8% de la Capacidad Prestable)',
    'ApartadoC_PorcentajeAhorro': '2.5 Porcentaje Límite para Ahorro (5% de la Capacidad Prestable o 10 % del Capital Liquido)',
    'ApartadoC_MaximoAyudaAhorro': '3. MAXIMO DE AYUDA Y AHORRO POR ASOCIADO',
    'ApartadoC_AyudasSuperanLimite': '3.1 Ayudas Económicas que superan el Limite Maximo (Importe Mayor Entre 2.4 y 1.2)',
    'ApartadoC_CantSociosAyuda': '3.1.1 Ayudas Económicas - Cantidad de Socios que superan el Límite Máximo',
    'ApartadoC_AhorrosSuperanLimite': '3.2 Ahorros que superan el Límite Mäximo (importe igual a 2.5)',
    'ApartadoC_CantSociosAhorro': '3.2.1 Ahorro - Cantidad de Socios que superan el Límite Máximo',
    'ApartadoD_PromedioAyudaTotal': '2.1 PROMEDIO TOTAL DE AYUDA ECONOMICA (Imp. Renglón 3 Apartado B Columna b Anexo II)',
    'ApartadoD_CantidadCuentas': '2.2 CANTIDAD DE CUENTAS DE ASOCIADOS VIGENTES (Imp. Reng. 3 Apart. B Col. c Anexo II)',
    'ApartadoD_PromedioMaximo': '2.3 PROMEDIO MAXIMO DE AYUDA POR ASOCIADO (Imp. Reng. 2.1/2.2 Apart. D Anexo III)',
    // Anexo VII (header)
    'Header.asociacionMutual': 'Asociación Mutual',
    'Header.domicilio': 'Domicilio',
    'Header.localidad': 'Localidad',
    'Header.telefono': 'Teléfono',
    'Header.matricula': 'Matrícula',
    'Header.fechaArqueo': 'Fecha de Arqueo',
    'Header.periodoMensual': 'Período Mensual',
    'Header.mail': 'Mail',
    'Header.actaNumero': 'N° de Acta',
    // ...continúa para los demás campos...
  };

  function objectToRows(obj: any, prefix = ''): Row[] {
    const rows: Row[] = [];
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      const labelKey = prefix ? `${prefix}.${key}` : key;
      const label = fieldLabels[labelKey] || labelKey;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        rows.push(...objectToRows(value, labelKey));
      } else if (Array.isArray(value)) {
        rows.push({ Campo: label, Valor: JSON.stringify(value) });
      } else {
        // Format all numbers as strings to avoid scientific notation in Excel
        let formattedValue = value;
        if (typeof value === 'number' && !isNaN(value)) {
          formattedValue = value.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
        }
        rows.push({ Campo: label, Valor: formattedValue });
      }
    }
    return rows;
  }

  // Custom flattener for Anexo IV
  function anexo4ToRows(data: Anexo4Data): Row[] {
    if (!data || Object.keys(data).length === 0) return [{ Campo: 'Sin datos', Valor: '' }];
    const rows: Row[] = [];
    const filaKeys = [
      'totalGeneralAyudaEconomica', 'pagoIntegro', 'pagoIntegroVencido', 'pagoIntegroAVencer',
      'pagoIntegroAVencer_30', 'pagoIntegroAVencer_30a89', 'pagoIntegroAVencer_90mas',
      'amortizable', 'amortizableVencido', 'amortizableAVencer', 'amortizableAVencer_3m',
      'amortizableAVencer_6m', 'amortizableAVencer_12m', 'amortizableAVencer_resto',
    ];
    const situLabels = {
      situacion1: 'Situación 1',
      situacion2: 'Situación 2',
      situacion3: 'Situación 3',
      situacion4: 'Situación 4',
      situacion5: 'Situación 5',
    };
    const filaLabels = {
      totalGeneralAyudaEconomica: 'Total General Ayuda Económica',
      pagoIntegro: 'Pago Íntegro',
      pagoIntegroVencido: 'Pago Íntegro Vencido',
      pagoIntegroAVencer: 'Pago Íntegro a Vencer',
      pagoIntegroAVencer_30: 'Pago Íntegro a Vencer hasta 30 días',
      pagoIntegroAVencer_30a89: 'Pago Íntegro a Vencer 30-89 días',
      pagoIntegroAVencer_90mas: 'Pago Íntegro a Vencer 90+ días',
      amortizable: 'Amortizable',
      amortizableVencido: 'Amortizable Vencido',
      amortizableAVencer: 'Amortizable a Vencer',
      amortizableAVencer_3m: 'Amortizable a Vencer hasta 3 meses',
      amortizableAVencer_6m: 'Amortizable a Vencer hasta 6 meses',
      amortizableAVencer_12m: 'Amortizable a Vencer hasta 12 meses',
      amortizableAVencer_resto: 'Amortizable a Vencer resto',
    };
    filaKeys.forEach(fila => {
      if ((data as any)[fila] !== undefined) {
        Object.entries((data as any)[fila]).forEach(([sit, val]) => {
          rows.push({ Campo: `${(filaLabels as Record<string, string>)[fila] || fila} - ${(situLabels as Record<string, string>)[sit] || sit}`, Valor: val });
        });
      }
    });
    if ((data as any).porcentajeAyudaConGtiaReal !== undefined)
      rows.push({ Campo: 'Porcentaje Ayuda con Garantía Real', Valor: (data as any).porcentajeAyudaConGtiaReal });
    if ((data as any).porcentajeAyudaConGtiaPers !== undefined)
      rows.push({ Campo: 'Porcentaje Ayuda con Garantía Personal', Valor: (data as any).porcentajeAyudaConGtiaPers });
    if ((data as any).previsionesIncobrablesAcumuladas !== undefined)
      rows.push({ Campo: 'Previsiones Incobrables Acumuladas', Valor: (data as any).previsionesIncobrablesAcumuladas });
    if ((data as any).previsionesAConstituir !== undefined)
      rows.push({ Campo: 'Previsiones a Constituir', Valor: (data as any).previsionesAConstituir });
    return rows;
  }

  // Custom flattener for Anexo V (tables)
  function anexo5ToRows(data: Anexo5Data): Row[] {
    if (!data) return [{ Campo: 'Sin datos', Valor: '' }];
    const rows: Row[] = [];
    const tableNames = [
      { key: 'tablaPesos', label: 'Tabla en Pesos' },
      { key: 'tablaMonedaExtranjeraEnPesos', label: 'Tabla Moneda Extranjera (en Pesos)' },
    ];
    const filaLabels = {
      normal_pagoIntegro: 'Normal - Pago Íntegro',
      normal_amortizable: 'Normal - Amortizable',
      normal_total: 'Normal - Total',
      riesgoBajo_pagoIntegro: 'Riesgo Bajo - Pago Íntegro',
      riesgoBajo_amortizable: 'Riesgo Bajo - Amortizable',
      riesgoBajo_total: 'Riesgo Bajo - Total',
      riesgoMedio_pagoIntegro: 'Riesgo Medio - Pago Íntegro',
      riesgoMedio_amortizable: 'Riesgo Medio - Amortizable',
      riesgoMedio_total: 'Riesgo Medio - Total',
      riesgoAlto_pagoIntegro: 'Riesgo Alto - Pago Íntegro',
      riesgoAlto_amortizable: 'Riesgo Alto - Amortizable',
      riesgoAlto_total: 'Riesgo Alto - Total',
      irrecuperable_pagoIntegro: 'Irrecuperable - Pago Íntegro',
      irrecuperable_amortizable: 'Irrecuperable - Amortizable',
      irrecuperable_total: 'Irrecuperable - Total',
      total: 'Total General',
    };
    const colKeys = [
      { key: 'sinGarantia', label: 'Sin Garantía' },
      { key: 'conGarantiaPersonal', label: 'Con Garantía Personal' },
      { key: 'conGarantiaReal', label: 'Con Garantía Real' },
    ];
    tableNames.forEach(table => {
      rows.push({ Campo: `--- ${table.label} ---`, Valor: '' });
      Object.keys(filaLabels).forEach(fila => {
        colKeys.forEach(col => {
          const celda = (data as any)[table.key]?.[fila]?.[col.key];
          if (celda !== undefined) {
            // Ayudas Económicas y Monto a Previsionar son numéricos, % es numérico (decimal)
            rows.push({
              Campo: `${(filaLabels as Record<string, string>)[fila] || fila} / ${col.label} / Ayudas Económicas`, Valor: typeof celda.ayudasEconomicas === 'number' ? celda.ayudasEconomicas : Number(celda.ayudasEconomicas)
            });
            rows.push({
              Campo: `${(filaLabels as Record<string, string>)[fila] || fila} / ${col.label} / %`, Valor: typeof celda.porcentaje === 'number' ? celda.porcentaje : Number(celda.porcentaje)
            });
            rows.push({
              Campo: `${(filaLabels as Record<string, string>)[fila] || fila} / ${col.label} / Monto a Previsionar`, Valor: typeof celda.montoAPrevisionar === 'number' ? celda.montoAPrevisionar : Number(celda.montoAPrevisionar)
            });
          }
        });
      });
    });
    return rows;
  }

  // Custom flattener for Anexo VII (header + table)
  function anexo7ToRows(data: Anexo7Data): Row[] {
    if (!data) return [{ Campo: 'Sin datos', Valor: '' }];
    const rows: Row[] = [];
    // Header
    const headerLabels: Record<string, string> = {
      asociacionMutual: 'Asociación Mutual',
      domicilio: 'Domicilio',
      localidad: 'Localidad',
      telefono: 'Teléfono',
      matricula: 'Matrícula',
      fechaArqueo: 'Fecha de Arqueo',
      periodoMensual: 'Período Mensual',
      mail: 'Mail',
      actaNumero: 'N° de Acta',
    };
    Object.entries(data.header || {}).forEach(([k, v]) => {
      // Todos los campos de header son texto
      if (v !== undefined) {
        rows.push({ Campo: headerLabels[k] || k, Valor: typeof v === 'string' ? v : String(v) });
      }
    });
    // Table rows
    rows.push({ Campo: '--- Detalle de Mayores Saldos ---', Valor: '' });
    if (Array.isArray(data.rows)) {
      data.rows.forEach((row: any, idx: number) => {
        if (row.orden !== undefined)
          rows.push({ Campo: `Fila ${idx + 1} - Orden`, Valor: typeof row.orden === 'number' ? row.orden : Number(row.orden) });
        if (row.nombreORazonSocial !== undefined)
          rows.push({ Campo: `Fila ${idx + 1} - Nombre o Razón Social`, Valor: typeof row.nombreORazonSocial === 'string' ? row.nombreORazonSocial : String(row.nombreORazonSocial) });
        if (row.cuitCuilCdi !== undefined)
          rows.push({ Campo: `Fila ${idx + 1} - CUIT/CUIL/CDI`, Valor: typeof row.cuitCuilCdi === 'string' ? row.cuitCuilCdi : String(row.cuitCuilCdi) });
        if (row.numeroAsociado !== undefined)
          rows.push({ Campo: `Fila ${idx + 1} - Nº Asociado`, Valor: typeof row.numeroAsociado === 'string' ? row.numeroAsociado : String(row.numeroAsociado) });
        if (row.mayoresSaldosAhorro !== undefined)
          rows.push({ Campo: `Fila ${idx + 1} - Mayores Saldos Ahorro`, Valor: typeof row.mayoresSaldosAhorro === 'number' ? row.mayoresSaldosAhorro : Number(row.mayoresSaldosAhorro) });
      });
    }
    if (data.totalMayoresSaldos !== undefined)
      rows.push({ Campo: 'Total Mayores Saldos', Valor: typeof data.totalMayoresSaldos === 'number' ? data.totalMayoresSaldos : Number(data.totalMayoresSaldos) });
    return rows;
  }

  // Exporta todos los anexos como CSV y los agrupa en un ZIP para descargar
  async function exportToCSVZip() {
    const zip = new JSZip();
    // Helper para convertir filas a CSV
    function rowsToCSV(rows: Row[]): string {
      if (!rows.length) return '';
      const header = Object.keys(rows[0]).join(',');
      const csvRows = rows.map(r => Object.values(r).map(v => {
        if (typeof v === 'string' && (v.includes(',') || v.includes('"') || v.includes('\n'))) {
          return '"' + v.replace(/"/g, '""') + '"';
        }
        return v;
      }).join(','));
      return [header, ...csvRows].join('\r\n');
    }
    // Anexos
    zip.file('Anexo_I.csv', rowsToCSV(objectToRows(anexo1Data)));
    zip.file('Anexo_II.csv', rowsToCSV(objectToRows(anexo2Data)));
    zip.file('Anexo_III.csv', rowsToCSV(objectToRows(anexo3Data)));
    zip.file('Anexo_IV.csv', rowsToCSV(anexo4ToRows(anexo4Data)));
    zip.file('Anexo_V.csv', rowsToCSV(anexo5ToRows(anexo5Data)));
    zip.file('Anexo_VII.csv', rowsToCSV(anexo7ToRows(anexo7Data)));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    setExcelUrl(url);
    setIsExporting(false);
    setShowDownload(true);
    setModalState({
      isOpen: true,
      type: 'download',
      title: '¡Listo!',
      message: 'El archivo ZIP con los CSV está listo para descargar.'
    });
    // Limpiar savedStatus y datos de anexos en localStorage después de exportar
    localStorage.removeItem('saem_saved_status');
    localStorage.removeItem('saem_formulario');
  }

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
    setShowDownload(false);
    setExcelUrl(null);
  };

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

  // debug: log activeView changes
  useEffect(() => {
    console.info('activeView changed to', activeView);
  }, [activeView]);

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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo1: true }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo1: false }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo2: true }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo2: false }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo3: true }));
    // Puedes mostrar modal si lo deseas
    // setModalState({ isOpen: true, type: 'success', title: '¡Éxito!', message: 'El Anexo III ha sido guardado.' });
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
  const handleSaveAnexo4 = async (data: Anexo4Data) => {
    setAnexo4Data(data);
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo4: true }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo4: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo IV han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo IV:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo IV.' });
    }
  };

  // --- LÓGICA PARA ANEXO V ---
  const handleSaveAnexo5 = async (data: Anexo5Data) => {
    setAnexo5Data(data);
    try {
      const response = await fetch('http://localhost:5236/api/anexo5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo5: true }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo5: false }));
      setModalState({ isOpen: true, type: 'success', title: 'Datos Reseteados', message: 'Los datos del Anexo V han sido eliminados.' });
    } catch (error) {
      console.error("Error al borrar Anexo V:", error);
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudieron borrar los datos del Anexo V.' });
    }
  };

  // --- LÓGICA PARA ANEXO VII ---
  const handleSaveAnexo7 = async (data: Anexo7Data) => {
    setAnexo7Data(data);
    try {
      const response = await fetch('http://localhost:5236/api/anexo7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo7: true }));
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
  setSavedStatus((prev: SavedStatus) => ({ ...prev, anexo7: false }));
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
    <div className="App">
      <Header />
  <Nav activeView={activeView} setActiveView={setActiveView} />
  <Breadcrumb status={savedStatus} />
      <div className="container">
        {isLoading && <div style={{ padding: '1rem', textAlign: 'center' }}>Cargando datos...</div>}
        {/* Modal avanzado para confirmación, loading y descarga */}
        {modalState.isOpen && (
          <div>
            {modalState.type === 'confirm' && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>{modalState.title}</h2>
                  </div>
                  <div className="modal-body">
                    <p>{modalState.message}</p>
                  </div>
                  <div className="modal-footer">
                    <button onClick={handleConfirmGrabar} className="modal-button success">Confirmar</button>
                    <button onClick={handleCloseModal} className="modal-button error">Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {modalState.type === 'loading' && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>{modalState.title}</h2>
                  </div>
                  <div className="modal-body">
                    <p>{modalState.message}</p>
                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                      <div className="preloader" style={{ width: 40, height: 40, border: '4px solid #ccc', borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {modalState.type === 'download' && showDownload && excelUrl && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>{modalState.title}</h2>
                  </div>
                  <div className="modal-body">
                    <p>{modalState.message}</p>
                    <a
                      href={excelUrl}
                      download={getExcelFileName()}
                      className="modal-button success"
                      style={{ display: 'inline-block', margin: '1rem 0' }}
                      onClick={handleCloseModal}
                    >
                      Descargar Excel
                    </a>
                  </div>
                </div>
              </div>
            )}
            {/* Modal de error o éxito reutilizando el Modal original */}
            {(modalState.type === 'success' || modalState.type === 'error') && (
              <Modal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                type={modalState.type === 'success' ? 'success' : 'error'}
                title={modalState.title}
                message={modalState.message}
                errorList={modalState.errorList}
              />
            )}
          </div>
        )}
        <span style={{ display: 'none' }}>{JSON.stringify(savedStatus)}</span>
        <main>
          {renderActiveView()}
          {/* Botón Grabar formulario */}
          {allSaved && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <button className="modal-button success" onClick={handleGrabarFormulario} disabled={isExporting}>
                Grabar formulario
              </button>
            </div>
          )}
        </main>
      </div>
      {/* Preloader CSS */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
