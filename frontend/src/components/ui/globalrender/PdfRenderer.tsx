"use client";
import { useState } from "react";

interface PdfRendererProps {
  pdfKey: string;
  pdfLabel: string;
  pdfUrl: string;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({
  pdfKey,
  pdfLabel,
  pdfUrl,
}) => {
  const [visiblePdf, setVisiblePdf] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = pdfUrl.split("/").pop() || "archivo.pdf"; // Nombre del archivo
      link.click();
      window.URL.revokeObjectURL(link.href); // Liberar memoria
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setVisiblePdf(visiblePdf === pdfKey ? null : pdfKey)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg my-4 mr-2"
      >
        {visiblePdf === pdfKey ? `Ocultar ${pdfLabel}` : `Mostrar ${pdfLabel}`}
      </button>
      {visiblePdf === pdfKey && (
        <object
          data={pdfUrl}
          type="application/pdf"
          width="100%"
          height="300px"
          className="rounded-lg"
        >
          <p>
            Tu navegador no soporta la visualización de PDFs. Por favor,
            descarga el PDF para verlo:{" "}
            <button
              onClick={handleDownload}
              className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block"
            >
              Descargar PDF
            </button>
          </p>
        </object>
      )}
    </>
  );
};

export default PdfRenderer;