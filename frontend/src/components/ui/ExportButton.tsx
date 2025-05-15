// frontend/src/components/ui/ExportButton.tsx

"use client";

import { exportToExcel } from "@/app/utils/exportToExcel";
import { Ingreso } from "@/types/Ingreso"; // Importa la interfaz Ingreso
import { Tema } from "@/types/Tema"; // Importa la interfaz Ingreso
import { Presupuesto } from "@/types/Presupuesto"; // Importa la interfaz Ingreso
interface ExportButtonProps<T> {
  data: T[];
  fileName: string;
  onClick?: () => void;
}

export function ExportButton<
  T extends
   
    | Ingreso
    | Tema
    | Presupuesto
   
>({ data, fileName, onClick }: ExportButtonProps<T>) {
  const handleExport = () => {
    if (onClick) {
      onClick();
    } else {
      exportToExcel(data, fileName);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      style={{ marginBottom: "20px" }}
    >
      Exportar Tabla en Excel
    </button>
  );
}
