// frontend/src/components/ui/ExportButton.tsx

"use client";

import { exportToExcel } from "@/app/utils/exportToExcel";
import { Ingreso } from "@/types/Ingreso"; // Importa la interfaz Ingreso
import { Sumario } from "@/types/Sumario"; // Importa la interfaz Ingreso
import { Impacto } from "@/types/Impacto"; // Importa la interfaz Impacto
import { Agresion } from "@/types/Agresion"; // Importa la interfaz Agresion
import { Extramuro } from "@/types/Extramuro"; // Importa la interfaz Extramuro
import { Habeas } from "@/types/Habeas"; // Importa la interfaz Habeas
import { Elemento } from "@/types/Elemento"; // Importa la interfaz Elemento
import { Huelga } from "@/types/Huelga"; // Importa la interfaz Huelga
import { Manifestacion } from "@/types/Manifestacion"; // Importa la interfaz Manifestacion
import { Manifestacion2 } from "@/types/Manifestacion2"; // Importa la interfaz Manifestacion2
import { Preingreso } from "@/types/Preingreso"; // Importa la interfaz Preingreso
import { Prevencion } from "@/types/Prevencion"; // Importa la interfaz Preingreso
import { Reqpositivo } from "@/types/Reqpositivo"; // Importa la interfaz Preingreso
import { Reqno } from "@/types/Reqno"; // Importa la interfaz Preingreso
import { Atentado } from "@/types/Atentado"; // Importa la interfaz Preingreso
import { Egreso } from "@/types/Egreso"; // Importa la interfaz Preingreso
import { Riesgo } from "@/types/Riesgo"; // Importa la interfaz Preingreso
import { Procedimiento } from "@/types/Procedimiento"; // Importa la interfaz Preingreso
interface ExportButtonProps<T> {
  data: T[];
  fileName: string;
  onClick?: () => void;
}

export function ExportButton<
  T extends
    | Reqno
    | Reqpositivo
    | Prevencion
    | Procedimiento
    | Egreso
    | Manifestacion
    | Sumario
    | Atentado
    | Ingreso
    | Impacto
    | Agresion
    | Extramuro
    | Habeas
    | Elemento
    | Huelga
    | Manifestacion2
    | Preingreso
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
