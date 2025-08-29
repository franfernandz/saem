// MiMutual.WebApp/src/types.ts

// El objeto principal que representa todo el Anexo
export interface Anexo1Data {
  disponibilidades: GrupoDisponibilidades;
  inversiones: GrupoInversiones;
}

// --- Interfaces para la sección de DISPONIBILIDADES ---
export interface GrupoDisponibilidades {
  enPesos: ConceptosEnMoneda;
  enMonedaExtranjera: ConceptosEnMoneda;
}

export interface ConceptosEnMoneda {
  caja: ValorMonetario;
  cuentaCorriente: ValorMonetario;
  otros: ValorMonetario;
}

// --- Interfaces para la sección de INVERSIONES ---
export interface GrupoInversiones {
  enPesos: ConceptosInversionPesos;
  enMonedaExtranjera: ConceptosInversionMonedaExtranjera;
}

export interface ConceptosInversionPesos {
  cajaDeAhorro: ValorMonetario;
  plazoFijo: ValorMonetario;
  titulosPublicos: ValorMonetario;
  tiCoCa: ValorMonetario;
  otros: ValorMonetario;
}

export interface ConceptosInversionMonedaExtranjera {
  cajaDeAhorro: ValorMonetario;
  plazoFijo: ValorMonetario;
  titulosPublicos: ValorMonetario;
  otros: ValorMonetario;
}

// --- Interface reutilizable para los valores finales ---
export interface ValorMonetario {
  saldoPeriodo: number;
  promedioPeriodo: number;
}

export interface Anexo1GetResponse {
  data: Anexo1Data;
  isSaved: boolean;
}

// ===================================================================
// NUEVAS INTERFACES PARA EL ANEXO II
// ===================================================================

// Interface para el objeto completo del Anexo II
export interface Anexo2Data {
  apartadoA: ApartadoA;
  apartadoB: ApartadoB;
}

// Interfaces para la Tabla A: Recursos Captados
export interface ApartadoA {
  recursosEnPesos: GrupoRecursos;
  recursosEnMonedaExtranjera: GrupoRecursos;
}

export interface GrupoRecursos {
  ahorroATermino: FilaAnexo2;
  ahorroVariableComun: FilaAnexo2;
  ahorroVariableEspecial: FilaAnexo2;
  otros: FilaAnexo2;
}

// Interfaces para la Tabla B: Aplicaciones
export interface ApartadoB {
  ayudaEnPesos: GrupoAyuda;
  ayudaEnMonedaExtranjera: GrupoAyuda;
}

export interface GrupoAyuda {
  pagoIntegro: FilaAnexo2;
  amortizable: FilaAnexo2;
  otros: FilaAnexo2;
}

// Interface base que representa una fila completa en cualquiera de las dos tablas
export interface FilaAnexo2 {
  movimientos: {
    debe: number;
    haber: number;
  };
  finPeriodo: number;
  promedioPeriodo: number;
  cuentasAsociadosVigentes: number;
  tasaEstimuloEfectivaMensual: number; // Guardado como número (ej: 0.05 para 5%)
}

// AÑADE ESTA INTERFAZ AL FINAL DEL ARCHIVO
export interface Anexo2GetResponse {
  data: Anexo2Data;
  isSaved: boolean;
}