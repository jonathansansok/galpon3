import React from "react";

export default function TipoTrabajoSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Tipo de Trabajo</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="Siniestro">Siniestro</option>
        <option value="General">General</option>
      </select>
    </div>
  );
}