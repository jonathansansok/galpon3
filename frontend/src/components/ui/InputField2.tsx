// components/ui/InputField2.tsx
import React from "react";

interface InputFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

const InputField2: React.FC<InputFieldProps> = ({
  id,
  value,
  onChange,
  label,
  placeholder,
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
    </div>
  );
};

export default InputField2;
