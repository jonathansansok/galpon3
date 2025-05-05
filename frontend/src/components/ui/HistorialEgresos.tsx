//frontend\src\components\ui\HistorialEgresos.tsx
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Swal from "sweetalert2";
import { excludedFields } from "@/app/utils/excludedFields";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formatDate = (dateTime: string): string => {
  if (!dateTime) return "NO ESPECIFICADO";

  const date = new Date(dateTime);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const humanizeFieldName = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    fechaNacimiento: "Fecha de Nacimiento",
    fechaHoraIng: "Fecha de ingreso",
    fechaEgreso: "Fecha de Egreso",
    numeroDni: "Nº Documento",
    apellido: "Apellido",
    nombres: "Nombres",
    alias: "Alias",
    lpu: "LPU",
    lpuProv: "LPU Prov.",
    edad_ing: "Edad al Ingreso",
    procedencia: "Procedencia",
    condicion: "Condición",
    celda: "Celda",
    esAlerta: "¿Es Alerta?",
    establecimiento: "Establecimiento",
    historial: "Cronología de establecimientos",
  };

  return (
    fieldMap[fieldName] ||
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  );
};

const isFieldValid = (value: any): boolean => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "[]" ||
    value === "{}" ||
    value === "undefined"
  ) {
    return false;
  }
  return true;
};

function HistorialEgresos({
  historial,
  setHistorial,
}: {
  historial: any[];
  setHistorial: (newHistorial: any[]) => void;
}) {
  console.log("Historial recibido como prop:", historial); // Verificar datos iniciales

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableHistorial, setEditableHistorial] = useState<any[]>(historial);

  console.log("Estado inicial de editableHistorial:", editableHistorial); // Verificar estado inicial

  const toggleModal = () => {
    console.log("Modal toggled. Estado actual:", isModalOpen);
    setIsModalOpen(!isModalOpen);
  };

  const handleSave = () => {
    try {
      console.log("Guardando historial actualizado:", editableHistorial); // Verificar datos antes de guardar
      setHistorial(editableHistorial); // Guardar los cambios en el historial
      Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "El historial ha sido actualizado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      toggleModal();
    } catch (error) {
      console.error("Error al guardar el historial:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar los cambios.",
      });
    }
  };

  const handleFieldChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    console.log(`Cambiando el campo "${field}" del egreso ${index} a:`, value); // Verificar cambios en tiempo real
    const updatedHistorial = [...editableHistorial];
    updatedHistorial[index] = {
      ...updatedHistorial[index],
      [field]: value,
    };
    setEditableHistorial(updatedHistorial);
    console.log("Historial actualizado:", updatedHistorial); // Verificar historial actualizado
  };

  const exportToExcel = () => {
    const formattedData = editableHistorial.map((egreso) => {
      const formattedRow: Record<string, any> = {
        "Fecha de Nacimiento": formatDate(egreso.datos.fechaNacimiento),
        FechaEgreso: formatDate(egreso.fechaEgreso),
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
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Historial de en S.P.F. de"
    );

    // Generar el nombre del archivo dinámicamente
    const firstRecord = editableHistorial[0]?.datos || {};
    const nombre = firstRecord.nombres || "SinNombre";
    const apellido = firstRecord.apellido || "SinApellido";
    const lpu = firstRecord.lpu || "SinLPU";
    const dni = firstRecord.numeroDni || "SinDNI";
    const fileName = `Historial de en S.P.F. de_${apellido}_${nombre}_LPU${lpu}_DNI${dni}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    Swal.fire({
      icon: "success",
      title: "Exportado",
      text: `El historial ha sido exportado a Excel correctamente como "${fileName}".`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const exportToWord = () => {const exportToWord = () => {
    let wordContent = `
      <style>
        @page {
          size: A4 landscape; /* Tamaño A4 y orientación apaisada */
          margin: 1cm; /* Márgenes de la página */
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 8px; /* Reducir el tamaño de la fuente */
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid black;
          padding: 5px; /* Reducir el padding */
          text-align: left;
          word-wrap: break-word; /* Ajustar contenido largo */
        }
        h1 {
          text-align: center;
          font-size: 12px; /* Reducir el tamaño del título */
        }
      </style>
      <h1>Historial de Egresos</h1>
      <table>
    `;
  
    const columns: string[] = [
      "fechaNacimiento", // Primera columna
      "fechaHoraIng", // Segunda columna
      "fechaEgreso",
      ...Object.keys(historial[0]?.datos || {}).filter(
        (key) =>
          !excludedFields.includes(key) &&
          isFieldValid(historial[0]?.datos[key]) &&
          key !== "fechaNacimiento" // Evitar duplicar "fechaNacimiento"
      ),
      "historial", // Última columna
    ];
  
    // Agregar encabezados
    wordContent += "<tr>";
    columns.forEach((column: string) => {
      wordContent += `<th>${humanizeFieldName(column)}</th>`;
    });
    wordContent += "</tr>";
  
    // Agregar filas
    editableHistorial.forEach((egreso) => {
      wordContent += "<tr>";
      columns.forEach((column: string) => {
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
    const fileName = `HistorialEgresos_${apellido}_${nombre}_LPU${lpu}_DNI${dni}.doc`;
  
    saveAs(blob, fileName);
  
    Swal.fire({
      icon: "success",
      title: "Exportado",
      text: `El historial ha sido exportado a Word correctamente como "${fileName}".`,
      timer: 2000,
      showConfirmButton: false,
    });
  };
    let wordContent = `
    <style>
      @page {
        size: landscape; /* Establece la orientación apaisada */
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        border: 1px solid black;
        padding: 8px;
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
      "fechaNacimiento", // Primera columna
      "fechaHoraIng", // Segunda columna
      "fechaEgreso",
      ...Object.keys(historial[0]?.datos || {}).filter(
        (key) =>
          !excludedFields.includes(key) &&
          isFieldValid(historial[0]?.datos[key]) &&
          key !== "fechaNacimiento" // Evitar duplicar "fechaNacimiento"
      ),
      "historial", // Última columna
    ];
    // Agregar encabezados
    wordContent += "<tr>";
    columns.forEach((column: string) => {
      wordContent += `<th>${humanizeFieldName(column)}</th>`;
    });
    wordContent += "</tr>";

    // Agregar filas
    editableHistorial.forEach((egreso) => {
      wordContent += "<tr>";
      columns.forEach((column: string) => {
        const value =
          column === "fechaNacimiento"
            ? formatDate(egreso.datos[column])
            : column === "fechaEgreso"
            ? formatDate(egreso[column])
            : column === "historial"
            ? egreso[column]
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
    const fileName = `HistorialEgresos_${apellido}_${nombre}_LPU${lpu}_DNI${dni}.doc`;

    saveAs(blob, fileName);

    Swal.fire({
      icon: "success",
      title: "Exportado",
      text: `El historial ha sido exportado a Word correctamente como "${fileName}".`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (!historial || historial.length === 0) {
    console.log("El historial está vacío o no existe."); // Verificar si no hay datos
    return <p>*No posee reincidencias registradas en esta plataforma.</p>;
  }

  // Definir columnas manualmente en el orden deseado
  const columns: string[] = [
    "fechaNacimiento", // Primera columna
    "fechaHoraIng", // Segunda columna
    "edad_ing", // Segunda columna
    "fechaEgreso", // Tercera columna
    "apellido",
    "nombres",
    "alias",
    "numeroDni",
    "lpu",
    "lpuProv",
    "condicion",
    "esAlerta",
    "establecimiento",
    "historial", // Última columna
  ];

  console.log("Columnas generadas:", columns); // Verificar columnas generadas

  return (
    <div>
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        type="button"
      >
        Ver Historial de Egresos
      </button>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h3 className="text-lg font-bold mb-4">Historial de Egresos</h3>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            type="button"
          >
            Exportar a Excel
          </button>
          <button
            onClick={exportToWord}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            type="button"
          >
            Exportar a Word
          </button>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((column: string) => (
                <th
                  key={column}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {humanizeFieldName(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editableHistorial.map((egreso, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
  {columns.map((column: string) => (
    <td key={column} className="border border-gray-300 px-4 py-2">
      {column === "fechaNacimiento"
        ? formatDate(egreso.datos[column])
        : column === "fechaHoraIng"
        ? formatDate(egreso.datos[column])
        : column === "fechaEgreso"
        ? formatDate(egreso[column])
        : column === "historial"
        ? (console.log("Valor de historial:", egreso.historial),
          egreso.historial
            ? egreso.historial
                .split(/(?=\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})/)
                .join("\n")
            : "Sin datos")
        : column in egreso.datos
        ? egreso.datos[column]
        : ""}
    </td>
  ))}
</tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={toggleModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            type="button"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            type="button"
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default HistorialEgresos;
