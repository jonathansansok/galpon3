// components/ui/PdfRenderer.tsx
"use client";
import { useState } from 'react';

interface PdfRendererProps {
  pdfKey: string;
  pdfLabel: string;
  pdfUrl: string;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({ pdfKey, pdfLabel, pdfUrl }) => {
  const [visiblePdf, setVisiblePdf] = useState<string | null>(null);

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
          <p>Tu navegador no soporta la visualización de PDFs. Por favor, descarga el PDF para verlo: <a href={pdfUrl}>Descargar PDF</a>.</p>
        </object> 
      )}
    </>
  );
};

export default PdfRenderer;