import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { formatUbicacionMap } from "@/app/utils/formatters";
// Función para formatear la fecha y hora
const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return "NO ESPECIFICADO";
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${formattedDate}T${formattedTime}`;
};
const getRiskColor = (nivel: string): number[] => {
  switch (nivel) {
    case "Muy alto":
      return [255, 0, 0]; // rojo
    case "Alto":
      return [255, 165, 0]; // naranja
    case "Medio":
      return [255, 215, 0]; // amarillo fuerte
    case "Bajo":
      return [0, 128, 0]; // verde
    case "Muy bajo":
      return [0, 0, 255]; // azul
    default:
      return [128, 128, 128]; // gris
  }
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

const generatePDF = async (riesgo: any, imagen: string | null) => {
  const doc = new jsPDF();

  const logo = new Image();
  logo.src = "/images/membrete.png";
  const logoImage = await loadImage(logo.src);
  doc.addImage(logoImage, "PNG", 15, 7, 38, 20);

  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0);
  doc.text("Eval. S.I.G.P.P.L.A.R.", 70, 40);

  if (imagen) {
    const formImage = await loadImage(imagen);
    const imageX = doc.internal.pageSize.getWidth() - 40 - 15;
    doc.addImage(formImage, "PNG", imageX, 25, 40, 40);
  }

  const emailCifrado = HandleMine2(riesgo.email);
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Informe confidencial generado por ${emailCifrado}`, 15, 58);
  doc.setFontSize(0.2);
  doc.setTextColor(150);
  doc.text(`pftgtiroepqfgjtu`, 30, 50);
  doc.text(`pftgtiroepqfgjtu`, 30, 70);
  console.log(">> UBICACION MAP ORIGINAL:", riesgo.ubicacionMap);
  console.log(">> UBICACION MAP FORMATEADA:", formatUbicacionMap(riesgo.ubicacionMap));
  (doc as any).autoTable({
    head: [["Campo", "Valor"]],
    body: [
      ["Fecha de Informe", formatDateTime(riesgo.fechaHora)],
      ["Apellido/s", riesgo.apellido],
      ["Nombre/s", riesgo.nombres],
      ["L.P.U", riesgo.lpu],
      ["Situación Procesal", riesgo.sitProc],
      [
        {
          content: "Riesgo de Fuga",
          styles: { fontStyle: "bold" },
        },
        {
          content: riesgo.riesgo_de_fuga,
          styles: {
            fontStyle: "bold",
            textColor: getRiskColor(riesgo.riesgo_de_fuga),
          },
        },
      ],
      [
        {
          content: "Riesgo de Conflictividad",
          styles: { fontStyle: "bold" },
        },
        {
          content: riesgo.riesgo_de_conf,
          styles: {
            fontStyle: "bold",
            textColor: getRiskColor(riesgo.riesgo_de_conf),
          },
        },
      ],
      ["Condición", riesgo.condicion],
      ["Reevaluación", riesgo.reeval],
      ["Sexo", riesgo.sexo],
      ["Establecimiento", riesgo.establecimiento],
      ["Módulo", riesgo.modulo_ur],
      ["Pabellón", riesgo.pabellon],
      ["Condena", riesgo.condena],
      ["Grupo Delictivo", riesgo.orgCrim],
      ["Nombre;", riesgo.cualorg],
      ["Rol", riesgo.rol],
      ["Territorio", riesgo.territorio],
      ["Mapa de calor", formatUbicacionMap(riesgo.ubicacionMap)],
      ["Sociedad", riesgo.sociedad],
      ["Enemistad", riesgo.enemistad],
      ["Restricciones", riesgo.restricciones],
      ["Delitos", riesgo.electrodomesticos],
      ["Número/s de Causa/s", riesgo.numeroCausa],
      ["Observaciones", riesgo.observacion],
      ["Información Individual", riesgo.infInd],
      ["Allanamientos", riesgo.allanamientos],
      ["Secuestros", riesgo.secuestros],
      ["Atentados", riesgo.atentados],
      ["Fuerza de Seguridad", riesgo.fzaSeg],
    ],
    startY: 66,
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
        maxWidth: doc.internal.pageSize.getWidth() - 20,
        align: "justify",
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

  const fileName = `Eval. S.I.G.P.P.L.A.R. : ${riesgo.apellido} - ${riesgo.nombres} - L.P.U.:${riesgo.lpu}.pdf`;
  doc.save(fileName);

  Swal.fire("PDF generado", "El PDF se ha generado y descargado correctamente", "success");
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
