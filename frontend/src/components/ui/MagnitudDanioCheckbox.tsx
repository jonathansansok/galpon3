import React from "react";

export default function MagnitudDanioCheckbox({
  values,
  onChange,
}: {
  values: string[];
  onChange: (value: string) => void;
}) {
  const options = ["Leve", "Medio", "Fuerte"];

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Magnitud del Daño</label>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              value={option}
              checked={values.includes(option)}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}