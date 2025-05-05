
 // frontend/src/components/ui/InputFieldSimple.tsx

interface InputFieldSimpleProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label: string;
    name: string;
  }
  
  export function InputFieldSimple({
    value,
    onChange,
    placeholder,
    label,
    name,
  }: InputFieldSimpleProps) {
    return (
      <div className="relative mb-4">
        <input
          value={value}
          onChange={onChange}
          id={name}
          name={name}
          type="text"
          autoComplete="off"
          className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder={placeholder || " "}
        />
       <label
  htmlFor={name}
  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white dark:bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
>

          {label}
        </label>
      </div>
    );
  }