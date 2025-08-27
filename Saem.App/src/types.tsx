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