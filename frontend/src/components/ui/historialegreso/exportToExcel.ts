import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { formatDate, humanizeFieldName, isFieldValid } from "./FomattersHistorial";
import { excludedFields } from "@/app/utils/excludedFields";

export const exportToExcel = (editableHistorial: any[]) => {
  const formattedData = editableHistorial.map((egreso) => {
    const formattedRow: Record<string, any> = {
      "Fecha de Nacimiento": formatDate(egreso.datos.fechaNacimiento),
      "Fecha de Egreso": formatDate(egreso.fechaEgreso),
    };

    Object.entries(egreso.datos).forEach(([key, value]) => {
      if (!excludedFields.includes(key) && isFieldValid(value)) {
        formattedRow[humanizeFieldName(key)] =
          key === "fechaNacimiento" && typeof value === "string"
            ? formatDate(value)
            : value;
      }
    });

    if (isFieldValid(egreso.historial)) {
      formattedRow["Historial"] = egreso.historial;
    }

    return formattedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");

  const firstRecord = editableHistorial[0]?.datos || {};
  const nombre = firstRecord.nombres || "SinNombre";
  const apellido = firstRecord.apellido || "SinApellido";
  const lpu = firstRecord.lpu || "SinLPU";
  const dni = firstRecord.numeroDni || "SinDNI";
  const fileName = `Historial_${apellido}_${nombre}_LPU${lpu}_DNI${dni}.xlsx`;

  XLSX.writeFile(workbook, fileName);

  Swal.fire({
    icon: "success",
    title: "Exportado",
    text: `El historial ha sido exportado a Excel correctamente como "${fileName}".`,
    timer: 2000,
    showConfirmButton: false,
  });
};