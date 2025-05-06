// frontend/src/components/ui/InputField.tsx

import { UseFormRegister, FieldValues } from "react-hook-form";

// Definimos las propiedades del componente InputField
interface InputFieldProps {
  register: UseFormRegister<FieldValues>; // Tipo proporcionado por react-hook-form para registrar el input
  name: string; // Nombre del campo
  placeholder?: string; // Placeholder opcional
  label: string; // Etiqueta que aparecerá sobre el campo
}

export function InputField({
  register,
  name,
  placeholder,
  label,
}: InputFieldProps) {
  return (
    <div className="relative mb-4">
      {/* Input field con la etiqueta flotante */}
      <input
        {...register(name)} // Usamos register de react-hook-form para enlazar el input
        id={name} // El id es igual al nombre del campo
        name={name} // El nombre también será igual al nombre del campo
        type="text" // El tipo de input es texto
        autoComplete="off" // Deshabilitamos el autocompletado del navegador
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={placeholder || " "} // Mantenemos el placeholder vacío o el proporcionado para que la etiqueta flote correctamente
      />
      <label
  htmlFor={name}
  className="absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 ml-2 peer-focus:ml-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
>
  {label}
</label>
    </div>
  );
}
