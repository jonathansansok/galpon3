// frontend/src/components/ui/MultimediaModals/WordModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/Collapse";

interface WordModalProps {
  isOpen: boolean;
  onClose: () => void;
  word1: string | null;
  setWord1: (word1: string | null) => void;
}

const WordModal: React.FC<WordModalProps> = ({
  isOpen,
  onClose,
  word1,
  setWord1,
}) => {
  const onWord1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setWord1(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 mt-0 !m-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-screen-lg max-h-screen-lg relative flex flex-wrap gap-4 overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          Cerrar
        </button>
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:flex-1 gap-4">
          <input className="mb-4" type="file" accept=".doc,.docx" onChange={onWord1Change} />
          {word1 && (
            <Collapse title="Word">
              <div className="flex space-x-1">
                <a
                  href={word1}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar Word
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordModal;