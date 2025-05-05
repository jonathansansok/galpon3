//frontend\src\components\ui\edad.tsx
import { useEffect, useState } from "react";

interface EdadProps {
  fechaNacimiento: string; // Fecha de nacimiento para calcular la edad
  onChange: (edad: string) => void; // Callback para sincronizar la edad con el formulario
}

export function Edad({ fechaNacimiento, onChange }: EdadProps) {
  const [edad, setEdad] = useState<string>("");

  // Función para calcular la edad
  const calcularEdad = (fechaNacimiento: string): string => {
    if (!fechaNacimiento) return "";
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad.toString();
  };

  useEffect(() => {
    const nuevaEdad = calcularEdad(fechaNacimiento);
    setEdad(nuevaEdad);  // Actualiza el estado local
  
// Para verificar que se está calculando correctamente
  
    onChange(nuevaEdad);  // Notifica al formulario
  }, [fechaNacimiento, onChange]);

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={edad}
        readOnly
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
      />
      <label
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white dark:bg-gray-900 px-2"
      >
        Edad
      </label>
    </div>
  );
}
