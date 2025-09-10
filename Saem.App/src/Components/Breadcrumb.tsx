// MiMutual.WebApp/src/components/Breadcrumb.tsx

interface BreadcrumbProps {
  // Ahora el status tiene una propiedad para cada anexo
  status: {
    anexo1: boolean;
    anexo2: boolean;
    anexo3: boolean;
    anexo4: boolean;
    anexo5: boolean;
    anexo7: boolean;
  }
}

export function Breadcrumb({ status }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      <p>Progreso del Formulario:</p>
      <ul>
        <li className={status.anexo1 ? 'completed' : ''}>
          {status.anexo1 ? <span className="circle-check">✓</span> : <span className="circle-empty" />} Anexo I
        </li>
        <li className={status.anexo2 ? 'completed' : ''}>
          {status.anexo2 ? <span className="circle-check">✓</span> : <span className="circle-empty" />} Anexo II
        </li>
        <li className={status.anexo3 ? 'completed' : ''}>
          {status.anexo3 ? <span className="circle-check">✓</span> : <span className="circle-empty" />} Anexo III
        </li>
        <li className={status.anexo4 ? 'completed' : ''}>
          {status.anexo4 ? <span className="circle-check">✓</span> : <span className="circle-empty" />} Anexo IV
        </li>
        <li className={status.anexo5 ? 'completed' : ''}>
          {status.anexo5 ? <span className="circle-check">✓</span> : <span className="circle-empty" />} Anexo V
        </li>
        <li className={status.anexo7 ? 'completed' : ''}>
          {status.anexo7 ? <span className="circle-check">✓</span> : <span className="circle-empty" />} Anexo VII
        </li>
      </ul>
    </div>
  );
}