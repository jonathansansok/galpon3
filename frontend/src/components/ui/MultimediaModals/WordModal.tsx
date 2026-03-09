'use client';
import { useRef, useState, useCallback } from "react";

interface WordModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string | null>;
  setFile: (field: string, value: string | null) => void;
}

const WordModal: React.FC<WordModalProps> = ({
  isOpen,
  onClose,
  files,
  setFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("multimedia", "WordModal upload", { field: "word1" });
      setFile("word1", reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [setFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (!isOpen) return null;

  const value = files.word1;
  const hasFile = !!value;
  const isNew = value?.startsWith("data:");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13ZM7 13H9L10 16.5L11 13H13L11 19H9.5L8 15.5L6.5 19H5L7 13Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Documento Word</h2>
            <p className="text-sm text-slate-500">
              {hasFile ? "1 documento cargado" : "Sin documento"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !hasFile && fileInputRef.current?.click()}
            className={`rounded-2xl border-2 transition-all ${
              dragOver
                ? "border-indigo-400 bg-indigo-50 border-dashed"
                : hasFile
                ? "border-slate-200 bg-white"
                : "border-dashed border-slate-300 bg-white cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50"
            } p-12 flex flex-col items-center`}
          >
            {hasFile ? (
              <div className="flex flex-col items-center gap-4 w-full">
                {/* Word icon */}
                <div className="w-24 h-24 rounded-3xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13ZM7 13H9L10 16.5L11 13H13L11 19H9.5L8 15.5L6.5 19H5L7 13Z"/>
                  </svg>
                </div>

                {/* Status */}
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  isNew ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"
                }`}>
                  {isNew ? "Nuevo" : "Guardado"}
                </div>

                <p className="text-sm text-slate-500">Documento Word cargado</p>

                {/* Actions */}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-all"
                  >
                    Cambiar archivo
                  </button>
                  {value && (
                    <a
                      href={isNew ? value : undefined}
                      download={isNew ? "documento.docx" : undefined}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-emerald-100 hover:text-emerald-700 transition-all"
                    >
                      Descargar
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setFile("word1", null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-rose-100 hover:text-rose-700 transition-all"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="text-lg font-medium text-slate-500">Arrastrá un archivo o hacé click</p>
                <p className="text-sm text-slate-400 mt-1">.doc, .docx</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx"
              onChange={onChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordModal;
