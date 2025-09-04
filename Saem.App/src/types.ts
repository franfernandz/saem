// MiMutual.WebApp/src/types.tsx

// Interfaz para valores monetarios usados en Anexo1 y 2
export interface ValorMonetario {
  saldoPeriodo: number;
  promedioPeriodo: number;
}

// =============================
// Anexo I
// =============================
export interface Anexo1Data {
  disponibilidades: {
    enPesos: {
      caja: ValorMonetario;
      cuentaCorriente: ValorMonetario;
      otros: ValorMonetario;
    };
    enMonedaExtranjera: {
      caja: ValorMonetario;
      cuentaCorriente: ValorMonetario;
      otros: ValorMonetario;
    };
  };
  inversiones: {
    enPesos: {
      cajaDeAhorro: ValorMonetario;
      plazoFijo: ValorMonetario;
      titulosPublicos: ValorMonetario;
      tiCoCa: ValorMonetario;
      otros: ValorMonetario;
    };
    enMonedaExtranjera: {
      cajaDeAhorro: ValorMonetario;
      plazoFijo: ValorMonetario;
      titulosPublicos: ValorMonetario;
      otros: ValorMonetario;
    };
  };
}
export interface Anexo1GetResponse {
  id: string;             // id único del anexo
  data: Anexo1Data;       // la data real
  lastUpdated?: string;   // opcional: fecha de última modificación
  isSaved: boolean; // Indica si el anexo ha sido guardado previamente
}

// =============================
// Anexo II
// =============================

// --- Movimientos deudores/acreedores ---
export interface Movimientos {
  debe: number;
  haber: number;
}

// --- Cada fila de la tabla ---
export interface FilaAnexo2 {
  movimientos: Movimientos;           // DEBE/HABER
  finPeriodo: number;                 // SALDO FIN PERIODO
  promedioPeriodo: number;            // PROMEDIO PERIODO
  cuentasAsociadosVigentes: number;   // Cant. de Ctas de asoc vigentes
  tasaEstimuloEfectivaMensual: number;// Tasa Estimulo %
}

// --- Apartado A: Recursos Captados ---
export interface ApartadoA {
  recursosEnPesos: {
    ahorroATermino: FilaAnexo2;
    ahorroVariableComun: FilaAnexo2;
    ahorroVariableEspecial: FilaAnexo2;
    otros: FilaAnexo2;
  };
  recursosEnMonedaExtranjera: {
    ahorroATermino: FilaAnexo2;
    ahorroVariableComun: FilaAnexo2;
    ahorroVariableEspecial: FilaAnexo2;
    otros: FilaAnexo2;
  };
}

// --- Apartado B: Aplicaciones ---
export interface ApartadoB {
  ayudaEnPesos: {
    pagoIntegro: FilaAnexo2;
    amortizable: FilaAnexo2;
    otros: FilaAnexo2;
  };
  ayudaEnMonedaExtranjera: {
    pagoIntegro: FilaAnexo2;
    amortizable: FilaAnexo2;
    otros: FilaAnexo2;
  };
}

// --- Datos completos del Anexo II ---
export interface Anexo2Data {
  apartadoA: ApartadoA;
  apartadoB: ApartadoB;
}

// --- Respuesta de API ---
export interface Anexo2GetResponse {
  id: string;            // id único del anexo
  data: Anexo2Data;      // la data real
  lastUpdated?: string;  // opcional: fecha de última modificación
  isSaved: boolean; // Indica si el anexo ha sido guardado previamente
}


// =============================
// Anexo III
// =============================
export interface Anexo3ApartadoAInputs {
  PorcentajeArt9IncB: number; // decimal, ej: 0.10 = 10%
}

export interface Anexo3ApartadoBInputs {
  PatrimonioNeto: number;
  InversionesInmuebles: number;
  OtrosActivosFijos: number;
  CargosDiferidos: number;
  ActivosNoCorrientesNeto: number;
}

export interface Anexo3ApartadoCInputs {
  PorcentajeLimite: number;
  MontoMaximo: number;
  AhorrosQueSuperanLimite: number;
  CantidadSociosAyuda: number;
  CantidadSociosAhorro: number;
  PorcentajeLimiteAyuda: number;
  PorcentajeLimiteAhorro: number;
}

export interface Anexo3ApartadoDInputs {
  PromedioAyuda: number;
  CantidadCuentas: number;
  PromedioMaximoAyuda: number;
}

export interface Anexo3Data {
  ApartadoAInputs: Anexo3ApartadoAInputs;
  ApartadoBInputs: Anexo3ApartadoBInputs;
  ApartadoCInputs: Anexo3ApartadoCInputs;
  ApartadoDInputs: Anexo3ApartadoDInputs;

  // Campos calculados / DisplayRow
  ApartadoA_SaldoPromedioTotalCuentasAhorroMutual: number;
  ApartadoA_Total_1_3: number;
  ApartadoA_SaldoPromedioDisponibilidadesInversiones: number;
  ApartadoA_MargenDeficienciaPeriodo: number;
  ApartadoB_CapitalLiquido: number;
  ApartadoB_MaximoCaptacionCapitalLiquido: number;
  ApartadoB_MaximoCaptacionPatrimonioNeto: number;
  ApartadoB_CaptacionAhorroReferencia: number;
  ApartadoB_MargenDeficienciaCapitalLiquido: number;
  ApartadoB_MargenDeficienciaPatrimonioNeto: number;

  ApartadoC_MontoMaximo: number;
  ApartadoC_CapacidadPrestable: number;
  ApartadoC_MaximoAyudaYAhorro: number;
  ApartadoD_PromedioMaximoAyuda: number;

  // Campos adicionales para Apartado C
  ApartadoC_CapitalLiquido: number;
  ApartadoC_Maximo: number;
  ApartadoC_AhorrosAsociados: number;
  ApartadoC_Menos: number;
  ApartadoC_FondoGarantia: number;
  ApartadoC_Mas: number;
  ApartadoC_CapitalLiquido2: number;
  ApartadoC_PorcentajeAyuda: number;
  ApartadoC_PorcentajeAhorro: number;
  ApartadoC_MaximoAyudaAhorro: number;
  ApartadoC_AyudasSuperanLimite: number;
  ApartadoC_CantSociosAyuda: number;
  ApartadoC_AhorrosSuperanLimite: number;
  ApartadoC_CantSociosAhorro: number;

  // Campos adicionales para Apartado D
  ApartadoD_PromedioAyudaTotal: number;
  ApartadoD_CantidadCuentas: number;
  ApartadoD_PromedioMaximo: number;

}

export interface Anexo3GetResponse {
  id: string;             // id único del anexo
  data: Anexo3Data;       // la data real
  lastUpdated?: string;   // opcional: fecha de última modificación
  isSaved: boolean; // Indica si el anexo ha sido guardado previamente
}

// =============================
// Anexo IV
// =============================
export interface Anexo4Data {
  totalGeneralAyudaEconomica: ValoresSituacionAnexo4;
  pagoIntegro: ValoresSituacionAnexo4;
  pagoIntegroVencido: ValoresSituacionAnexo4;
  pagoIntegroAVencer: ValoresSituacionAnexo4;
  pagoIntegroAVencer_30: ValoresSituacionAnexo4;
  pagoIntegroAVencer_30a89: ValoresSituacionAnexo4;
  pagoIntegroAVencer_90mas: ValoresSituacionAnexo4;
  amortizable: ValoresSituacionAnexo4;
  amortizableVencido: ValoresSituacionAnexo4;
  amortizableAVencer: ValoresSituacionAnexo4;
  amortizableAVencer_3m: ValoresSituacionAnexo4;
  amortizableAVencer_6m: ValoresSituacionAnexo4;
  amortizableAVencer_12m: ValoresSituacionAnexo4;
  amortizableAVencer_resto: ValoresSituacionAnexo4;

  porcentajeAyudaConGtiaReal: number; // %
  porcentajeAyudaConGtiaPers: number; // %
  previsionesIncobrablesAcumuladas: number;
  previsionesAConstituir: number;
}

export interface ValoresSituacionAnexo4 {
  situacion1: number;
  situacion2: number;
  situacion3: number;
  situacion4: number;
  situacion5: number;
}

export interface Anexo4GetResponse {
  id: string;
  data: Anexo4Data;
  lastUpdated?: string;
  isSaved: boolean;
}

// =============================
// Anexo V
// =============================
export interface Anexo5Celda {
  ayudasEconomicas: number;
  porcentaje: number; // decimal (ej 0.01 = 1%)
  montoAPrevisionar: number; // derivado: ayudasEconomicas * porcentaje
}

export interface Anexo5Fila {
  sinGarantia: Anexo5Celda;
  conGarantiaPersonal: Anexo5Celda;
  conGarantiaReal: Anexo5Celda;
}

export interface Anexo5Tabla {
  normal_pagoIntegro: Anexo5Fila;
  normal_amortizable: Anexo5Fila;
  normal_total: Anexo5Fila;

  riesgoBajo_pagoIntegro: Anexo5Fila;
  riesgoBajo_amortizable: Anexo5Fila;
  riesgoBajo_total: Anexo5Fila;

  riesgoMedio_pagoIntegro: Anexo5Fila;
  riesgoMedio_amortizable: Anexo5Fila;
  riesgoMedio_total: Anexo5Fila;

  riesgoAlto_pagoIntegro: Anexo5Fila;
  riesgoAlto_amortizable: Anexo5Fila;
  riesgoAlto_total: Anexo5Fila;

  irrecuperable_pagoIntegro: Anexo5Fila;
  irrecuperable_amortizable: Anexo5Fila;
  irrecuperable_total: Anexo5Fila;

  total: Anexo5Fila;
}

export interface Anexo5Data {
  tablaPesos: Anexo5Tabla;
  tablaMonedaExtranjeraEnPesos: Anexo5Tabla;
}

export interface Anexo5GetResponse {
  id: string;
  data: Anexo5Data;
  lastUpdated?: string;
  isSaved: boolean;
}

// =============================
// Anexo VII
// =============================
export interface Anexo7Header {
  asociacionMutual: string;
  domicilio: string;
  localidad: string;
  telefono: string;
  matricula: string;
  fechaArqueo: string; // ISO o dd/mm/yyyy
  periodoMensual: string; // mm/yyyy
  mail: string;
  actaNumero: string;
}

export interface Anexo7Row {
  orden: number;
  nombreORazonSocial: string;
  cuitCuilCdi: string;
  numeroAsociado: string;
  mayoresSaldosAhorro: number;
}

export interface Anexo7Data {
  header: Anexo7Header;
  rows: Anexo7Row[]; // 20 + 1 total
  totalMayoresSaldos: number; // derived
}

export interface Anexo7GetResponse {
  id: string;
  data: Anexo7Data;
  lastUpdated?: string;
  isSaved: boolean;
}