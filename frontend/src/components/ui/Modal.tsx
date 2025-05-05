//frontend\src\components\ui\Modal.tsx
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 h-5/6 overflow-auto relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 focus:outline-none"
        >
          Cerrar
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;