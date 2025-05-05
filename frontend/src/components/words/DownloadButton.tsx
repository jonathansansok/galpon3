// frontend/src/components/ui/buttons/DownloadButton.tsx
import React from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

interface DownloadButtonProps {
  content: any[];
  title: string;
  eventosHumanizados: { [key: string]: string }; // Añadir el mapeo de eventos humanizados
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  title,
  eventosHumanizados,
}) => {
  const handleDownload = () => {
    const paragraphs = content.map((evento, index) => {
      const tipoHumanizado =
        eventosHumanizados[evento.tipo] || evento.tipo; // Usar el mapeo humanizado

      const tipoParagraph = new Paragraph({
        children: [
          new TextRun({
            text: `Tipo: ${tipoHumanizado}`,
            bold: true,
            color: "0000FF",
            font: "Arial",
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
      });

      const fields = Object.entries(evento)
        .filter(
          ([key]) =>
            key !== "ims" &&
            key !== "rojos" &&
            key !== "email" &&
            key !== "imagenes" &&
            key !== "tipo" // Omitir ims, rojos, email, imagenes y tipo
        )
        .map(([key, value]) => {
          let formattedValue = "";
          if (typeof value === "string") {
            if (
              key.toLowerCase().includes("fecha") ||
              key.toLowerCase().includes("createdat") ||
              key.toLowerCase().includes("updatedat")
            ) {
              formattedValue = formatDate(value);
            } else {
              formattedValue = value.split(",").join(",\n");
            }
          } else if (Array.isArray(value)) {
            formattedValue = value
              .map((item) =>
                Object.entries(item)
                  .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
                  .join("\n")
              )
              .join("\n\n");
          } else if (typeof value === "object" && value !== null) {
            formattedValue = Object.entries(value)
              .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
              .join("\n");
          } else {
            formattedValue = JSON.stringify(value, null, 2);
          }

          return new Paragraph({
            children: [
              new TextRun({
                text: `${key}: `,
                bold: true,
                font: "Arial",
                size: 24,
              }),
              new TextRun({
                text: formattedValue,
                font: "Arial",
                size: 24,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
          });
        });

      return [
        tipoParagraph,
        ...fields,
        new Paragraph({ text: "", spacing: { after: 200 } }), // Add a blank line between objects
      ];
    }).flat();

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  font: "Arial",
                  size: 32,
                  color: "0000FF",
                }),
              ],
              spacing: { after: 400 },
              alignment: AlignmentType.CENTER,
            }),
            ...paragraphs,
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title}.docx`);
    });
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
    >
      Descargar en Word
    </button>
  );
};

export default DownloadButton;