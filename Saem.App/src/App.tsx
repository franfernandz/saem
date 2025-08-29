// MiMutual.WebApp/src/App.tsx

import { useState, useEffect } from 'react';
import type { Anexo1Data, Anexo1GetResponse, Anexo2Data, Anexo2GetResponse } from './types';
import { Anexo1Form } from './components/Anexo1Form';
import { Anexo2Form } from './components/Anexo2Form';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { Breadcrumb } from './components/Breadcrumb';
import { Modal } from './components/Modal';
import './App.css';

// 1. Declaramos el tipo UNA SOLA VEZ
type ActiveView = 'anexo1' | 'anexo2';

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

  const [savedStatus, setSavedStatus] = useState({ anexo1: false, anexo2: false });

  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: 'success', title: '', message: '', errorList: [] });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [responseAnexo1, responseAnexo2] = await Promise.all([
          fetch('http://localhost:5236/api/anexo1'),
          fetch('http://localhost:5236/api/anexo2')
        ]);

        if (!responseAnexo1.ok) throw new Error('Error al cargar datos del Anexo I');
        if (!responseAnexo2.ok) throw new Error('Error al cargar datos del Anexo II');

        const apiResponse1: Anexo1GetResponse = await responseAnexo1.json();
        const apiResponse2: Anexo2GetResponse = await responseAnexo2.json();

        if (apiResponse1.data) setAnexo1Data(apiResponse1.data);
        if (apiResponse2.data) setAnexo2Data(apiResponse2.data);

        setSavedStatus({
          anexo1: apiResponse1.isSaved,
          anexo2: apiResponse2.isSaved
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

  // --- RENDERIZADO ---
  const renderActiveView = () => {
    switch (activeView) {
      case 'anexo1':
        // CORRECCIÓN: Nos aseguramos de pasar la función con el nombre correcto
        return <Anexo1Form data={anexo1Data} setData={setAnexo1Data} onSave={handleSaveAnexo1} onDelete={handleDeleteAnexo1} />;
      case 'anexo2':
        return <Anexo2Form data={anexo2Data} setData={setAnexo2Data} onSave={handleSaveAnexo2} onDelete={handleDeleteAnexo2} />;
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
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        {...modalState}
      />
    </div>
  );
}

export default App;