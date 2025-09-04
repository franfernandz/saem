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
          Anexo I
        </li>
        <li className={status.anexo2 ? 'completed' : ''}>Anexo II</li>
        <li className={status.anexo3 ? 'completed' : ''}>Anexo III</li>
        <li className={status.anexo4 ? 'completed' : ''}>Anexo IV</li>
        <li className={status.anexo5 ? 'completed' : ''}>Anexo V</li>
        <li className={status.anexo7 ? 'completed' : ''}>Anexo VII</li>
      </ul>
    </div>
  );
}