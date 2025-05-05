//frontend\src\app\utils\PreAlertaPdf.ts

import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { formatUbicacionMap } from "@/app/utils/formatters";
import {
  formatDateTime,
  HandleMine2,
  formatDomicilios,
  formatUbicacionMapa,
  formatReingresos,
  loadImage,
} from "./pdfUtils";

const generatePDF = async (ingreso: any, imagen: string | null) => {
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
  doc.text("R.A.P. - Pre Alerta de ingreso", 60, 40); // Ajusta la posición Y a 50 (bajado 2 cm)

  // Añadir imagen del formulario si existe
  if (imagen) {
    const formImage = await loadImage(imagen);
    const imageWidth = 40; // 4 cm en mm
    const imageHeight = 40; // 4 cm en mm
    const imageX = doc.internal.pageSize.getWidth() - imageWidth - 15; // Ajusta la posición X para que esté a la derecha
    const imageY = 20; // Mantén la posición Y de la imagen
    doc.addImage(formImage, "PNG", imageX, imageY, imageWidth, imageHeight);
  }

  // Añadir texto "Informe generado por encryptedEmail" justo arriba de la tabla
  const emailCifrado = HandleMine2(ingreso.email);
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128); // Cambiar el color del texto a gris
  doc.text(`Informe confidencial generado por ${emailCifrado}`, 15, 58);
  doc.setTextColor(0, 0, 0); // Volver el color del texto a negro
  doc.setFontSize(0.2); // Tamaño de la microletra extremadamente pequeño
  doc.setTextColor(150); // Color de la microletra
  doc.text(`pftgtiroepqfgjtu`, 30, 50);
  doc.text(`pftgtiroepqfgjtu`, 30, 70);

  // Formatear los campos "Reincidencias" y "Ubicación Map."
  const { count: reincidenciasCount, formatted: reincidenciasString } =
    formatReingresos(ingreso.internosinvolucradoSimple);
  const ubicacionMapaString = formatUbicacionMapa(ingreso.ubicacionMap);

  (doc as any).autoTable({
    head: [["Campo", "Valor"]],
    body: [
      [
        { content: "Clasificación", styles: { fontStyle: "bold" } },
        {
          content: ingreso.clasificacion,
          styles: {
            textColor:
              ingreso.clasificacion === "ALTA"
                ? [255, 0, 0]
                : ingreso.clasificacion === "MEDIA"
                ? [255, 165, 0]
                : [0, 128, 0],
          },
        },
      ],
      ["Fecha y hora de Informe", formatDateTime(ingreso.fechaHoraIng)],
      ["Apellido/s", ingreso.apellido],
      ["Nombre/s", ingreso.nombres],
      ["Alias", ingreso.alias],
      ["Nacionalidad", ingreso.nacionalidad],
      ["Fecha de nacimiento", formatDateTime(ingreso.fechaNacimiento)],
      ["Edad a la fecha", ingreso.edad_ing],
      ["Tipo de Doc.", ingreso.tipoDoc],
      ["Número de Doc.", ingreso.numeroDni],
      ["Reincidencias:", `(${reincidenciasCount}): ${reincidenciasString}`],
      ["Domicilio/s", formatDomicilios(ingreso.domicilios)],
      ["Mapa de calor", formatUbicacionMap(ingreso.ubicacionMap)],
      ["Organización criminal", ingreso.orgCrim],
      ["Nombre Org. crim.", ingreso.cualorg],
      ["Procedencia", ingreso.procedencia],
      ["Destino", ingreso.establecimiento],
      ["Delitos", ingreso.electrodomesticos],
      ["Juzgados", ingreso.juzgados],
      ["Órgano judicial", ingreso.org_judicial],
      ["Nº de causa", ingreso.numeroCausa],
      ["Reingreso", ingreso.reingreso],
      ["Registro SUV", ingreso.reg_suv],
      ["Registro CIR", ingreso.reg_cir],
      ["Circunstancias de detención", ingreso.cirDet],
      ["Observación", ingreso.observacion],
      ["Resumen", ingreso.resumen],
      ["Link de información pública", ingreso.link],
    ],
    startY: 63, // Ajusta la posición de inicio de la tabla (bajado 2 cm)
    styles: {
      fontSize: 11,
      cellPadding: 3,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 140, halign: "justify" },
    },

    didDrawPage: function (data: any) {
      // Añadir epígrafe al pie de cada página
      const epigrafe = `Ley 25.520 ARTICULO 42. — Será reprimido con prisión de un mes a dos años e inhabilitación especial por doble tiempo, si no resultare otro delito más severamente penado, el que participando en forma permanente o transitoria de las tareas reguladas en la presente ley, indebidamente interceptare, captare o desviare comunicaciones telefónicas, postales, de telégrafo o facsímil, o cualquier otro sistema de envío de objetos o transmisión de imágenes, voces o paquetes de datos, así como cualquier otro tipo de información, archivo, registros y/o documentos privados o de entrada o lectura no autorizada o no accesible al público que no le estuvieren dirigidos.`;
      const epigrafeLines = doc.splitTextToSize(
        epigrafe,
        doc.internal.pageSize.getWidth() - 20
      ); // Ajustar el ancho del texto del epígrafe
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

  // Añadir microletra
  doc.setFontSize(0.1); // Tamaño de la microletra extremadamente pequeño
  doc.setTextColor(150); // Color de la microletra
  doc.text(`pftgtiroepqfgjtu`, 10, doc.internal.pageSize.getHeight() - 5);

  // Guardar el PDF con un nombre específico
  const fileName = `R.A.P. Pre Alerta de ingreso: ${ingreso.apellido} - ${ingreso.nombres} - ${ingreso.establecimiento}.pdf`;
  doc.save(fileName);

  Swal.fire(
    "PDF generado",
    "El PDF se ha generado y descargado correctamente",
    "success"
  );
};

export default generatePDF;
