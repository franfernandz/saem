// MiMutual.WebApp/src/components/Breadcrumb.tsx

interface BreadcrumbProps {
  // Por ahora, solo maneja el estado del Anexo 1
  status: {
    anexo1: boolean;
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
        <li className="">Anexo II</li>
      </ul>
    </div>
  );
}