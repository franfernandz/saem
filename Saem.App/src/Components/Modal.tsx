// MiMutual.WebApp/src/components/Modal.tsx

import './Modal.css'; // Crearemos este archivo de estilos a continuación

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export function Modal({ isOpen, onClose, type, title, message }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const iconClass = type === 'success' ? 'icon-success' : 'icon-error';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className={`modal-icon ${iconClass}`}>
            {type === 'success' ? '✓' : '✕'}
          </div>
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className={`modal-button ${type}`}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}