import { UseFormRegister } from "react-hook-form";

interface InputFieldYearProps {
  register: UseFormRegister<any>;
  placeholder?: string;
  label: string;
}

export function InputFieldYearDisp({
  register,
  placeholder,
  label,
}: InputFieldYearProps) {
  return (
    <div className="relative mb-4">
      <input
        {...register("disposicion")}
        id="disposicion"
        name="disposicion"
        type="text"
        autoComplete="off"
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={placeholder || " "}
      />
      <label
        htmlFor="disposicion"
        className="absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
    </div>
  );
}