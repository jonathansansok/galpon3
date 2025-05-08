//frontend\src\app\utils\pdf2.tsx
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { CellHookData } from "jspdf-autotable";
import {
  formatDateTime,
  formatDateTime2,
  HandleMine2,
  formatPatologias,
  formatTatuajes,
  formatDomicilios,
  formatUbicacionMapa,
  formatReingresos,
  loadImage,
} from "./pdfUtils";
import { formatUbicacionMap } from "@/app/utils/formatters";
const handleUndefined = (value: any): string => {
  if (!value || value === "Invalid Date") return "No definido";
  return value;
};
const generatePDF = async (
  ingreso: any,
  imagen: string | null,
  historial: { fechaEgreso: string; datos: Record<string, any> }[]
) => {
  console.log("Datos recibidos en generatePDF:");
  console.log("Ingreso:", ingreso);
  console.log("Imagen:", imagen);
  console.log("Historial:", historial);

  const doc = new jsPDF();
  // Verificar el contenido de ingreso.electrodomesticos
  console.log(
    "Electrodomésticos antes de procesar:",
    ingreso.electrodomesticos
  );

  // Validar y transformar los electrodomésticos
  const electrodomesticosString = Array.isArray(ingreso.electrodomesticos)
    ? ingreso.electrodomesticos.join(", ")
    : ingreso.electrodomesticos || "No especificado";

  console.log("Electrodomésticos procesados:", electrodomesticosString);

  // Añadir logo
  const logo = new Image();
  logo.src = "/images/membrete.png"; // Cambia esta ruta a la ruta de tu logo

  // Asegurar que las imágenes se carguen antes de agregarlas al PDF
  const logoImage = await loadImage(logo.src);

  // Ajustar tamaño del logo
  const logoWidth = 38;
  const logoHeight = 20;
  doc.addImage(logoImage, "PNG", 15, 7, logoWidth, logoHeight);

  // Determinar el título basado en el valor de esAlerta
  const esAlertaString = ingreso.esAlerta === "Si" ? "Sí" : "No"; // Transformar a cadena de texto
  const tituloPDF =
    esAlertaString === "Sí"
      ? "R.A.P. - Alerta de ingreso"
      : "Informe de ingreso";

  // Añadir título
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0);
  doc.text(tituloPDF, 68, 40);

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
  // Definir el tipo de camposPermitidos

  const camposPermitidos: Record<string, string> = {
    apellido: "Apellido",
    nombres: " ----- Nombres",
    alias: " ----- Alias",
    tipoDoc: "----- Tipo Doc.",
    numeroDni: "----- Numero Doc.",
    lpu: " ----- L.P.U.",
    lpuProv: " ----- Lpu Prov.",
    edadIng: " ----- Edad ing.",
    fechaHoraIng: " ----- Fecha ing.",
    perfil: " ----- Perfil",
    esAlerta: " ----- ¿Fue alerta?",
    establecimiento: " ----- Establecimiento",
  };

  // Procesar historialEgresos
  const totalReingresos = historial.length;
  const historialString =
    historial.length > 0
      ? `Total: ${totalReingresos}\n\n` +
        historial
          .map((egreso: any, index: number) => {
            const fechaEgreso = formatDateTime(egreso.fechaEgreso).split(
              " "
            )[0]; // Solo la fecha
            const detalles = Object.entries(egreso.datos || {})
              .filter(([key, value]) => {
                // Filtrar campos permitidos y excluir valores vacíos o no significativos
                if (!camposPermitidos[key]) return false;
                if (
                  key === "perfil" &&
                  Array.isArray(value) &&
                  value.length === 0
                )
                  return false; // Excluir Perfil si es []
                if (value === undefined || value === null || value === "")
                  return false;
                return true;
              })
              .map(([key, value]) => {
                const humanizedKey = camposPermitidos[key]; // Usar el nombre personalizado
                const formattedValue =
                  typeof value === "string" &&
                  value.match(/^\d{4}-\d{2}-\d{2}T/)
                    ? formatDateTime(value).split(" ")[0] // Solo la fecha
                    : value;
                return `${humanizedKey}: ${formattedValue}`;
              })
              .join(", ");
            return `Egreso Nº ${
              index + 1
            } : ${fechaEgreso}:\n${detalles}\n\n`; // Salto de línea entre egresos
          })
          .join("")
      : "Sin reingresos";

  console.log("Historial formateado para el PDF:", historialString);

  // Añadir tabla con los datos del historial
  (doc as any).autoTable({
    head: [["Campo", "Valor"]],
    body: historial.map((egreso, index) => {
      const fechaEgreso = formatDateTime(egreso.fechaEgreso).split(" ")[0]; // Solo la fecha
      const detalles = Object.entries(egreso.datos || {})
        .filter(([key, value]) => {
          // Filtrar campos permitidos y excluir valores vacíos o no significativos
          if (!camposPermitidos[key]) return false;
          if (key === "perfil" && Array.isArray(value) && value.length === 0)
            return false; // Excluir Perfil si es []
          if (value === undefined || value === null || value === "")
            return false;
          return true;
        })
        .map(([key, value]) => {
          const humanizedKey = camposPermitidos[key]; // Usar el nombre personalizado
          const formattedValue =
            typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)
              ? formatDateTime(value).split(" ")[0] // Solo la fecha
              : value;
          return [`${humanizedKey}`, `${formattedValue}`];
        });
      return [
        `Egreso ${index + 1} en fecha: ${fechaEgreso}`,
        detalles.map(([k, v]) => `${k}: ${v}`).join(", "),
      ];
    }),
    startY: 63, // Ajusta la posición de inicio de la tabla
    styles: {
      fontSize: 11,
      cellPadding: 3,
      overflow: "linebreak",
      halign: "left",
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 }, // Negrita para los nombres de los campos
      1: { fontStyle: "normal", cellWidth: 140, halign: "left" }, // Normal para los valores
    },
  });

  // Añadir tabla con los datos del historial
  (doc as any).autoTable({
    head: [["Campo", "Valor"]],
    body: historial.map((egreso, index) => {
      const fechaEgreso = formatDateTime(egreso.fechaEgreso).split(" ")[0]; // Solo la fecha
      const detalles = Object.entries(egreso.datos || {})
        .filter(([key, value]) => {
          // Filtrar campos permitidos y excluir valores vacíos o no significativos
          if (!camposPermitidos[key]) return false;
          if (Array.isArray(value) && value.length === 0) return false; // Excluir arrays vacíos
          if (value === undefined || value === null || value === "")
            return false;
          return true;
        })
        .map(([key, value]) => {
          const humanizedKey = camposPermitidos[key]; // Usar el nombre personalizado
          const formattedValue =
            typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)
              ? formatDateTime(value).split(" ")[0] // Solo la fecha
              : value;
          return [`${humanizedKey}`, `${formattedValue}`];
        });
      return [
        `Egreso ${index + 1} en fecha: ${fechaEgreso}`,
        detalles.map(([k, v]) => `${k}: ${v}`).join(", "),
      ];
    }),
    startY: 63, // Ajusta la posición de inicio de la tabla
    styles: {
      fontSize: 11,
      cellPadding: 3,
      overflow: "linebreak",
      halign: "justify",
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 }, // Negrita para los nombres de los campos
      1: { fontStyle: "normal", cellWidth: 140, halign: "justify" }, // Normal para los valores
    },
  });

  doc.setFontSize(0.2); // Tamaño de la microletra extremadamente pequeño
  doc.setTextColor(150); // Color de la microletra
  doc.text(`pftgtiroepqfgjtu`, 30, 50);
  doc.text(`pftgtiroepqfgjtu`, 30, 70);

  const perfilesString = ingreso.perfil
    ? JSON.parse(ingreso.perfil)
        .map((p: { option: string }) => p.option)
        .join(", ")
    : "NO ESPECIFICADO";
  const { count: reingresosCount, formatted: reingresosString } =
    formatReingresos(ingreso.internosinvolucrado);
  const patologiasString = formatPatologias(ingreso.patologias);
  const tatuajesString = formatTatuajes(ingreso.tatuajes);
  const domiciliosString = formatDomicilios(ingreso.domicilios);
  const ubicacionMapaString = formatUbicacionMapa(ingreso.ubicacionMap);

  let finalY = 0;

  // Añadir tabla con los datos del formulario
  (doc as any).autoTable({
    head: [["Campo", "Valor"]],
    body: [
      ["¿Es Alerta?", esAlertaString], // Usar esAlertaString aquí
      ["Apellido/s", ingreso.apellido],
      ["Nombre/s", ingreso.nombres],
      ["Tipo de Documento", ingreso.tipoDoc],
      ...(ingreso.docNacionalidad
        ? [["Nacionalidad del Documento", ingreso.docNacionalidad]]
        : []), // Agregar solo si docNacionalidad está presente
      ["Número de Documento", ingreso.numeroDni],
      ["L.P.U", ingreso.lpu],
      ["Situación Procesal", ingreso.sitProc],
      ["L.P.U Prov.", ingreso.lpuProv],
      ["Unidad de Ingreso", ingreso.unidadDeIngreso],
      ["Fecha de Ingreso", formatDateTime2(ingreso.fechaHoraIng)], // Formatea la fecha y hora
      ["Fecha de Nacimiento", formatDateTime2(ingreso.fechaNacimiento)], // Formatea la fecha y hora
      ["Edad", ingreso.edad_ing], // Asegúrate de usar "edad_ing"
      ["Alias", ingreso.alias],
      ["Establecimiento asignado", ingreso.establecimiento],
      ["Condición", ingreso.condicion], // Usar esAlertaString aquí
      ["Historial de reingresos", historialString],
      ["Sexo", ingreso.sexo],
      ["G. sanguíneo", ingreso.subGrupo],
      ["Sexualidad", ingreso.sexualidad],
      ["Estado Civil", ingreso.estadoCivil],
      ["Domicilios", domiciliosString], // Usar domiciliosString aquí
      ["Juzgados", ingreso.juzgados],
      ["Número/s de Causa/s", ingreso.numeroCausa],
      ["Organización Criminal", ingreso.orgCrim],
      ["Nombre Org. Crim.", ingreso.cualorg],
      ["Delitos", electrodomesticosString], // Mostrar los electrodomésticos procesados
      ["Nacionalidad", ingreso.nacionalidad],
      ["Provincia", ingreso.provincia],
      ["Mapa de calor", formatUbicacionMap(ingreso.ubicacionMap)],
      ["Patologías", patologiasString],
      ["Cicatrices", ingreso.cicatrices],
      ["Tatuajes", tatuajesString],
      ["Perfil", perfilesString], // Usar perfilesString aquí
      ["Profesión", ingreso.profesion],
      ["Título de Información Pública", ingreso.titInfoPublic],
      ["Observaciones", ingreso.observacion],
      ["Móvil", ingreso.temaInf],
      ["Resumen", ingreso.resumen],
      ["Link", ingreso.link],
    ],
    startY: 63, // Ajusta la posición de inicio de la tabla (bajado 2 cm)
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
    didDrawCell: function (data: CellHookData) {
      if (data.column.index === 1 && data.row.index === 20) {
        // Ubicación en el Mapa
        data.cell.styles.halign = "left";
      }
    },
    didDrawPage: function (data: any) {
      finalY = data.cursor.y; // Obtener la posición Y final de la tabla

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
        align: "justify",
        maxWidth: doc.internal.pageSize.getWidth() - 20,
      });
    },
    margin: { bottom: 35 }, // Dejar espacio para el epígrafe
  });

  // Añadir la imagen de cuerpo.png al final del PDF
  const cuerpoImage = await loadImage("/images/cuerpo.png");
  const cuerpoImageWidth = 105.8; // 8 cm en puntos
  const cuerpoImageHeight = 105.8; // 8 cm en puntos
  const cuerpoImageX =
    (doc.internal.pageSize.getWidth() - cuerpoImageWidth) / 2; // Centrar la imagen horizontalmente
  let cuerpoImageY = finalY + 10; // Ajusta la posición Y para que esté debajo de la tabla

  // Verificar si hay suficiente espacio para la imagen y la tabla
  const espacioDisponible =
    doc.internal.pageSize.getHeight() - cuerpoImageY - cuerpoImageHeight - 35; // 35 es el margen inferior
  if (espacioDisponible < 50) {
    // Si no hay suficiente espacio, agregar una nueva página
    doc.addPage();
    cuerpoImageY = 20; // Reiniciar la posición Y para la nueva página
  }

  doc.addImage(
    cuerpoImage,
    "PNG",
    cuerpoImageX,
    cuerpoImageY,
    cuerpoImageWidth,
    cuerpoImageHeight
  );

  // Añadir tabla con los headers "Cicatrices" y "Tatuajes" debajo de la imagen
  const cicatricesTatuajesY = cuerpoImageY + cuerpoImageHeight + 10; // Ajusta la posición Y para que esté debajo de la imagen
  (doc as any).autoTable({
    head: [["Cicatrices", "Tatuajes"]],
    body: [
      [
        ingreso.cicatrices || "No especificado",
        tatuajesString || "No especificado",
      ],
    ],
    startY: cicatricesTatuajesY,
    styles: {
      fontSize: 11,
      cellPadding: 3,
      overflow: "linebreak",
      halign: "left", // Cambiar a 'left' para alinear a la izquierda
    },
    columnStyles: {
      0: { cellWidth: 90.8, halign: "left" }, // Cambiar a 'left' para alinear a la izquierda
      1: { cellWidth: 90.8, halign: "left" }, // Cambiar a 'left' para alinear a la izquierda
    },
    margin: { right: 15 }, // Ajusta el margen derecho para dejar espacio antes del extremo lateral derecho
    didDrawCell: function (data: CellHookData) {
      if (data.column.index === 0) {
        const doc = data.doc;
        const { cell, cursor } = data;
        const x = cell.x + cell.width;
        const y = cell.y;
        const height = cell.height;
        doc.setDrawColor(150); // Color de la línea
        doc.setLineWidth(0.5); // Ancho de la línea
        doc.line(x, y, x, y + height); // Dibuja la línea vertical
      }
    },
  });

  // Añadir microletra
  doc.setFontSize(0.1); // Tamaño de la microletra extremadamente pequeño
  doc.setTextColor(150); // Color de la microletra
  doc.text(`pftgtiroepqfgjtu`, 10, doc.internal.pageSize.getHeight() - 5);

  // Guardar el PDF con un nombre específico
  const fileName =
    esAlertaString === "Sí"
      ? `R.A.P. Alerta de ingreso: ${ingreso.apellido} - ${ingreso.nombres} - ${ingreso.establecimiento}.pdf`
      : `Informe de ingreso: ${ingreso.apellido} - ${ingreso.nombres} - ${ingreso.establecimiento}.pdf`;
  doc.save(fileName);

  Swal.fire(
    "PDF generado",
    "El PDF se ha generado y descargado correctamente",
    "success"
  );
};

export default generatePDF;
