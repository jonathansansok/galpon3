import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface NumeroCuitProps {
  register: UseFormRegister<FieldValues>;
  name: string;
  label: string;
}

const NumeroCuit: React.FC<NumeroCuitProps> = ({ register, name, label }) => {
  return (
    <div className="relative mb-4">
      <input
        {...register(name)}
        id={name}
        name={name}
        type="text"
        autoComplete="off"
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" " // Importante: el placeholder debe ser un espacio vacío
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 ml-2 peer-focus:ml-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

export default NumeroCuit;