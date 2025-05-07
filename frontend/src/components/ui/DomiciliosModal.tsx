//frontend\src\components\ui\DomiciliosModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Domicilio {
  domicilio: string;
}

interface DomiciliosModalProps {
  isOpen: boolean;
  onClose: () => void;
  domicilios: Domicilio[];
  onAddDomicilio: (domicilio: Domicilio) => void;
  onRemoveDomicilio: (index: number) => void;
}

export function DomiciliosModal({ isOpen, onClose, domicilios, onAddDomicilio, onRemoveDomicilio }: DomiciliosModalProps) {
  const [domicilio, setDomicilio] = useState("");

  const handleAdd = () => {
    const newDomicilio = { domicilio };
    onAddDomicilio(newDomicilio);
    setDomicilio("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50" style={{ margin: 0 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl"> 
        <h2 className="text-xl font-semibold mb-4">Agregar Domicilio/s</h2>
        <div className="space-y-4">
          <div className="relative mb-4">
            <input
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              id="domicilio"
              name="domicilio"
              type="text"
              autoComplete="off"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="domicilio"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Domicilio escrito
            </label>
          </div>
          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Agregar
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Cerrar
            </Button>
          </div>
          <ul className="list-disc list-inside mt-4">
            {domicilios.map((d, index) => (
              <li key={index} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onRemoveDomicilio(index)}
                  className="mr-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
                {d.domicilio}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}