//frontend\src\components\ui\PymeCheckbox.tsx
interface PymeCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
  
  const PymeCheckbox: React.FC<PymeCheckboxProps> = ({ checked, onChange }) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id="pyme"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)} // Devuelve un booleano
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="pyme"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          PyMe con factura de crédito
        </label>
      </div>
    );
  };
  
  export default PymeCheckbox;