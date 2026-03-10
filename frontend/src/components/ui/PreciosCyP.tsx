//frontend\src\components\ui\PreciosCyP.tsx
import React from "react";

export default function PreciosCyP({
  data,
  onMaterialesChange,
}: {
  data: {
    chapa: { costo: number; horas: number; diasPanos: number; materiales: string };
    pintura: { costo: number; horas: number; diasPanos: number; materiales: string };
  };
  onMaterialesChange: (row: "chapa" | "pintura", value: string) => void;
}) {
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
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
                  placeholder="Costo"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.chapa.horas}
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
                  placeholder="Horas"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.chapa.diasPanos}
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
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
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
                  placeholder="Costo"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.pintura.horas}
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
                  placeholder="Horas"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.pintura.diasPanos}
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 focus:outline-none"
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
