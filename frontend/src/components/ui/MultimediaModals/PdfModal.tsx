'use client';
import { useRef, useState, useCallback } from "react";
import { PDF_FIELDS } from "@/app/utils/useFileFields";
import { downloadFile } from "@/lib/fileDownload";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string | null>;
  setFile: (field: string, value: string | null) => void;
  getFileUrl: (value: string) => string;
  originalNames?: Record<string, string>;
  setOriginalName?: (field: string, name: string) => void;
}

const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  files,
  setFile,
  getFileUrl,
  originalNames = {},
  setOriginalName,
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [deletingField, setDeletingField] = useState<string | null>(null);

  const handleFile = useCallback((field: string, file: File) => {
    if (!file.type.includes("pdf")) return;
    setOriginalName?.(field, file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("multimedia", "PdfModal upload", { field, fileName: file.name });
      setFile(field, reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [setFile, setOriginalName]);

  const onDrop = useCallback((field: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(field, file);
  }, [handleFile]);

  const onChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(field, file);
  }, [handleFile]);

  if (!isOpen) return null;

  const loadedCount = PDF_FIELDS.filter((f) => files[f]).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18H17V16H7V18M7 14H17V12H7V14M7 10H11V8H7V10M5 22C4.45 22 3.979 21.804 3.588 21.413C3.196 21.021 3 20.55 3 20V4C3 3.45 3.196 2.979 3.588 2.588C3.979 2.196 4.45 2 5 2H13L19 8V20C19 20.55 18.804 21.021 18.413 21.413C18.021 21.804 17.55 22 17 22H5ZM12 9V4H5V20H17V9H12Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Documentos PDF</h2>
            <p className="text-sm text-slate-500">{loadedCount} de {PDF_FIELDS.length} cargados</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-[1800px] mx-auto">
          {PDF_FIELDS.map((field, index) => {
            const label = `PDF ${index + 1}`;
            const value = files[field];
            const hasFile = !!value;
            const isNew = value?.startsWith("data:");
            const isDragging = dragOver === field;
            const displayName = originalNames[field] || label;

            return (
              <div key={field} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all overflow-hidden">
                <div
                  onDrop={onDrop(field)}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(field); }}
                  onDragLeave={() => setDragOver(null)}
                  className={`relative aspect-square flex flex-col items-center justify-center p-4 transition-all ${
                    isDragging ? "bg-indigo-50 border-2 border-dashed border-indigo-400"
                    : hasFile ? "bg-slate-50" : "bg-slate-50 cursor-pointer hover:bg-indigo-50/50"
                  }`}
                  onClick={() => !hasFile && fileInputRefs.current[field]?.click()}
                >
                  {hasFile ? (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 18H17V16H7V18M7 14H17V12H7V14M7 10H11V8H7V10M5 22C4.45 22 3.979 21.804 3.588 21.413C3.196 21.021 3 20.55 3 20V4C3 3.45 3.196 2.979 3.588 2.588C3.979 2.196 4.45 2 5 2H13L19 8V20C19 20.55 18.804 21.021 18.413 21.413C18.021 21.804 17.55 22 17 22H5ZM12 9V4H5V20H17V9H12Z"/>
                        </svg>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isNew ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"}`}>
                        {isNew ? "Nuevo" : "Guardado"}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRefs.current[field]?.click(); }} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-all">
                          Cambiar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = isNew ? value! : getFileUrl(value!);
                            const name = originalNames[field] || `${label}.pdf`;
                            downloadFile(url, name);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-emerald-100 hover:text-emerald-700 transition-all"
                        >
                          Descargar
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingField(field); }} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-rose-100 hover:text-rose-700 transition-all">
                          Quitar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      <span className="text-xs font-medium">Arrastrá o hacé click</span>
                      <span className="text-[10px] text-slate-300 mt-0.5">.pdf</span>
                    </div>
                  )}
                  <input ref={(el) => { fileInputRefs.current[field] = el; }} type="file" accept=".pdf" onChange={onChange(field)} className="hidden" />
                </div>
                <div className="px-3 py-2.5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 truncate" title={originalNames[field] || label}>{originalNames[field] || label}</p>
                  {originalNames[field] && <p className="text-[10px] text-slate-400 truncate">{label}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete confirmation */}
      {deletingField && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Eliminar PDF</h3>
              <p className="text-sm text-slate-500 mb-5">¿Seguro desea eliminar <span className="font-medium text-slate-700">PDF {PDF_FIELDS.indexOf(deletingField) + 1}</span>{originalNames[deletingField] ? ` (${originalNames[deletingField]})` : ""}?</p>
              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => setDeletingField(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all">Cancelar</button>
                <button type="button" onClick={() => { setFile(deletingField, null); setDeletingField(null); }} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all">Sí, eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfModal;
