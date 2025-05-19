//frontend\src\components\ui\PreciosCyP.tsx
import React, { useState } from "react";

export default function PreciosCyP({
  data,
  onUpdate,
}: {
  data: {
    chapa: { costo: number; horas: number; diasPanos: number; materiales: string };
    pintura: { costo: number; horas: number; diasPanos: number; materiales: string };
  };
  onUpdate: (row: "chapa" | "pintura", field: string, value: number) => void;
}) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: "chapa" | "pintura",
    field: "costo" | "horas" | "diasPanos" | "materiales"
  ) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(row, field, value);
  };

  return (
<div className="mt-6">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Precios CyP</h2>
  <div className="overflow-hidden rounded-lg shadow-lg bg-white">
    <table className="min-w-full bg-white">
      <thead>
        <tr className="bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-gray-800">
          <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
            Trabajo
          </th>
          <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
            Costo
          </th>
          <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
            Horas
          </th>
          <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
            Días de Chapa / Días de Paño
          </th>
          <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
            Materiales
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {/* Fila fija: Chapa */}
        <tr className="hover:bg-green-50">
          <td className="py-4 px-6 text-sm font-bold text-gray-700">Chapa</td>
          <td className="py-4 px-6">
            <input
              type="number"
              value={data.chapa.costo}
              onChange={(e) => handleInputChange(e, "chapa", "costo")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Costo"
            />
          </td>
          <td className="py-4 px-6">
            <input
              type="number"
              value={data.chapa.horas}
              onChange={(e) => handleInputChange(e, "chapa", "horas")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Horas"
            />
          </td>
          <td className="py-4 px-6">
            <input
              type="number"
              value={data.chapa.diasPanos}
              readOnly
              className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
              placeholder="Días/Paños"
            />
          </td>
          <td className="py-4 px-6">
            <input
              type="text"
              value={data.chapa.materiales}
              onChange={(e) => handleInputChange(e, "chapa", "materiales")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Materiales"
            />
          </td>
        </tr>
        {/* Fila fija: Pintura */}
        <tr className="hover:bg-green-50">
          <td className="py-4 px-6 text-sm font-bold text-gray-700">Pintura</td>
          <td className="py-4 px-6">
            <input
              type="number"
              value={data.pintura.costo}
              onChange={(e) => handleInputChange(e, "pintura", "costo")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Costo"
            />
          </td>
          <td className="py-4 px-6">
            <input
              type="number"
              value={data.pintura.horas}
              onChange={(e) => handleInputChange(e, "pintura", "horas")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Horas"
            />
          </td>
          <td className="py-4 px-6">
            <input
              type="number"
              value={data.pintura.diasPanos}
              readOnly
              className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
              placeholder="Días/Paños"
            />
          </td>
          <td className="py-4 px-6">
            <input
              type="text"
              value={data.pintura.materiales}
              onChange={(e) => handleInputChange(e, "pintura", "materiales")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Materiales"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
  );
}