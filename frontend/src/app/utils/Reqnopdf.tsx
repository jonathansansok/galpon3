import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

// Función para formatear la fecha y hora
const formatDateTime = (
  dateTime: string,
  includeTime: boolean = true
): string => {
  if (!dateTime) return "NO ESPECIFICADO";

  // Reemplazar la "T" por un espacio
  const dateTimeWithSpace = dateTime.replace("T", " ");

  const date = new Date(dateTimeWithSpace);
  const formattedDate = date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (includeTime) {
    const formattedTime = date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${formattedDate} ${formattedTime}  `;
  }

  return formattedDate;
};

// Función para cifrar el correo
const HandleMine2 = (email: string): string => {
  return email
    .replace(/[a-zA-Z]/g, (c) =>
      String.fromCharCode(
        c.charCodeAt(0) + 10 > (c <= "Z" ? 90 : 122)
          ? c.charCodeAt(0) + 10 - 26
          : c.charCodeAt(0) + 10
      )
    )
    .replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 11))
    .replace(/@/g, "^...-")
    .replace(/_/g, "5")
    .replace(/-/g, "9")
    .replace(/\./g, "8");
};

const generatePDF = async (payload: any) => {
  const { email, requerido_por, fechaHora, observacion, datos_filiatorios } = payload;
  const datosFiliatorios = JSON.parse(datos_filiatorios);

  const doc = new jsPDF();

  // Añadir logo
  const logo = new Image();
  logo.src = "/images/membrete.png"; // Cambia esta ruta a la ruta de tu logo

  // Asegurar que las imágenes se carguen antes de agregarlas al PDF
  const logoImage = await loadImage(logo.src);

  // Ajustar tamaño del logo
  const logoWidth = 38;
  const logoHeight = 20;
  doc.addImage(logoImage, "PNG", 15, 7, logoWidth, logoHeight);

  // Añadir título
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0);
  doc.text("INFORME: RESPUESTA DE", 58, 36); // Primera línea, movida 1 cm a la izquierda
  doc.text("REQUERIMIENTO - NEGATIVO", 54, 44); // Segunda línea, movida 1 cm a la izquierda

  // Añadir texto "Requerido por" y "Fecha de solicitud"
  let yPos = 50 + 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Requerido por: ${requerido_por}`, 14, yPos);
  doc.text(
    `Fecha de solicitud: ${formatDateTime(fechaHora, false)}`,
    144,
    yPos
  );
  yPos += 10;

  // Añadir texto "CONFIDENCIAL - Informe generado por"
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128); // Cambiar el color del texto a gris
  const emailCifrado = HandleMine2(email);
  doc.text(`CONFIDENCIAL - Informe generado por: ${emailCifrado}`, 15, yPos);
  yPos += 10;
  doc.setFontSize(0.2); // Tamaño de la microletra extremadamente pequeño
  doc.setTextColor(150); // Color de la microletra
  doc.text(`pftgtiroepqfgjtu`, 30, 50);
  doc.text(`pftgtiroepqfgjtu`, 30, 70);

  // Añadir tabla con los datos del formulario
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        "Nº",
        "APELLIDO",
        "NOMBRES",
        "DNI",
        "FECHA DE NACIMIENTO",
        "NACIONALIDAD",
        "NOVEDAD",
      ],
    ],
    body: datosFiliatorios.map((item: any, index: number) => [
      index + 1,
      item[`datosFiliatorios[${index}].apellido`] || "NO ESPECIFICADO",
      item[`datosFiliatorios[${index}].nombres`] || "NO ESPECIFICADO",
      item[`datosFiliatorios[${index}].numeroDni`] || "NO ESPECIFICADO",
      formatDateTime(item[`datosFiliatorios[${index}].fechaNacimiento`], false),
      item.nacionalidad || "NO ESPECIFICADO",
      item[`datosFiliatorios[${index}].novedad`] || "NO",
    ]),
    theme: "plain", // Usar el tema 'plain' para líneas verticales entre columnas
    styles: {
      cellPadding: 3,
      fontSize: 9,
      valign: "top", // Alinear contenido verticalmente hacia arriba
      halign: "center",
      lineWidth: 0.1, // Grosor de las líneas de la tabla
    },
    columnStyles: {
      // Establecer bordes a la derecha de cada columna (excepto la última)
      0: { cellWidth: 10, lineWidth: 0.1 },
      1: { cellWidth: 30, lineWidth: 0.1 },
      2: { cellWidth: 30, lineWidth: 0.1 },
      3: { cellWidth: 30, lineWidth: 0.1 },
      4: { cellWidth: 30, lineWidth: 0.1 },
      5: { cellWidth: 30, lineWidth: 0.1 },
      6: { cellWidth: 30, lineWidth: 0.1 },
    },
    headStyles: {
      fillColor: [81, 132, 175], // Fondo azul
      textColor: [255, 255, 255], // Letra blanca
      fontStyle: "bold", // Estilo de la fila de encabezado
      fontSize: 8, // Tamaño de fuente para el encabezado
    },
    didDrawPage: function (data: any) {
      // Añadir epígrafe en cada página
      const epigrafe = `Ley 25.520 ARTICULO 42. — Será reprimido con prisión de un mes a dos años e inhabilitación especial por doble tiempo, si no resultare otro delito más severamente penado, el que participando en forma permanente o transitoria de las tareas reguladas en la presente ley, indebidamente interceptare, captare o desviare comunicaciones telefónicas, postales, de telégrafo o facsímil, o cualquier otro sistema de envío de objetos o transmisión de imágenes, voces o paquetes de datos, así como cualquier otro tipo de información, archivo, registros y/o documentos privados o de entrada o lectura no autorizada o no accesible al público que no le estuvieren dirigidos.`;
      const epigrafeLines = doc.splitTextToSize(
        epigrafe,
        doc.internal.pageSize.getWidth() - 20
      );
      const startY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(81, 132, 175);
      doc.text(epigrafeLines, 10, startY, {
        maxWidth: doc.internal.pageSize.getWidth() - 20,
      });
    },
    margin: { bottom: 35 }, // Dejar espacio para el epígrafe
  });

  // Obtener la posición final de la tabla
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Agregar campo "Observación"
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text("Observación:", 14, finalY);
  let yPosObservacion = finalY + 8; // Incrementar la posición Y para el contenido de la observación
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const observacionLines = doc.splitTextToSize(observacion, 180);
  doc.text(observacionLines, 14, yPosObservacion);
  yPosObservacion += observacionLines.length * 10;

  // Agregar la frase final
  yPosObservacion += 10;
  doc.setFontSize(11);
  doc.setTextColor(75, 75, 75);
  doc.text(
    "*Compulsado los registros de L.P.U. (Legajo Personal y Único) y S.U.V. (Sistema Único de Visitas)",
    14,
    yPosObservacion
  );

  // Añadir microletra
  doc.setFontSize(0.1); // Tamaño de la microletra extremadamente pequeño
  doc.setTextColor(150); // Color de la microletra
  doc.text(`pftgtiroepqfgjtu`, 10, doc.internal.pageSize.getHeight() - 5);

  // Guardar el PDF con un nombre específico
  const fileName = `Resp. de Req. Negativo - Requerido por ${requerido_por}.pdf`;
  doc.save(fileName);
  Swal.fire(
    "PDF generado",
    "El PDF se ha generado y descargado correctamente",
    "success"
  );
};
export default generatePDF;

// Función para cargar una imagen y manejar la promesa
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
