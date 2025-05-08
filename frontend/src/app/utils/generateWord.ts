//frontend\src\app\utils\generateWord.ts
import { Document, Packer, Paragraph, TextRun } from "docx";
import { formatUbicacionMap } from "@/app/utils/formatters";
export const generateWord = async (
  ingreso: any,
  interno: any,
  historial: any[]
): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Título principal
          new Paragraph({
            children: [
              new TextRun({
                text: "Perfil del Interno",
                bold: true,
                size: 48, // Tamaño de fuente más grande
                font: "Arial", // Fuente moderna
              }),
            ],
            heading: "Title",
          }),

          // Información básica del ingreso
          new Paragraph({
            children: [
              new TextRun({
                text: `Fecha de ingreso: ${
                  ingreso.fechaHoraIng
                    ? new Date(ingreso.fechaHoraIng).toLocaleString("es-AR", {
                        timeZone: "America/Argentina/Buenos_Aires",
                      })
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Es Alerta: ${ingreso.esAlerta ? "Sí" : "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Condición: ${ingreso.condicion || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Apellido: ${ingreso.apellido || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Nombres: ${ingreso.nombres || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Alias: ${ingreso.alias || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Tipo de Documento: ${ingreso.tipoDoc || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              ...(ingreso.docNacionalidad
                ? [
                    new TextRun({
                      text: `Nacionalidad del Documento: ${ingreso.docNacionalidad}`,
                      break: 1,
                      bold: true,
                      size: 24,
                      font: "Arial",
                    }),
                  ]
                : []),
              new TextRun({
                text: `Número de Documento: ${
                  ingreso.numeroDni || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Fecha de Nacimiento: ${
                  ingreso.fechaNacimiento
                    ? new Date(ingreso.fechaNacimiento).toLocaleDateString(
                        "es-AR",
                        { timeZone: "America/Argentina/Buenos_Aires" }
                      )
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Edad: ${ingreso.edad_ing || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Nacionalidad: ${ingreso.nacionalidad || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Provincia: ${ingreso.provincia || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Cronología de alojamientos actual:\n${ingreso.historial
                  ? ingreso.historial.split("\n").join("\n-----------------------------------------------\n")
                  : "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Domicilios: ${ingreso.domicilios || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Número/s de Causa/s: ${
                  ingreso.numeroCausa || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Procedencia: ${ingreso.procedencia || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Organización Criminal: ${
                  ingreso.orgCrim || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Delitos: ${
                  ingreso.electrodomesticos
                    ? JSON.stringify(ingreso.electrodomesticos)
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Detalles de Delitos: ${
                  ingreso.electrodomesticosDetalles || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Juzgados: ${
                  ingreso.juzgados
                    ? JSON.stringify(ingreso.juzgados)
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `LPU: ${ingreso.lpu || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Situación Procesal: ${
                  ingreso.sitProc || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Módulo - U.R.: ${ingreso.modulo_ur || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Pabellón: ${ingreso.pabellon || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Celda: ${ingreso.celda || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Ubicación en el Mapa: ${
                  ingreso.ubicacionMap || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Perfil: ${
                  ingreso.perfil ? JSON.stringify(ingreso.perfil) : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Reingreso: ${ingreso.reingreso || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Título de Información Pública: ${
                  ingreso.titInfoPublic || "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Móvil: ${ingreso.temaInf || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Resumen: ${ingreso.resumen || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Observación: ${ingreso.observacion || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Link: ${ingreso.link || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Patologías: ${
                  ingreso.patologias
                    ? JSON.stringify(ingreso.patologias)
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Tatuajes: ${
                  ingreso.tatuajes
                    ? JSON.stringify(ingreso.tatuajes)
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Cicatrices: ${
                  ingreso.cicatrices
                    ? JSON.stringify(ingreso.cicatrices)
                    : "No"
                }`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Subgrupo: ${ingreso.subGrupo || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Sexo: ${ingreso.sexo || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Sexualidad: ${ingreso.sexualidad || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Estado Civil: ${ingreso.estadoCivil || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
              new TextRun({
                text: `Profesión: ${ingreso.profesion || "No"}`,
                break: 1,
                bold: true,
                size: 24,
                font: "Arial",
              }),
            ],
          }),

          // Historial de alojamiento
          new Paragraph({
            children: [
              new TextRun({
                text: "Historial de alojamiento en S.P.F.",
                bold: true,
                size: 36,
                font: "Arial",
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          // Procesar cada egreso del historial
          ...historial.map((egreso: any, index: number) => {
            const detalles = Object.entries(egreso.datos)
              .map(
                ([key, value]) =>
                  `${key}: ${value !== undefined && value !== null ? value : "No"}`
              )
              .join("\n");

            return new Paragraph({
              children: [
                new TextRun({
                  text: `Alojamiento ${index + 1}`,
                  bold: true,
                  size: 28,
                  font: "Arial",
                }),
                new TextRun("\n"),
                new TextRun({
                  text: `Fecha de egreso: ${
                    egreso.fechaEgreso
                      ? new Date(egreso.fechaEgreso).toLocaleString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                        })
                      : "No"
                  }`,
                  break: 1,
                  bold: true,
                  size: 24,
                  font: "Arial",
                }),
                new TextRun("\n"),
                new TextRun({
                  text: detalles,
                  break: 1,
                  size: 24,
                  font: "Arial",
                }),
              ],
            });
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};