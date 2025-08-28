// MiMutual.WebApp/src/App.tsx

import { useState, useEffect } from 'react';
import type { Anexo1Data, Anexo1GetResponse } from './types'; // Importamos el nuevo tipo de respuesta
import { Anexo1Form } from './Components/Anexo1Form';
import { Header } from './Components/Header';
import { Nav } from './Components/Nav';
import { Breadcrumb } from './Components/Breadcrumb'; // Importamos el nuevo componente
import './App.css';

const initialData: Anexo1Data = {
  disponibilidades: {
    enPesos: { caja: { saldoPeriodo: 0, promedioPeriodo: 0 }, cuentaCorriente: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } },
    enMonedaExtranjera: { caja: { saldoPeriodo: 0, promedioPeriodo: 0 }, cuentaCorriente: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } }
  },
  inversiones: {
    enPesos: { cajaDeAhorro: { saldoPeriodo: 0, promedioPeriodo: 0 }, plazoFijo: { saldoPeriodo: 0, promedioPeriodo: 0 }, titulosPublicos: { saldoPeriodo: 0, promedioPeriodo: 0 }, tiCoCa: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } },
    enMonedaExtranjera: { cajaDeAhorro: { saldoPeriodo: 0, promedioPeriodo: 0 }, plazoFijo: { saldoPeriodo: 0, promedioPeriodo: 0 }, titulosPublicos: { saldoPeriodo: 0, promedioPeriodo: 0 }, otros: { saldoPeriodo: 0, promedioPeriodo: 0 } }
  }
};

function App() {
  const [anexo1Data, setAnexo1Data] = useState<Anexo1Data>(initialData);
  const [savedStatus, setSavedStatus] = useState({ anexo1: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5236/api/anexo1');
        if (!response.ok) throw new Error('Error de red al cargar los datos');
        
        const apiResponse: Anexo1GetResponse = await response.json();
        
        // ===================================================================
        // ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE!
        // ===================================================================
        // Verificamos si la propiedad 'data' de la respuesta es válida.
        if (apiResponse.data) {
          setAnexo1Data(apiResponse.data);
        } else {
          // Si es nula o indefinida, nos aseguramos de que el estado
          // contenga el objeto inicial vacío para no romper la app.
          console.warn("La API devolvió un objeto de datos nulo. Usando datos iniciales.");
          setAnexo1Data(initialData);
        }
        
        // El estado de guardado se establece normalmente.
        setSavedStatus({ anexo1: apiResponse.isSaved });

      } catch (error) {
        console.error("Hubo un problema al obtener los datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveAnexo1 = async () => {
    try {
      //const response = await fetch('http://localhost:5236/api/anexo1', {
      const response = await fetch('https://saem.onrender.com/api/anexo1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anexo1Data),
      });

      if (!response.ok) throw new Error('El servidor devolvió un error al guardar');
      
      alert('¡Anexo I guardado exitosamente!');
      // Actualizamos el estado de progreso a 'true' tras un guardado exitoso
      setSavedStatus({ anexo1: true });

    } catch (error) {
      console.error("Hubo un problema al guardar los datos del Anexo I:", error);
      alert('Error: No se pudieron guardar los datos.');
    }
  };

   return (
    <div className="container">
      <Header />
      <Nav />
      <Breadcrumb status={savedStatus} />
      <main>
        {isLoading ? (
          <p>Cargando aplicación...</p>
        ) : (
          <Anexo1Form 
            data={anexo1Data} 
            setData={setAnexo1Data}
            onSave={handleSaveAnexo1}
          />
        )}
      </main>
    </div>
  );
}

export default App;