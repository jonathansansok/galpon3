// frontend/src/components/mapsTable/TableRow.tsx

import React from "react";
import { Ingreso } from "@/types/Ingreso";
import Image from "next/image";

interface TableRowProps {
  item: Ingreso;
  onRowClick: (id: string) => void;
  handleAddClick: (id: string) => void;
  handleRemoveClick: (id: string) => void;
  expanded: boolean;
  handleRowClick: (id: string) => void;
}

const TableRow = ({
  item,
  onRowClick,
  handleAddClick,
  handleRemoveClick, // Agregar esta línea
  expanded,
  handleRowClick,
}: TableRowProps) => {
  return (
    <>
      <tr className={`cursor-pointer hover:bg-green-300`}>
        <td className="py-2 px-4 border-b whitespace-nowrap text-left">
          <button
            onClick={() => handleAddClick(item.id.toString())}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Agregar
          </button>
        </td>
        <td className="py-2 px-4 border-b whitespace-nowrap text-left">
          {item.imagen && (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${item.imagen}`}
              alt="Imagen del ingreso"
              width={50}
              height={50}
              className="rounded-lg"
            />
          )}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.apellido}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.nombres}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.lpu}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.tipoDoc}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.numeroDni}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.cualorg}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.ubicacionMap}
        </td>
        <td
          className="py-2 px-4 border-b whitespace-nowrap text-left"
          style={{ maxWidth: "4cm", overflow: "hidden", textOverflow: "ellipsis" }}
          onClick={() => handleRowClick(item.id.toString())}
        >
          {item.condicion}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={10} className="py-2 px-4 border-b text-left">
            <div>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>Apellido:</strong> {item.apellido}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>Nombres:</strong> {item.nombres}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>LPU:</strong> {item.lpu}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>Tipo Doc:</strong> {item.tipoDoc}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>Número DNI:</strong> {item.numeroDni}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>G. Do.:</strong> {item.cualorg}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>Ubicación:</strong> {item.ubicacionMap}</p>
              <p style={{ marginTop: 0, marginBottom: 0 }}><strong>Condición:</strong> {item.condicion}</p>
              <button
                onClick={() => handleRemoveClick(item.id.toString())}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Quitar
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;