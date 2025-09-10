import React from 'react';

type ActiveView = 'inicio' | 'anexo1' | 'anexo2' | 'anexo3' | 'anexo4' | 'anexo5' | 'anexo7';

interface InicioProps {
  setActiveView: (view: ActiveView) => void;
}

const Inicio: React.FC<InicioProps> = ({ setActiveView }) => (
  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <h1>Bienvenido al sistema de Anexos</h1>
    <p>Seleccione un Anexo para comenzar:</p>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      justifyContent: 'center',
      maxWidth: 500,
      margin: '2rem auto'
    }}>
      <button className="inicio-btn" onClick={() => setActiveView('anexo1')}>Anexo I</button>
      <button className="inicio-btn" onClick={() => setActiveView('anexo2')}>Anexo II</button>
      <button className="inicio-btn" onClick={() => setActiveView('anexo3')}>Anexo III</button>
      <button className="inicio-btn" onClick={() => setActiveView('anexo4')}>Anexo IV</button>
      <button className="inicio-btn" onClick={() => setActiveView('anexo5')}>Anexo V</button>
      <button className="inicio-btn" onClick={() => setActiveView('anexo7')}>Anexo VII</button>
    </div>
  </div>
);

export default Inicio;
