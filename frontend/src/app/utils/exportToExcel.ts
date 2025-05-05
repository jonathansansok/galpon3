// frontend/src/utils/exportToExcel.ts
import * as XLSX from 'xlsx';

const excludedFields = [
  "imagen",
  "imagenDer",
  "imagenIz",
  "imagenDact",
  "imagenSen1",
  "imagenSen2",
  "imagenSen3",
  "imagenSen4",
  "imagenSen5",
  "imagenSen6",
  "pdf1",
  "pdf2",
  "pdf3",
  "pdf4",
  "pdf5",
  "pdf6",
  "pdf7",
  "pdf8",
  "pdf9",
  "pdf10",
  "word1",
  "imagenes",
  "ims",
  "rojos",
];

const cleanText = (text: string): string => {
  return text
    .replace(/[{}[\]\\'"]/g, '')
    .replace(/,/g, ', ')
    .replace(/:/g, ': ');
};

// Función para formatear la fecha y hora
const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return "NO ESPECIFICADO";
  
  // Reemplazar la "T" por un espacio
  const dateTimeWithSpace = dateTime.replace('T', ' ');
  
  const date = new Date(dateTimeWithSpace);
  const formattedDate = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return `${formattedDate} ${formattedTime}  `;
};

const filterData = (data: any[]) => {
  return data.map(item => {
    const filteredItem = { ...item };
    excludedFields.forEach(field => {
      delete filteredItem[field];
    });

    // Renombrar la columna 'modulo_ur' a 'Modulo-U.R.'
    if (filteredItem.modulo_ur) {
      filteredItem['Modulo-U.R.'] = filteredItem.modulo_ur;
      delete filteredItem.modulo_ur;
    }

    // Formatear las fechas
    Object.keys(filteredItem).forEach(key => {
      if (typeof filteredItem[key] === 'string' && filteredItem[key].includes('T')) {
        filteredItem[key] = formatDateTime(filteredItem[key]);
      }
    });

    return filteredItem;
  });
};

export const exportToExcel = (data: any[], fileName: string) => {
  if (data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const filteredData = filterData(data);
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ingresos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};