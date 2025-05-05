import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { formatDate, humanizeFieldName, isFieldValid } from "./FomattersHistorial";
import { excludedFields } from "@/app/utils/excludedFields";

export const exportToWord = (editableHistorial: any[]) => {
  let wordContent = `
    <style>
      @page {
        size: A4 landscape;
        margin: 1cm;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 10px;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        border: 1px solid black;
        padding: 5px;
        text-align: left;
      }
      h1 {
        text-align: center;
      }
    </style>
    <h1>Historial de Egresos</h1>
    <table>
  `;

  const columns: string[] = [
    "fechaNacimiento",
    "fechaHoraIng",
    "fechaEgreso",
    ...Object.keys(editableHistorial[0]?.datos || {}).filter(
      (key) =>
        !excludedFields.includes(key) &&
        isFieldValid(editableHistorial[0]?.datos[key]) &&
        key !== "fechaNacimiento"
    ),
    "historial",
  ];

  wordContent += "<tr>";
  columns.forEach((column) => {
    wordContent += `<th>${humanizeFieldName(column)}</th>`;
  });
  wordContent += "</tr>";

  editableHistorial.forEach((egreso) => {
    wordContent += "<tr>";
    columns.forEach((column) => {
      const value =
        column === "fechaNacimiento"
          ? formatDate(egreso.datos[column])
          : column === "fechaHoraIng"
          ? formatDate(egreso.datos[column])
          : column === "fechaEgreso"
          ? formatDate(egreso[column])
          : column === "historial"
          ? egreso.historial
          : column in egreso.datos
          ? egreso.datos[column]
          : "";
      wordContent += `<td>${value || ""}</td>`;
    });
    wordContent += "</tr>";
  });

  wordContent += "</table>";

  const blob = new Blob(["\ufeff", wordContent], {
    type: "application/msword",
  });

  const firstRecord = editableHistorial[0]?.datos || {};
  const nombre = firstRecord.nombres || "SinNombre";
  const apellido = firstRecord.apellido || "SinApellido";
  const lpu = firstRecord.lpu || "SinLPU";
  const dni = firstRecord.numeroDni || "SinDNI";
  const fileName = `Historial_${apellido}_${nombre}_LPU${lpu}_DNI${dni}.doc`;

  saveAs(blob, fileName);

  Swal.fire({
    icon: "success",
    title: "Exportado",
    text: `El historial ha sido exportado a Word correctamente como "${fileName}".`,
    timer: 2000,
    showConfirmButton: false,
  });
};