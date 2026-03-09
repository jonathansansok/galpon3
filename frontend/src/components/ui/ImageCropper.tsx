'use client';
import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  compressCanvas,
  dataUriSizeBytes,
  formatFileSize,
} from "@/lib/imageCompression";

type AspectRatioOption = "1:1" | "16:9" | "libre";

interface ImageCropperProps {
  onImageCropped: (croppedImage: string) => void;
  onCancel: () => void;
  initialAspectRatio?: number;
  onFileNameCaptured?: (name: string) => void;
}

const ASPECT_RATIOS: { label: string; value: AspectRatioOption; ratio: number | undefined }[] = [
  { label: "1:1", value: "1:1", ratio: 1 },
  { label: "16:9", value: "16:9", ratio: 16 / 9 },
  { label: "Libre", value: "libre", ratio: undefined },
];

const QUALITY_PRESETS = [
  { label: "Alta", quality: 0.92, maxWidth: 1920, icon: "HQ" },
  { label: "Media", quality: 0.75, maxWidth: 1280, icon: "MQ" },
  { label: "Baja", quality: 0.5, maxWidth: 800, icon: "LQ" },
];

const ImageCropper: React.FC<ImageCropperProps> = ({
  onImageCropped,
  onCancel,
  initialAspectRatio,
  onFileNameCaptured,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(
    initialAspectRatio === 1 ? "1:1" : initialAspectRatio === 16 / 9 ? "16:9" : "libre"
  );
  const [quality, setQuality] = useState(0.85);
  const [estimatedSize, setEstimatedSize] = useState<string>("");
  const [optimizing, setOptimizing] = useState(false);
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileNameCaptured?.(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileNameCaptured?.(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [onFileNameCaptured]);

  const updateEstimatedSize = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper?.getCroppedCanvas) return;
    const canvas = cropper.getCroppedCanvas({ maxWidth: 1920, maxHeight: 1920 });
    if (!canvas) return;
    const dataUri = canvas.toDataURL("image/jpeg", quality);
    setEstimatedSize(formatFileSize(dataUriSizeBytes(dataUri)));
  }, [quality]);

  const changeAspectRatio = (option: AspectRatioOption) => {
    setAspectRatio(option);
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const found = ASPECT_RATIOS.find((a) => a.value === option);
    if (found?.ratio) {
      cropper.setAspectRatio(found.ratio);
    } else {
      cropper.setAspectRatio(NaN); // free
    }
  };

  const applyQualityPreset = (preset: typeof QUALITY_PRESETS[number]) => {
    setQuality(preset.quality);
    setTimeout(updateEstimatedSize, 100);
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper?.getCroppedCanvas) return;
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      imageSmoothingQuality: "high",
    });
    if (!canvas) return;
    const result = compressCanvas(canvas, { quality, maxWidth: 1920, maxHeight: 1920 });
    onImageCropped(result);
  };

  const optimizeToTarget = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper?.getCroppedCanvas) return;
    setOptimizing(true);
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      imageSmoothingQuality: "high",
    });
    if (!canvas) { setOptimizing(false); return; }
    const result = compressCanvas(canvas, {
      quality: 0.85,
      maxWidth: 1920,
      maxHeight: 1920,
      targetSizeKB: 950, // target < 1MB
    });
    setEstimatedSize(formatFileSize(dataUriSizeBytes(result)));
    onImageCropped(result);
    setOptimizing(false);
  };

  const currentRatio = ASPECT_RATIOS.find((a) => a.value === aspectRatio)?.ratio;

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {/* Image selection */}
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
        >
          <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="text-slate-600 font-medium">Arrastrá una imagen o hacé click para seleccionar</p>
          <p className="text-slate-400 text-sm mt-1">JPG, PNG, WEBP</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </div>
      ) : (
        <>
          {/* Aspect ratio pills */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 mr-1">Recorte:</span>
            {ASPECT_RATIOS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => changeAspectRatio(opt.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  aspectRatio === opt.value
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Cropper */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
            <Cropper
              ref={cropperRef}
              src={image}
              style={{ height: 400, width: "100%" }}
              aspectRatio={currentRatio ?? NaN}
              guides={true}
              viewMode={1}
              background={false}
              responsive={true}
              autoCropArea={0.9}
              cropend={updateEstimatedSize}
              ready={updateEstimatedSize}
            />
          </div>

          {/* Quality controls */}
          <div className="flex flex-col gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Calidad de imagen</span>
              {estimatedSize && (
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  ~{estimatedSize}
                </span>
              )}
            </div>

            {/* Quality presets */}
            <div className="flex gap-2">
              {QUALITY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyQualityPreset(preset)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                    Math.abs(quality - preset.quality) < 0.05
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-xs opacity-60">{preset.icon}</span>
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Quality slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="100"
                value={Math.round(quality * 100)}
                onChange={(e) => {
                  setQuality(Number(e.target.value) / 100);
                  setTimeout(updateEstimatedSize, 50);
                }}
                className="flex-1 h-2 rounded-full appearance-none bg-slate-200 accent-indigo-600"
              />
              <span className="text-sm text-slate-500 w-12 text-right">{Math.round(quality * 100)}%</span>
            </div>
          </div>

          {/* Change image */}
          <button
            type="button"
            onClick={() => { setImage(null); setEstimatedSize(""); }}
            className="text-sm text-slate-500 hover:text-indigo-600 transition-colors self-start"
          >
            Cambiar imagen
          </button>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={optimizeToTarget}
              disabled={optimizing}
              className="py-2.5 px-5 rounded-xl border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-50 transition-all disabled:opacity-50"
            >
              {optimizing ? "Optimizando..." : "Optimizar (<1MB)"}
            </button>
            <button
              type="button"
              onClick={getCroppedImage}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Aplicar recorte
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCropper;
