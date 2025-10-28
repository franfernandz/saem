// src/Components/Anexo2Form.tsx
import React, { useCallback, useMemo, useState } from "react";
import type { Anexo2Data, FilaAnexo2, Movimientos } from "../types"; // Asegúrate de importar Movimientos
import InputFieldAnexo2 from "./InputFieldAnexo2";
import {
  // validarCamposObligatorios, // Dejamos de usarlo directamente aquí por la UX con alert
  formatoDecimal, // Asegúrate de que este se importe y exista en macros.ts
  validarNoDecimalesAnexo2,
  validarDosDigitosAnexo2,
} from "../utils/macros"; // Ruta a tu macros.ts


interface Anexo2FormProps {
  data: Anexo2Data;
  setData: React.Dispatch<React.SetStateAction<Anexo2Data>>;
  onSave: () => void;
  onDelete: () => void;
}


const Anexo2Form: React.FC<Anexo2FormProps> = ({ data, setData, onSave, onDelete }) => {

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

  // Función auxiliar para navegar por el objeto anidado
  const getNestedObject = useCallback((obj: Anexo2Data, path: string) => {
    const pathParts = path.split('.');
    let current: any = obj;
    for (const part of pathParts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }, []);

  const handleChange = useCallback(
    (
      apartadoKey: 'apartadoA' | 'apartadoB',
      fullPathToFila: string, // Ejemplo: "recursosEnPesos.ahorroATermino"
      fieldOfFila: keyof FilaAnexo2 | `movimientos.${keyof Movimientos}`,
      value: number
    ) => {
      // Validaciones generales del valor
      // Se permite negativo para Anexo II: no bloquear por valores negativos

      // Validaciones específicas para ciertos campos (ej: sin decimales, 2 dígitos)
      if (fieldOfFila === 'cuentasAsociadosVigentes' || fieldOfFila === 'tasaEstimuloEfectivaMensual') {
        if (!validarNoDecimalesAnexo2(value, `${fullPathToFila}.${String(fieldOfFila)}`)) return;
      }
      if (fieldOfFila === 'tasaEstimuloEfectivaMensual') {
        if (!validarDosDigitosAnexo2(value, `${fullPathToFila}.${String(fieldOfFila)}`)) return;
      }

      setData((prev) => {
        const newData = structuredClone(prev); // structuredClone es ideal para copias profundas
        const filaToUpdate = getNestedObject(newData, `${apartadoKey}.${fullPathToFila}`);

        if (fieldOfFila.includes('.')) {
          const [parent, child] = fieldOfFila.split('.') as ['movimientos', keyof Movimientos];
          filaToUpdate[parent] = { ...filaToUpdate[parent], [child]: value };
          // Recalcular finPeriodo = debe - haber cuando cambia debe/haber
          const debe = filaToUpdate.movimientos.debe;
          const haber = filaToUpdate.movimientos.haber;
          filaToUpdate.finPeriodo = debe - haber;
        } else {
          (filaToUpdate as any)[fieldOfFila] = value;
          // Si se actualiza directamente finPeriodo u otro campo, mantener consistencia si corresponde
          if (fieldOfFila === 'finPeriodo') {
            // opcionalmente podríamos impedir edición directa, pero aquí solo dejamos el valor tal cual
          }
        }
        return newData;
      });
    },
    [setData, getNestedObject] // Añadir getNestedObject a las dependencias
  );

  const handleBlur = useCallback(
    () => {
      // Implementación más robusta para `validarCamposObligatorios` si se necesita.
      // Actualmente, la función original de macros.ts usa `alert`, lo cual no es ideal en React.
      // Podrías en su lugar:
      // 1. Validar y actualizar un estado de error local para ese input.
      // 2. Si `value` es 0 y es obligatorio, podrías marcar el input visualmente.
      // Ejemplo:
      // if (typeof value === 'number' && value === 0 && esCampoObligatorio(name)) {
      //   console.warn(`Campo obligatorio vacío: ${name}`);
      //   // setInputError(name, 'Este campo es obligatorio');
      // }

      // Validaciones de relación E_F y E_H (ejemplo, tendrías que mapear 'E' y 'H' a tus campos)
      // Estas validaciones suelen requerir acceso a múltiples campos, no solo al que perdió el foco.
      // Es más robusto hacerlas en el `onSave` o en un `useEffect` que monitoree grupos de campos.
      // Por ahora, solo como ejemplo:
      /*
      if (name.includes('movimientos.debe')) { // Asumiendo que 'debe' es 'E'
          const correspondingHaberPath = name.replace('movimientos.debe', 'movimientos.haber');
          const haberValue = getNestedObject(data, correspondingHaberPath); // Necesitas una forma de obtener el valor
          validarRelacionE_F(value as number, haberValue, name);
      }
      */
    },
    []
  );

  // Lógica para calcular los totales (se mantiene similar, pero se verifica la anidación de Movimientos)
  const totales = useMemo(() => {
    const { apartadoA, apartadoB } = data;

    // Helper para sumar propiedades de FilaAnexo2
    const sumFilas = (filas: FilaAnexo2[]): FilaAnexo2 => {
      return filas.reduce((acc, current) => {
        acc.movimientos.debe += current.movimientos.debe;
        acc.movimientos.haber += current.movimientos.haber;
        acc.finPeriodo += current.finPeriodo;
        acc.promedioPeriodo += current.promedioPeriodo;
        acc.cuentasAsociadosVigentes += current.cuentasAsociadosVigentes;
        // La tasa no se suma, se podría promediar o dejar en 0
        // acc.tasaEstimuloEfectivaMensual += current.tasaEstimuloEfectivaMensual;
        return acc;
      }, {
        movimientos: { debe: 0, haber: 0 },
        finPeriodo: 0,
        promedioPeriodo: 0,
        cuentasAsociadosVigentes: 0,
        tasaEstimuloEfectivaMensual: 0,
      });
    };

    // Apartado A
    const recursosPesosFilas = [
      apartadoA.recursosEnPesos.ahorroATermino,
      apartadoA.recursosEnPesos.ahorroVariableComun,
      apartadoA.recursosEnPesos.ahorroVariableEspecial,
      apartadoA.recursosEnPesos.otros,
    ];
    const totalRecursosPesos = sumFilas(recursosPesosFilas);

    const recursosMEFilas = [
      apartadoA.recursosEnMonedaExtranjera.ahorroATermino,
      apartadoA.recursosEnMonedaExtranjera.ahorroVariableComun,
      apartadoA.recursosEnMonedaExtranjera.ahorroVariableEspecial,
      apartadoA.recursosEnMonedaExtranjera.otros,
    ];
    const totalRecursosME = sumFilas(recursosMEFilas);

    const totalApartadoA = sumFilas([totalRecursosPesos, totalRecursosME]);

    // Apartado B
    const ayudaPesosFilas = [
      apartadoB.ayudaEnPesos.pagoIntegro,
      apartadoB.ayudaEnPesos.amortizable,
      apartadoB.ayudaEnPesos.otros,
    ];
    const totalAyudaPesos = sumFilas(ayudaPesosFilas);

    const ayudaMEFilas = [
      apartadoB.ayudaEnMonedaExtranjera.pagoIntegro,
      apartadoB.ayudaEnMonedaExtranjera.amortizable,
      apartadoB.ayudaEnMonedaExtranjera.otros,
    ];
    const totalAyudaME = sumFilas(ayudaMEFilas);

    const totalApartadoB = sumFilas([totalAyudaPesos, totalAyudaME]);


    return {
      totalRecursosPesos,
      totalRecursosME,
      totalApartadoA,
      totalAyudaPesos,
      totalAyudaME,
      totalApartadoB,
    };
  }, [data]);


  // Componente TotalRow para Anexo II (adaptado y formateando Movimientos)
  const TotalRowAnexo2 = useCallback(({ label, values, level = 1 }: { label: string; values: FilaAnexo2; level?: number }) => {
    const paddingLeft = level === 1 ? '0px' : (level === 2 ? '30px' : '60px');
    return (
      <tr className={`total-row level-${level}`}><td style={{ paddingLeft }}>{label}</td><td><input type="text" value={formatoDecimal(values.movimientos.debe)} readOnly className="total" /></td><td><input type="text" value={formatoDecimal(values.movimientos.haber)} readOnly className="total" /></td><td><input type="text" value={formatoDecimal(values.finPeriodo)} readOnly className="total" /></td><td><input type="text" value={formatoDecimal(values.promedioPeriodo)} readOnly className="total" /></td><td><input type="text" value={values.cuentasAsociadosVigentes.toLocaleString('es-AR')} readOnly className="total" /></td><td><input type="text" value={formatoDecimal(values.tasaEstimuloEfectivaMensual)} readOnly className="total" /></td></tr>
    );
  }, []); // Dependencias vacías porque formatoDecimal es una función pura


  return (
    <div className="anexo2-form">
      <h2>Anexo II - Recursos y Aplicaciones</h2>

      <h3>Apartado A: Recursos Captados</h3>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Saldo Fin Periodo</th>
            <th>Promedio Periodo</th>
            <th>Cant. Ctas Asoc. Vig.</th>
            <th>Tasa Estímulo %</th>
          </tr>
        </thead>
        <tbody>
          {/* APARTADO A - Recursos Captados */}


          <InputFieldAnexo2
            label="Ahorro a Término"
            values={data.apartadoA.recursosEnPesos.ahorroATermino}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnPesos.ahorroATermino", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Ahorro Variable Común"
            values={data.apartadoA.recursosEnPesos.ahorroVariableComun}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnPesos.ahorroVariableComun", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Ahorro Variable Especial"
            values={data.apartadoA.recursosEnPesos.ahorroVariableEspecial}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnPesos.ahorroVariableEspecial", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Otros"
            values={data.apartadoA.recursosEnPesos.otros}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnPesos.otros", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <TotalRowAnexo2 label="Recursos en Pesos" values={totales.totalRecursosPesos} level={2} />



          <InputFieldAnexo2
            label="Ahorro a Término"
            values={data.apartadoA.recursosEnMonedaExtranjera.ahorroATermino}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnMonedaExtranjera.ahorroATermino", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Ahorro Variable Común"
            values={data.apartadoA.recursosEnMonedaExtranjera.ahorroVariableComun}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnMonedaExtranjera.ahorroVariableComun", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Ahorro Variable Especial"
            values={data.apartadoA.recursosEnMonedaExtranjera.ahorroVariableEspecial}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnMonedaExtranjera.ahorroVariableEspecial", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Otros"
            values={data.apartadoA.recursosEnMonedaExtranjera.otros}
            onChange={(field, val) =>
              handleChange("apartadoA", "recursosEnMonedaExtranjera.otros", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <TotalRowAnexo2 label="Recursos en Moneda Extranjera" values={totales.totalRecursosME} level={2} />
          <TotalRowAnexo2 label="TOTAL APARTADO A - RECURSOS CAPTADOS" values={totales.totalApartadoA} level={1} />
        </tbody>
      </table>

      <h3>Apartado B: Aplicaciones</h3>
      <table style={{ marginTop: '20px' }}>
        
          {/* APARTADO B - Aplicaciones */}

          <thead>
            <tr>
              <th>Concepto</th>
              <th>Debe</th>
              <th>Haber</th>
              <th>Saldo Fin Periodo</th>
              <th>Promedio Periodo</th>
              <th>Cant. Ctas Asoc. Vig.</th>
              <th>Tasa Estímulo %</th>
            </tr>
          </thead>
        <tbody>
          <InputFieldAnexo2
            label="Pago Íntegro"
            values={data.apartadoB.ayudaEnPesos.pagoIntegro}
            onChange={(field, val) =>
              handleChange("apartadoB", "ayudaEnPesos.pagoIntegro", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Amortizable"
            values={data.apartadoB.ayudaEnPesos.amortizable}
            onChange={(field, val) =>
              handleChange("apartadoB", "ayudaEnPesos.amortizable", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Otros"
            values={data.apartadoB.ayudaEnPesos.otros}
            onChange={(field, val) =>
              handleChange("apartadoB", "ayudaEnPesos.otros", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <TotalRowAnexo2 label="Ayuda en Pesos" values={totales.totalAyudaPesos} level={2} />


          <InputFieldAnexo2
            label="Pago Íntegro"
            values={data.apartadoB.ayudaEnMonedaExtranjera.pagoIntegro}
            onChange={(field, val) =>
              handleChange("apartadoB", "ayudaEnMonedaExtranjera.pagoIntegro", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Amortizable"
            values={data.apartadoB.ayudaEnMonedaExtranjera.amortizable}
            onChange={(field, val) =>
              handleChange("apartadoB", "ayudaEnMonedaExtranjera.amortizable", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <InputFieldAnexo2
            label="Otros"
            values={data.apartadoB.ayudaEnMonedaExtranjera.otros}
            onChange={(field, val) =>
              handleChange("apartadoB", "ayudaEnMonedaExtranjera.otros", field, val)
            }
            onBlur={() => handleBlur()}
          />
          <TotalRowAnexo2 label="Ayuda en Moneda Extranjera" values={totales.totalAyudaME} level={2} />
          <TotalRowAnexo2 label="TOTAL APARTADO B - APLICACIONES" values={totales.totalApartadoB} level={1} />
        </tbody>
      </table>

      {/* Botones de acción */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onSave} className="save-button">Guardar Anexo II</button>
        <button onClick={() => setShowDeleteModal(true)} className="delete-button">Borrar Datos</button>
      </div>
      <DeleteModal />
    </div>
  );
};

export default Anexo2Form;