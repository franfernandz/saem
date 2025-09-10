// src/utils/macros.ts
// Este archivo contiene las variables y funciones equivalentes a los módulos y macros VBA originales

// --------------------
// MÓDULO I – Variables globales (Mantener si son necesarias, sino eliminarlas)
// --------------------
export let ApartadoC3: number;
export let NombreHojaActual: string;
export let HojaActivaAnterior: string;
export let grabado: number;
export let ValidarGuardar: number;

// --------------------
// ANEXO I (Mantener si son necesarias, sino eliminarlas)
export let G12: number, G13: number, G14: number, G16: number, G17: number, G18: number;
export let G21: number, G22: number, G23: number, G24: number;
export let G26: number, G27: number, G28: number, G29: number, G36: number;

// --------------------
// ANEXO II (Mantener si son necesarias, sino eliminarlas)
// Estas variables ya no se usarán directamente si el estado se maneja en React
// export let F12: number, F13: number, F14: number, F15: number;
// export let H12: number, H13: number, H14: number, H15: number;
// etc.

// --------------------
// ANEXO III (Mantener si son necesarias, sino eliminarlas)
export let H95: number, H99: number;

// --------------------
// ANEXO IV
export let UltimaCeldaActiva: string | null;
export let f: number;
export let Ane45Desac: number;

// --------------------
// FUNCIONES DEL MÓDULO IV
// ANEXO IV
// Función para validar CUIT
export function validarCUIT(cuit: string): number {
    cuit = cuit.replace(/-/g, "");

    if (cuit.length !== 11) return -1;

    const prefijosValidos = ["20", "23", "24", "27", "34", "33", "30"];
    if (!prefijosValidos.includes(cuit.slice(0, 2))) return -1;

    const mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let resultado = 0;
    const verificador = parseInt(cuit[10], 10);

    for (let x = 0; x < 10; x++) {
        resultado += mult[x] * parseInt(cuit[x], 10);
    }

    resultado = 11 - (resultado % 11);
    if (resultado === 11) resultado = 0;
    if (resultado === 10) resultado = 9;

    return resultado === verificador ? 1 : 0;
}

// --------------------
// ANEXO V – Eventos de hoja
// --------------------

// Nota: en front-end estos eventos se deberán ejecutar al cambiar el valor de un input
// o al enfocarlo (onChange, onBlur, onFocus)

// Función para validar que no haya valores negativos
export function validarNegativos(valor: number): boolean {
    if (valor < 0) {
        alert("No acepta valores negativos"); // Mantengo el alert por tu referencia a las macros
        return false;
    }
    return true;
}

// --------------------
// ANEXO VII – Validaciones por fila y columna
// --------------------

// Función genérica para validar que los campos obligatorios tengan datos
// Recibe un array de objetos con {valor, nombreCelda}
export function validarCamposObligatorios(campos: { valor: number; nombreCelda: string }[]) {
    for (let campo of campos) {
        if (campo.valor === 0) {
            alert(`Ingrese datos en la celda indicada: ${campo.nombreCelda}`);
            // Aquí en front podrías poner focus en el input correspondiente
            return false;
        }
    }
    return true;
}

// --------------------
// CÁLCULO EXTRA
// --------------------

// Función de cálculo que formatea un número (como moneda pero solo con decimales)
// Ajustada para ser más flexible y no añadir el símbolo '$' aquí
export function formatoDecimal(valor: number): string {
    // Para números con decimales que se esperan en entradas monetarias
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valor);
}

// --------------------
// ANEXO II – Validaciones
// --------------------

// Validar que si hay valor en E también haya valor en F
export function validarRelacionE_F(e: number, f: number, celda: string): boolean {
    if (e !== 0 && f === 0) {
        alert(`Ingrese datos en la celda F correspondiente a ${celda}`);
        return false;
    }
    return true;
}

// Validar que si hay valor en E también haya valor en H
export function validarRelacionE_H(e: number, h: number, celda: string): boolean {
    if (e !== 0 && h === 0) {
        alert(`Ingrese datos en la celda H correspondiente a ${celda}`);
        return false;
    }
    return true;
}

// No se aceptan valores negativos (ya está arriba, pero si es específica de Anexo 2, puede duplicarse o usarse la general)
// export function validarNoNegativosAnexo2(valor: number, celda: string): boolean {
//     if (valor < 0) {
//         alert(`No se aceptan valores negativos en ${celda}`);
//         return false;
//     }
//     return true;
// }

// No se aceptan decimales
export function validarNoDecimalesAnexo2(valor: number, celda: string): boolean {
    if (!Number.isInteger(valor)) {
        alert(`No se admiten decimales en ${celda}`);
        return false;
    }
    return true;
}

// Máximo 2 dígitos en parte entera (H12–H15, H18–H21, H28–H30, H33–H35)
export function validarDosDigitosAnexo2(valor: number, celda: string): boolean {
    // Convertir a string para verificar la longitud de la parte entera
    const absValue = Math.abs(valor);
    if (absValue > 99) { // Esto verifica si tiene más de dos dígitos en la parte entera
        alert(`La parte entera no debe tener más de 2 dígitos en ${celda}`);
        return false;
    }
    return true;
}

// Máximo 100 meses de plazo (columnas C–G, filas 83–102 y 108–127)
// Esta función es más compleja de adaptar a un input individual.
// Si se refiere a un conjunto de inputs, necesitará un manejo diferente.
export function validarPlazosAnexo2(matriz: number[][]): boolean {
    for (let fila = 0; fila < matriz.length; fila++) {
        for (let valor of matriz[fila]) {
            if (valor > 99) { // Si se refiere a un valor máximo de 99
                alert(`No se puede insertar más de 2 dígitos enteros (fila ${fila + 1})`);
                return false;
            }
        }
    }
    return true;
}

// --------------------
// ANEXO III – Cálculos y helpers
// --------------------

import type { Anexo3Data } from "../types";

export function updateAnexo3Input(
    data: Anexo3Data,
    apartado: keyof Pick<Anexo3Data, 'ApartadoAInputs' | 'ApartadoBInputs' | 'ApartadoCInputs' | 'ApartadoDInputs'>,
    field: string,
    value: number
): Anexo3Data {
    const newData: Anexo3Data = JSON.parse(JSON.stringify(data));
    // Asegurar que la subpropiedad existe
    if (!newData.ApartadoAInputs) newData.ApartadoAInputs = { PorcentajeArt9IncB: 0 };
    if (!newData.ApartadoBInputs) newData.ApartadoBInputs = { PatrimonioNeto: 0, InversionesInmuebles: 0, OtrosActivosFijos: 0, CargosDiferidos: 0, ActivosNoCorrientesNeto: 0 };
    if (!newData.ApartadoCInputs) newData.ApartadoCInputs = { PorcentajeLimite: 0, MontoMaximo: 0, AhorrosQueSuperanLimite: 0, CantidadSociosAyuda: 0, CantidadSociosAhorro: 0, PorcentajeLimiteAyuda: 0, PorcentajeLimiteAhorro: 0 };
    if (!newData.ApartadoDInputs) newData.ApartadoDInputs = { PromedioAyuda: 0, CantidadCuentas: 0, PromedioMaximoAyuda: 0 };
    // @ts-expect-error indexado dinámico
    newData[apartado][field] = value;
    return computeAnexo3Derived(newData);
}

export function computeAnexo3Derived(data: Anexo3Data): Anexo3Data {
    const newData: Anexo3Data = JSON.parse(JSON.stringify(data));

    // Helper para asegurar número válido
    function safeNumber(n: any): number {
        const num = Number(n);
        return isNaN(num) || num === undefined || num === null ? 0 : num;
    }

    // Apartado A
    const saldoPromCtasAhorro = safeNumber(newData.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual);
    const porcentajeArt9 = safeNumber(newData.ApartadoAInputs.PorcentajeArt9IncB); // ej: 0.10
    newData.ApartadoA_Total_1_3 = round2(saldoPromCtasAhorro * porcentajeArt9);
    newData.ApartadoA_MargenDeficienciaPeriodo = round2(
        safeNumber(newData.ApartadoA_SaldoPromedioDisponibilidadesInversiones) - safeNumber(newData.ApartadoA_Total_1_3)
    );

    // Apartado B
    // Capital Líquido = Patrimonio Neto - (suma deducciones)
    const b = newData.ApartadoBInputs;
    const capitalLiquido = safeNumber(b.PatrimonioNeto)
        - (safeNumber(b.InversionesInmuebles)
        + safeNumber(b.OtrosActivosFijos)
        + safeNumber(b.CargosDiferidos)
        + safeNumber(b.ActivosNoCorrientesNeto));
    newData.ApartadoB_CapitalLiquido = round2(capitalLiquido);
    newData.ApartadoB_MaximoCaptacionCapitalLiquido = round2(safeNumber(newData.ApartadoB_CapitalLiquido) * 25);
    newData.ApartadoB_MaximoCaptacionPatrimonioNeto = round2(safeNumber(b.PatrimonioNeto) * 15);
    newData.ApartadoB_MargenDeficienciaCapitalLiquido = round2(safeNumber(newData.ApartadoB_MaximoCaptacionCapitalLiquido) - safeNumber(newData.ApartadoB_CaptacionAhorroReferencia));
    newData.ApartadoB_MargenDeficienciaPatrimonioNeto = round2(safeNumber(newData.ApartadoB_MaximoCaptacionPatrimonioNeto) - safeNumber(newData.ApartadoB_CaptacionAhorroReferencia));

    // Apartado C (según labels en UI; ajustar si hay fórmulas oficiales)
    // 1.2 Monto Máximo = 13% del Capital Líquido (o usar PorcentajeLimite)
    const c = newData.ApartadoCInputs;
    const capLiquidoC = safeNumber(newData.ApartadoB_CapitalLiquido);
    const porcentajeLimite = safeNumber(c.PorcentajeLimite) || 0.13; // fallback 13%
    newData.ApartadoC_CapitalLiquido = round2(capLiquidoC);
    newData.ApartadoC_Maximo = round2(capLiquidoC * porcentajeLimite);
    newData.ApartadoC_MontoMaximo = newData.ApartadoC_Maximo; // mantener ambos nombres si UI lo usa

    // 2.1 Ahorros de los Asociados: proviene de Apartado A - punto 1.1 (no tenemos desglose, usar input si lo hay)
    // De momento, preservar valores existentes de display si el usuario los cargó externamente
    const ahorrosAsociados = safeNumber(newData.ApartadoC_AhorrosAsociados);
    const menos = safeNumber(newData.ApartadoC_Menos);
    const fondoGarantia = safeNumber(newData.ApartadoC_FondoGarantia) || safeNumber(newData.ApartadoA_Total_1_3);
    const mas = safeNumber(newData.ApartadoC_Mas);
    const capitalLiquido2 = safeNumber(newData.ApartadoC_CapitalLiquido2) || capLiquidoC;

    newData.ApartadoC_FondoGarantia = round2(fondoGarantia);
    newData.ApartadoC_CapitalLiquido2 = round2(capitalLiquido2);
    newData.ApartadoC_CapacidadPrestable = round2((ahorrosAsociados - menos - fondoGarantia) + mas + capitalLiquido2);

    // 2.4 Porcentaje Límite para Ayuda = 8% Capacidad Prestable
    newData.ApartadoC_PorcentajeAyuda = round2(safeNumber(newData.ApartadoC_CapacidadPrestable) * 0.08);
    // 2.5 Porcentaje Límite para Ahorro = 5% Capacidad Prestable (o 10% Capital Líquido)
    const pctAhorroByCapPrestable = safeNumber(newData.ApartadoC_CapacidadPrestable) * 0.05;
    const pctAhorroByCapitalLiquido = capLiquidoC * 0.10;
    newData.ApartadoC_PorcentajeAhorro = round2(Math.max(pctAhorroByCapPrestable, pctAhorroByCapitalLiquido));

    // 3. Máximos y contadores (mantener valores existentes si vienen de inputs)
    newData.ApartadoC_MaximoAyudaYAhorro = round2(Math.max(safeNumber(newData.ApartadoC_PorcentajeAyuda), safeNumber(newData.ApartadoC_PorcentajeAhorro)));

    // Apartado D
    const d = newData.ApartadoDInputs;
    newData.ApartadoD_PromedioAyudaTotal = round2(safeNumber(newData.ApartadoD_PromedioAyudaTotal));
    newData.ApartadoD_CantidadCuentas = Math.trunc(safeNumber(d.CantidadCuentas) || safeNumber(newData.ApartadoD_CantidadCuentas));
    newData.ApartadoD_PromedioMaximo = round2(
        (safeNumber(newData.ApartadoD_CantidadCuentas) || 0) > 0
            ? safeNumber(newData.ApartadoD_PromedioAyudaTotal) / (safeNumber(newData.ApartadoD_CantidadCuentas) || 1)
            : 0
    );

    return newData;
}

function round2(n: number): number { return Math.round((n + Number.EPSILON) * 100) / 100; }

// --------------------
// ANEXO IV – Validaciones y helpers
// --------------------
import type { Anexo4Data, ValoresSituacionAnexo4 } from "../types";

export function validarFilaAnexo4(_vals: ValoresSituacionAnexo4, _nombre: string): string[] {
    const errors: string[] = [];
    // Se permiten números negativos (coincide con backend), no validar negativos
    // No hay restricciones de decimales aquí salvo que se definan a futuro
    // Placeholder para reglas adicionales por situación si aparecen
    return errors;
}

export function validarAnexo4Completo(data: Anexo4Data): string[] {
    const errores: string[] = [];
    const filas: Array<[ValoresSituacionAnexo4, string]> = [
        [data.totalGeneralAyudaEconomica, '1. TOTAL GENERAL AYUDA ECONOMICA'],
        [data.pagoIntegro, '1.1 PAGO INTEGRO'],
        [data.pagoIntegroVencido, '1.1.1 VENCIDO'],
        [data.pagoIntegroAVencer, '1.1.2 A VENCER'],
        [data.pagoIntegroAVencer_30, '1.1.2.1 Hasta 30 días'],
        [data.pagoIntegroAVencer_30a89, '1.1.2.2 De 30 a 89 días'],
        [data.pagoIntegroAVencer_90mas, '1.1.2.3 90 días en más'],
        [data.amortizable, '1.2 AMORTIZABLE'],
        [data.amortizableVencido, '1.2.1 VENCIDO'],
        [data.amortizableAVencer, '1.2.2 A VENCER'],
        [data.amortizableAVencer_3m, '1.2.2.1 Hasta 3 meses'],
        [data.amortizableAVencer_6m, '1.2.2.2 Hasta 6 meses'],
        [data.amortizableAVencer_12m, '1.2.2.3 Hasta 12 meses'],
        [data.amortizableAVencer_resto, '1.2.2.4 Resto'],
    ];
    for (const [vals, nombre] of filas) {
        errores.push(...validarFilaAnexo4(vals, nombre));
    }

    // Porcentajes: usar formato decimal (<1)
    if (data.porcentajeAyudaConGtiaReal >= 1 || data.porcentajeAyudaConGtiaReal < 0) {
        errores.push("El porcentaje de ayuda con garantía real debe ser un decimal entre 0 y <1.");
    }
    if (data.porcentajeAyudaConGtiaPers >= 1 || data.porcentajeAyudaConGtiaPers < 0) {
        errores.push("El porcentaje de ayuda con garantía personal debe ser un decimal entre 0 y <1.");
    }

    return errores;
}

// --------------------
// ANEXO V – Cálculos y helpers
// --------------------
import type { Anexo5Data, Anexo5Tabla, Anexo5Fila } from "../types";

export function computeAnexo5(data: Anexo5Data): Anexo5Data {
    const newData: Anexo5Data = JSON.parse(JSON.stringify(data));

    const recalcFila = (fila: Anexo5Fila) => {
        fila.sinGarantia.montoAPrevisionar = round2((fila.sinGarantia.ayudasEconomicas || 0) * (fila.sinGarantia.porcentaje || 0));
        fila.conGarantiaPersonal.montoAPrevisionar = round2((fila.conGarantiaPersonal.ayudasEconomicas || 0) * (fila.conGarantiaPersonal.porcentaje || 0));
        fila.conGarantiaReal.montoAPrevisionar = round2((fila.conGarantiaReal.ayudasEconomicas || 0) * (fila.conGarantiaReal.porcentaje || 0));
    };

    const recalcTabla = (t: Anexo5Tabla) => {
        Object.values(t).forEach((fila: any) => {
            if (fila && typeof fila === 'object' && 'sinGarantia' in fila) recalcFila(fila as Anexo5Fila);
        });

        const sumFilas = (f1: Anexo5Fila, f2: Anexo5Fila): Anexo5Fila => ({
            sinGarantia: {
                ayudasEconomicas: (f1.sinGarantia.ayudasEconomicas || 0) + (f2.sinGarantia.ayudasEconomicas || 0),
                porcentaje: f1.sinGarantia.porcentaje, // mantener el de la fila principal
                montoAPrevisionar: round2((f1.sinGarantia.montoAPrevisionar || 0) + (f2.sinGarantia.montoAPrevisionar || 0)),
            },
            conGarantiaPersonal: {
                ayudasEconomicas: (f1.conGarantiaPersonal.ayudasEconomicas || 0) + (f2.conGarantiaPersonal.ayudasEconomicas || 0),
                porcentaje: f1.conGarantiaPersonal.porcentaje,
                montoAPrevisionar: round2((f1.conGarantiaPersonal.montoAPrevisionar || 0) + (f2.conGarantiaPersonal.montoAPrevisionar || 0)),
            },
            conGarantiaReal: {
                ayudasEconomicas: (f1.conGarantiaReal.ayudasEconomicas || 0) + (f2.conGarantiaReal.ayudasEconomicas || 0),
                porcentaje: f1.conGarantiaReal.porcentaje,
                montoAPrevisionar: round2((f1.conGarantiaReal.montoAPrevisionar || 0) + (f2.conGarantiaReal.montoAPrevisionar || 0)),
            },
        });

        t.normal_total = sumFilas(t.normal_pagoIntegro, t.normal_amortizable);
        t.riesgoBajo_total = sumFilas(t.riesgoBajo_pagoIntegro, t.riesgoBajo_amortizable);
        t.riesgoMedio_total = sumFilas(t.riesgoMedio_pagoIntegro, t.riesgoMedio_amortizable);
        t.riesgoAlto_total = sumFilas(t.riesgoAlto_pagoIntegro, t.riesgoAlto_amortizable);
        t.irrecuperable_total = sumFilas(t.irrecuperable_pagoIntegro, t.irrecuperable_amortizable);
        t.total = sumFilas(sumFilas(sumFilas(t.normal_total, t.riesgoBajo_total), sumFilas(t.riesgoMedio_total, t.riesgoAlto_total)), t.irrecuperable_total);
    };

    recalcTabla(newData.tablaPesos);
    recalcTabla(newData.tablaMonedaExtranjeraEnPesos);

    return newData;
}

export function validarAnexo5(data: Anexo5Data): string[] {
    const errores: string[] = [];
    const checkFila = (fila: Anexo5Fila, nombre: string) => {
        const triples = [
            [fila.sinGarantia, 'Sin garantía'],
            [fila.conGarantiaPersonal, 'Con garantía personal'],
            [fila.conGarantiaReal, 'Con garantía real'],
        ] as const;
        for (const [celda, tipo] of triples) {
            if (celda.porcentaje < 0 || celda.porcentaje > 1) {
                errores.push(`${nombre} - ${tipo}: el porcentaje debe ser decimal entre 0 y 1`);
            }
        }
    };

    const checkTabla = (t: Anexo5Tabla, etiqueta: string) => {
        Object.entries(t).forEach(([k, v]) => {
            if (v && typeof v === 'object' && 'sinGarantia' in v) checkFila(v as Anexo5Fila, `${etiqueta} - ${k}`);
        });
    };

    checkTabla(data.tablaPesos, 'PESOS');
    checkTabla(data.tablaMonedaExtranjeraEnPesos, 'MONEDA EXTRANJERA EN PESOS');

    return errores;
}

// --------------------
// ANEXO VII – Validaciones y helpers
// --------------------
import type { Anexo7Data, Anexo7Row } from "../types";

export function computeAnexo7(data: Anexo7Data): Anexo7Data {
    const newData: Anexo7Data = JSON.parse(JSON.stringify(data));
    newData.totalMayoresSaldos = round2((newData.rows || []).reduce((acc: number, r: Anexo7Row) => acc + (r.mayoresSaldosAhorro || 0), 0));
    return newData;
}

export function validarAnexo7(data: Anexo7Data): string[] {
    const errores: string[] = [];
    // Validaciones eliminadas: Asociación Mutual, Fecha de Arqueo y Periodo Mensual

    (data.rows || []).forEach((r, idx) => {
        if (!r.nombreORazonSocial) errores.push(`Fila ${idx + 1}: Falta Apellido y Nombre / Razón Social`);
        if (!r.cuitCuilCdi) errores.push(`Fila ${idx + 1}: Falta CUIT/CUIL/CDI`);
        if (!r.numeroAsociado) errores.push(`Fila ${idx + 1}: Falta Número de Asociado`);
        if (r.mayoresSaldosAhorro < 0) errores.push(`Fila ${idx + 1}: El saldo no puede ser negativo`);
    });

    return errores;
}

export function updateAnexo7Row(data: Anexo7Data, index: number, field: keyof Anexo7Row, value: string | number): Anexo7Data {
    const newData: Anexo7Data = JSON.parse(JSON.stringify(data));
    (newData.rows[index] as any)[field] = value;
    return computeAnexo7(newData);
}