"use client";
// frontend/src/components/ui/ImageLightboxModal.tsx
import { useEffect, useState } from "react";

interface Props {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageLightboxModal({ images, initialIndex = 0, onClose }: Props) {
  const [active, setActive] = useState(initialIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      {/* Contenedor principal — detiene propagación para no cerrar al hacer click dentro */}
      <div
        className="relative flex flex-col items-center gap-3 max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Imagen activa */}
        <div className="w-full flex items-center justify-center rounded-xl overflow-hidden bg-black/40" style={{ maxHeight: "75vh" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`Imagen ${active + 1}`}
            className="max-w-full max-h-[75vh] object-contain rounded-xl"
          />
        </div>

        {/* Contador */}
        {images.length > 1 && (
          <span className="text-white/60 text-xs tabular-nums">
            {active + 1} / {images.length}
          </span>
        )}

        {/* Strip de thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-12 h-12 rounded-lg overflow-hidden ring-2 transition-all ${
                  i === active ? "ring-white scale-110" : "ring-transparent opacity-60 hover:opacity-90"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
