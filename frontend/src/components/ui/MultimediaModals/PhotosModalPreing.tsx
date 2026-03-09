'use client';
import { useState } from "react";
import ImageCropper from "@/components/ui/ImageCropper";
import Image from "next/image";
import { formatFileSize, dataUriSizeBytes } from "@/lib/imageCompression";

const IMAGE_FIELDS = [
  "imagen",
  "imagenDer",
  "imagenIz",
  "imagenDact",
  "imagenSen1",
  "imagenSen2",
  "imagenSen3",
  "imagenSen4",
  "imagenSen5",
  "imagenSen6",
];

const IMAGE_LABELS = [
  "Fotografía rostro",
  "Fotografía perfil derecho",
  "Fotografía perfil izquierdo",
  "Fotografía dactilar",
  "Señas part.-tatuajes 1",
  "Señas part.-tatuajes 2",
  "Señas part.-tatuajes 3",
  "Señas part.-tatuajes 4",
  "Señas part.-tatuajes 5",
  "Señas part.-tatuajes 6",
];

interface PhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagen: string | null;
  setImagen: (v: string | null) => void;
  imagenDer: string | null;
  setImagenDer: (v: string | null) => void;
  imagenIz: string | null;
  setImagenIz: (v: string | null) => void;
  imagenDact: string | null;
  setImagenDact: (v: string | null) => void;
  imagenSen1: string | null;
  setImagenSen1: (v: string | null) => void;
  imagenSen2: string | null;
  setImagenSen2: (v: string | null) => void;
  imagenSen3: string | null;
  setImagenSen3: (v: string | null) => void;
  imagenSen4: string | null;
  setImagenSen4: (v: string | null) => void;
  imagenSen5: string | null;
  setImagenSen5: (v: string | null) => void;
  imagenSen6: string | null;
  setImagenSen6: (v: string | null) => void;
  getImageUrl: (imagePath: string) => string;
  generateFileName: (type: string) => string;
}

const PhotosModalPreing: React.FC<PhotosModalProps> = (props) => {
  const { isOpen, onClose, getImageUrl, generateFileName } = props;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [previewField, setPreviewField] = useState<string | null>(null);

  if (!isOpen) return null;

  // Map legacy props to a unified getter/setter
  const getters: Record<string, string | null> = {
    imagen: props.imagen,
    imagenDer: props.imagenDer,
    imagenIz: props.imagenIz,
    imagenDact: props.imagenDact,
    imagenSen1: props.imagenSen1,
    imagenSen2: props.imagenSen2,
    imagenSen3: props.imagenSen3,
    imagenSen4: props.imagenSen4,
    imagenSen5: props.imagenSen5,
    imagenSen6: props.imagenSen6,
  };

  const setters: Record<string, (v: string | null) => void> = {
    imagen: props.setImagen,
    imagenDer: props.setImagenDer,
    imagenIz: props.setImagenIz,
    imagenDact: props.setImagenDact,
    imagenSen1: props.setImagenSen1,
    imagenSen2: props.setImagenSen2,
    imagenSen3: props.setImagenSen3,
    imagenSen4: props.setImagenSen4,
    imagenSen5: props.setImagenSen5,
    imagenSen6: props.setImagenSen6,
  };

  const loadedCount = IMAGE_FIELDS.filter((f) => getters[f]).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Fotografías Pre-Ingreso</h2>
            <p className="text-sm text-slate-500">
              {loadedCount} de {IMAGE_FIELDS.length} cargadas
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-[1800px] mx-auto">
          {IMAGE_FIELDS.map((field, index) => {
            const label = IMAGE_LABELS[index];
            const value = getters[field];
            const hasImage = !!value;
            const isNew = value?.startsWith("data:");

            return (
              <div
                key={field}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all overflow-hidden"
              >
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {hasImage ? (
                    <>
                      <Image
                        src={isNew ? value! : getImageUrl(value!)}
                        alt={label}
                        fill
                        className="object-cover"
                        quality={80}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditingField(field)}
                          className="w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewField(field)}
                          className="w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                          title="Ver"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        {!isNew && (
                          <a
                            href={getImageUrl(value!)}
                            download={generateFileName(label.replace(/\s+/g, "_"))}
                            className="w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                            title="Descargar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setters[field](null)}
                          className="w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        isNew ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"
                      }`}>
                        {isNew ? "Nueva" : "Guardada"}
                      </div>
                      {isNew && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white">
                          {formatFileSize(dataUriSizeBytes(value!))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField(field)}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
                    >
                      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="text-xs font-medium">Agregar</span>
                    </button>
                  )}
                </div>

                <div className="px-3 py-2.5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 truncate">{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cropper sub-modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {IMAGE_LABELS[IMAGE_FIELDS.indexOf(editingField)] || "Editar imagen"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingField(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ImageCropper
              onImageCropped={(croppedImage: string) => {
                setters[editingField](croppedImage);
                setEditingField(null);
              }}
              onCancel={() => setEditingField(null)}
            />
          </div>
        </div>
      )}

      {/* Preview sub-modal */}
      {previewField && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 cursor-pointer"
          onClick={() => setPreviewField(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewField(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-500 hover:text-rose-600 z-10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {(() => {
              const value = getters[previewField];
              if (!value) return null;
              const isNew = value.startsWith("data:");
              return (
                <Image
                  src={isNew ? value : getImageUrl(value)}
                  alt={IMAGE_LABELS[IMAGE_FIELDS.indexOf(previewField)] || "Preview"}
                  className="rounded-2xl shadow-2xl object-contain"
                  width={800}
                  height={800}
                  quality={100}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosModalPreing;
