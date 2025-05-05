//frontend\src\components\ui\MultimediaModals\PdfModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/Collapse";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdf1: string | null;
  setPdf1: (pdf1: string | null) => void;
  pdf2: string | null;
  setPdf2: (pdf2: string | null) => void;
  pdf3: string | null;
  setPdf3: (pdf3: string | null) => void;
  pdf4: string | null;
  setPdf4: (pdf4: string | null) => void;
  pdf5: string | null;
  setPdf5: (pdf5: string | null) => void;
  pdf6: string | null;
  setPdf6: (pdf6: string | null) => void;
  pdf7: string | null;
  setPdf7: (pdf7: string | null) => void;
  pdf8: string | null;
  setPdf8: (pdf8: string | null) => void;
  pdf9: string | null;
  setPdf9: (pdf9: string | null) => void;
  pdf10: string | null;
  setPdf10: (pdf10: string | null) => void;
  getPdfUrl: (pdfPath: string) => string;
}

const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  pdf1,
  setPdf1,
  pdf2,
  setPdf2,
  pdf3,
  setPdf3,
  pdf4,
  setPdf4,
  pdf5,
  setPdf5,
  pdf6,
  setPdf6,
  pdf7,
  setPdf7,
  pdf8,
  setPdf8,
  pdf9,
  setPdf9,
  pdf10,
  setPdf10,
  getPdfUrl,
}) => {
  const onPdfChange = (setPdf: (pdf: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPdf(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 mt-0 !m-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-screen-lg max-h-screen-lg relative flex flex-col gap-4 overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 mb-5 bg-pink-500 text-white rounded-lg"
        >
          Cerrar
        </button>
        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
         <input className="mt-2 w-1/2 py-1 ml-2" type="file"accept=".pdf" onChange={onPdfChange(setPdf1)} />
          {pdf1 && (
            <Collapse title="PDF 1">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf1)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf1)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 1
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf2)} />
          {pdf2 && (
            <Collapse title="PDF 2">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf2)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf2)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 2
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf3)} />
          {pdf3 && (
            <Collapse title="PDF 3">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf3)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf3)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 3
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf4)} />
          {pdf4 && (
            <Collapse title="PDF 4">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf4)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf4)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 4
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf5)} />
          {pdf5 && (
            <Collapse title="PDF 5">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf5)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf5)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 5
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf6)} />
          {pdf6 && (
            <Collapse title="PDF 6">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf6)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf6)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 6
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf7)} />
          {pdf7 && (
            <Collapse title="PDF 7">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf7)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf7)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 7
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf8)} />
          {pdf8 && (
            <Collapse title="PDF 8">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf8)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf8)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 8
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf9)} />
          {pdf9 && (
            <Collapse title="PDF 9">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf9)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf9)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 9
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>

        <div className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4">
            <input className="mt-2 w-1/2 py-1 ml-2" type="file" accept=".pdf" onChange={onPdfChange(setPdf10)} />
          {pdf10 && (
            <Collapse title="PDF 10">
              <div className="flex space-x-1">
                <a href={getPdfUrl(pdf10)} target="_blank" rel="noopener noreferrer"></a>
                <a href={getPdfUrl(pdf10)} target="_blank" rel="noopener noreferrer" download>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Descargar PDF 10
                  </button>
                </a>
              </div>
            </Collapse>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfModal;