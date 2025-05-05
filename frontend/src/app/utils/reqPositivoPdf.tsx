import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { formatUbicacionMap } from "@/app/utils/formatters";
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
    second: '2-digit'
  });
  return `${formattedDate} ${formattedTime}`;
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

const generatePDF = async (reqpos: any, imagen: string | null) => {
  const doc = new jsPDF();

  // Añadir logo
  const logo = new Image();
  logo.src = "/images/membrete.png";

  // Asegurar que las imágenes se carguen antes de agregarlas al PDF
  const logoImage = await loadImage(logo.src);

  // Ajustar tamaño del logo
  const logoWidth = 38;
  const logoHeight = 20;
  doc.addImage(logoImage, "PNG", 15, 7, logoWidth, logoHeight);

  // Añadir título
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0);
  doc.text("INFORME: RESPUESTA DE", 55, 36);
  doc.text("REQUERIMIENTO - POSITIVO", 51, 44);

  if (imagen) {
    const formImage = await loadImage(imagen);
    const imageWidth = 40;
    const imageHeight = 40;
    const imageX = doc.internal.pageSize.getWidth() - imageWidth - 15;
    const imageY = 20;
    doc.addImage(formImage, "PNG", imageX, imageY, imageWidth, imageHeight);
  }

  const emailCifrado = HandleMine2(reqpos.email);
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Informe confidencial generado por ${emailCifrado}`, 15, 58);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(0.2);
  doc.setTextColor(150);
  doc.text(`pftgtiroepqfgjtu`, 30, 50);
  doc.text(`pftgtiroepqfgjtu`, 30, 70);

  (doc as any).autoTable({
    head: [["Campo", "Valor"]],
    body: [
      ["Apellido/s", reqpos.apellido],
      ["Nombre/s", reqpos.nombres],
      ["Alias", reqpos.alias],
      ["Tipo de Documento", reqpos.tipoDoc],
      ["Número de Documento", reqpos.numeroDni],
      ["L.P.U.", reqpos.lpu],
      ["Situación Procesal", reqpos.sitProc],
      ["Motivo de egreso", reqpos.motivoEgreso],
      ["Establecimiento", reqpos.establecimiento],
      ["Fecha de ingreso", formatDateTime(reqpos.fechaHoraIng)],
      ["Fecha de Nacimiento", formatDateTime(reqpos.fechaNacimiento)],
      ["Edad", reqpos.edad_ing],
      ["Nacionalidad", reqpos.nacionalidad],
      ["Sexo", reqpos.sexo],
      ["Registra Antecedentes en SPF", reqpos.registraantecedentespf],
      ["Domicilio/s", reqpos.domicilios],
      ["Juzgados", reqpos.juzgados],
      ["Número/s de Causa/s", reqpos.numeroCausa],
      ["Delitos", reqpos.electrodomesticos],
      ["Mapa de calor", formatUbicacionMap(reqpos.ubicacionMap)],
      ["Prensa", reqpos.prensa],
      ["Observaciones", reqpos.observacion],
    ],
    startY: 63,
    styles: {
      fontSize: 11,
      cellPadding: 3,
      overflow: "linebreak",
      halign: "justify",
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 140, halign: "justify" },
    },
    didDrawPage: function (data: any) {
      const epigrafe = `Ley 25.520 ARTICULO 42. — Será reprimido con prisión de un mes a dos años e inhabilitación especial por doble tiempo, si no resultare otro delito más severamente penado, el que participando en forma permanente o transitoria de las tareas reguladas en la presente ley, indebidamente interceptare, captare o desviare comunicaciones telefónicas, postales, de telégrafo o facsímil, o cualquier otro sistema de envío de objetos o transmisión de imágenes, voces o paquetes de datos, así como cualquier otro tipo de información, archivo, registros y/o documentos privados o de entrada o lectura no autorizada o no accesible al público que no le estuvieren dirigidos.`;
      const epigrafeLines = doc.splitTextToSize(epigrafe, doc.internal.pageSize.getWidth() - 20);
      const startY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(81, 132, 175);
      doc.text(epigrafeLines, 10, startY, {
        align: "justify",
        maxWidth: doc.internal.pageSize.getWidth() - 20,
      });
    },
    margin: { bottom: 35 },
    didParseCell: function (data: any) {
      if (data.row.raw[0] === "Mapa de calor") {
        data.cell.styles.cellPadding = { top: 3, right: 3, bottom: 8, left: 3 };
      }
    },
  });

  doc.setFontSize(0.1);
  doc.setTextColor(150);
  doc.text(`pftgtiroepqfgjtu`, 10, doc.internal.pageSize.getHeight() - 5);

  const fileName = `Resp. de Req. "Positivo" - ${reqpos.tipoDoc} - ${reqpos.numeroDni} - L.P.U. ${reqpos.lpu} - ${reqpos.apellido} - ${reqpos.nombres} - POSITIVO.pdf`;
  doc.save(fileName);

  Swal.fire(
    "PDF generado",
    "El PDF se ha generado y descargado correctamente",
    "success"
  );
};

export default generatePDF;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
