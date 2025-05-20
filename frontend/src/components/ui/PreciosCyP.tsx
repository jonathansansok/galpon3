import React from "react";

export default function PreciosCyP({
  data,
  onUpdate,
}: {
  data: {
    chapa: { costo: number; horas: number; diasPanos: number };
    pintura: { costo: number; horas: number; diasPanos: number };
  };
  onUpdate: (row: "chapa" | "pintura", field: string, value: number) => void;
}) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: "chapa" | "pintura",
    field: "costo" | "horas" | "diasPanos"
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
                Horas
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Días de Chapa / Paños
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Costo
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-6">Chapa</td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.chapa.horas}
                  onChange={(e) => handleInputChange(e, "chapa", "horas")}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </td>
              <td className="py-4 px-6">{data.chapa.diasPanos}</td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.chapa.costo}
                  onChange={(e) => handleInputChange(e, "chapa", "costo")}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6">Pintura</td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.pintura.horas}
                  onChange={(e) => handleInputChange(e, "pintura", "horas")}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </td>
              <td className="py-4 px-6">{data.pintura.diasPanos}</td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={data.pintura.costo}
                  onChange={(e) => handleInputChange(e, "pintura", "costo")}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}