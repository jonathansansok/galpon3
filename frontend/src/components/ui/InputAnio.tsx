//frontend\src\components\ui\InputAnio.tsx
import React from "react";

interface InputAnioProps {
  value: string; // Valor del input como cadena
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Función para manejar el cambio
  placeholder?: string; // Placeholder opcional
  label: string; // Etiqueta que aparecerá sobre el campo
}

export function InputAnio({
  value,
  onChange,
  placeholder,
  label,
}: InputAnioProps) {
  return (
    <div className="relative mb-4">
      {/* Input field con la etiqueta flotante */}
      <input
        id="anio"
        type="text" // Cambiado de "number" a "text" para manejar cadenas
        value={value}
        onChange={(e) => {
          console.log("[DEBUG] Valor ingresado en InputAnio:", e.target.value);
          onChange(e);
        }}
        autoComplete="off"
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={placeholder || " "}
      />
      <label
        htmlFor="anio"
        className="absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 ml-2 peer-focus:ml-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
}