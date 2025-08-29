// MiMutual.WebApp/src/components/Breadcrumb.tsx

interface BreadcrumbProps {
  // Ahora el status tiene una propiedad para cada anexo
  status: {
    anexo1: boolean;
    anexo2: boolean;
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
        {/* Aquí añadiríamos los demás anexos en el futuro */}
        <li className={status.anexo2 ? 'completed' : ''}>Anexo II</li>
      </ul>
    </div>
  );
}