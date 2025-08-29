// MiMutual.WebApp/src/components/Modal.tsx

import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  errorList?: string[]; // 1. Nueva prop opcional para la lista de errores
}

export function Modal({ isOpen, onClose, type, title, message, errorList }: ModalProps) {
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
          
          {/* 2. Si existe una lista de errores, la mostramos */}
          {errorList && errorList.length > 0 && (
            <ul className="error-list">
              {errorList.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className={`modal-button ${type}`}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}