/**
 * Client-side image compression utility.
 * Compresses images by resizing and adjusting JPEG quality to meet target file sizes.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0
  targetSizeKB?: number; // target max size in KB
}

/**
 * Resize a canvas to fit within maxWidth/maxHeight while maintaining aspect ratio.
 */
function resizeCanvas(
  source: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number
): HTMLCanvasElement {
  let { width, height } = source;

  if (width <= maxWidth && height <= maxHeight) {
    return source;
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, width, height);
  }
  return canvas;
}

/**
 * Get the size in bytes of a data URI string.
 */
export function dataUriSizeBytes(dataUri: string): number {
  const base64 = dataUri.split(",")[1];
  if (!base64) return 0;
  return Math.round((base64.length * 3) / 4);
}

/**
 * Format bytes to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Compress a canvas to a JPEG data URI with a target size.
 * Iteratively reduces quality until the target is met.
 */
export function compressCanvas(
  canvas: HTMLCanvasElement,
  options: CompressionOptions = {}
): string {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    targetSizeKB,
  } = options;

  const resized = resizeCanvas(canvas, maxWidth, maxHeight);

  if (!targetSizeKB) {
    return resized.toDataURL("image/jpeg", quality);
  }

  const targetBytes = targetSizeKB * 1024;
  let currentQuality = quality;
  let result = resized.toDataURL("image/jpeg", currentQuality);

  // Iteratively reduce quality to meet target size
  while (dataUriSizeBytes(result) > targetBytes && currentQuality > 0.1) {
    currentQuality -= 0.05;
    result = resized.toDataURL("image/jpeg", Math.max(currentQuality, 0.1));
  }

  return result;
}

/**
 * Compress a data URI image to a target size.
 */
export function compressDataUri(
  dataUri: string,
  options: CompressionOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(compressCanvas(canvas, options));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUri;
  });
}
