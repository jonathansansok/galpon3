//frontend\src\components\ui\PreciosCyP.tsx
import React from "react";
import { FaSync } from "react-icons/fa";

export default function PreciosCyP({
  data,
  onMaterialesChange,
  onFieldChange,
  onReset,
}: {
  data: {
    chapa: { costo: number; horas: number; diasPanos: number; materiales: string };
    pintura: { costo: number; horas: number; diasPanos: number; materiales: string };
  };
  onMaterialesChange: (row: "chapa" | "pintura", value: string) => void;
  onFieldChange: (row: "chapa" | "pintura", field: string, value: number | string) => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Precios CyP</h2>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onReset(); }}
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition duration-200"
          title="Resetear valores desde las tablas de Chapa y Pintura"
        >
          <FaSync size={12} />
          Resetear conteo
        </button>
      </div>
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
                Dias de Chapa / Dias de Pano
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
                  onChange={(e) => onFieldChange("chapa", "costo", parseFloat(e.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Costo"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.chapa.horas}
                  onChange={(e) => onFieldChange("chapa", "horas", parseFloat(e.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Horas"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.chapa.diasPanos}
                  onChange={(e) => onFieldChange("chapa", "diasPanos", parseFloat(e.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Dias/Panos"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={data.chapa.materiales}
                  onChange={(e) => onMaterialesChange("chapa", e.target.value)}
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
                  onChange={(e) => onFieldChange("pintura", "costo", parseFloat(e.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Costo"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.pintura.horas}
                  onChange={(e) => onFieldChange("pintura", "horas", parseFloat(e.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Horas"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.pintura.diasPanos}
                  onChange={(e) => onFieldChange("pintura", "diasPanos", parseFloat(e.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Dias/Panos"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={data.pintura.materiales}
                  onChange={(e) => onMaterialesChange("pintura", e.target.value)}
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
