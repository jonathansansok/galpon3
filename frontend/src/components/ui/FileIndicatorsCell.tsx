"use client";
// frontend/src/components/ui/FileIndicatorsCell.tsx
import { useState, useRef, useEffect } from "react";
import { ModuleName, getUploadUrl } from "@/app/utils/multimediaUrl";
import { IMAGE_FIELDS, PDF_FIELDS, WORD_FIELDS } from "@/app/utils/useFileFields";
import ImageLightboxModal from "./ImageLightboxModal";

interface Props {
  module: ModuleName;
  row: any;
}

function getUrls(module: ModuleName, row: any, fields: string[]): string[] {
  return fields
    .map((f) => (row[f] ? getUploadUrl(module, row[f]) : null))
    .filter(Boolean) as string[];
}

export default function FileIndicatorsCell({ module, row }: Props) {
  const imageUrls = getUrls(module, row, IMAGE_FIELDS);
  const pdfUrls = getUrls(module, row, PDF_FIELDS);
  const wordUrls = getUrls(module, row, WORD_FIELDS);

  const [showModal, setShowModal] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const pdfMenuRef = useRef<HTMLDivElement>(null);

  const hasAny = imageUrls.length > 0 || pdfUrls.length > 0 || wordUrls.length > 0;

  // Cerrar menú PDF al clickear fuera
  useEffect(() => {
    if (!showPdfMenu) return;
    const handler = (e: MouseEvent) => {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(e.target as Node)) {
        setShowPdfMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPdfMenu]);

  if (!hasAny) {
    return <span className="text-gray-200 text-xs select-none">—</span>;
  }

  return (
    <>
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>

        {/* Bloque imágenes */}
        {imageUrls.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            title={`${imageUrls.length} imagen${imageUrls.length > 1 ? "es" : ""}`}
            className="relative flex-shrink-0 rounded-md overflow-visible"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrls[0]}
              alt="foto"
              className="w-7 h-7 rounded-md object-cover ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
            />
            {imageUrls.length > 1 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center leading-none shadow">
                {imageUrls.length}
              </span>
            )}
          </button>
        )}

        {/* Bloque PDFs */}
        {pdfUrls.length > 0 && (
          <div ref={pdfMenuRef} className="relative flex-shrink-0">
            <button
              onClick={() => {
                if (pdfUrls.length === 1) {
                  window.open(pdfUrls[0], "_blank", "noopener,noreferrer");
                } else {
                  setShowPdfMenu((v) => !v);
                }
              }}
              title={`${pdfUrls.length} PDF${pdfUrls.length > 1 ? "s" : ""}`}
              className="relative inline-flex items-center justify-center w-7 h-7 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0-6a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
              </svg>
              {pdfUrls.length > 1 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none shadow">
                  {pdfUrls.length}
                </span>
              )}
            </button>

            {/* Menú desplegable con lista de PDFs */}
            {showPdfMenu && (
              <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[110px]">
                {pdfUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPdfMenu(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-red-400 flex-shrink-0">
                      <path fillRule="evenodd" d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Z" clipRule="evenodd" />
                    </svg>
                    PDF {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bloque Word */}
        {wordUrls.length > 0 && (
          <a
            href={wordUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            title="Documento Word"
            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5ZM6 9.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 6 9.75Zm.75 2.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>

      {/* Modal lightbox de imágenes */}
      {showModal && (
        <ImageLightboxModal
          images={imageUrls}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
