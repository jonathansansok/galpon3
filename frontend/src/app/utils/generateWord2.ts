// frontend/src/app/utils/generateWord2.ts
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const generateWord2 = async (title: string, content: string): Promise<Blob> => {
  const paragraphs = content.split('\n').map(line => 
    new Paragraph({
      children: [
        new TextRun({
          text: line,
          size: 24,
          font: "Arial",
        }),
      ],
    })
  );

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
                size: 48, // Tamaño de fuente más grande
                font: "Arial", // Fuente moderna
              }),
            ],
            heading: "Title",
          }),
          ...paragraphs,
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};