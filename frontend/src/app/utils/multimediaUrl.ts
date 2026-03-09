// frontend/src/app/utils/multimediaUrl.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type ModuleName = "temas" | "ingresos" | "presupuestos";

/**
 * Build a full URL to a file stored on the backend.
 * Returns null if filename is falsy.
 */
export function getUploadUrl(
  module: ModuleName,
  filename: string | null | undefined
): string | null {
  if (!filename) return null;
  const url = `${BACKEND_URL}/${module}/uploads/${filename}`;
  console.log("multimedia", "getUploadUrl", { module, filename, url });
  return url;
}

/**
 * Initialize a map of file field states from entity data.
 * Replaces the 21 repeated useState initializers.
 */
export function initFileStates(
  module: ModuleName,
  entity: Record<string, any> | null | undefined,
  fieldNames: string[]
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const field of fieldNames) {
    result[field] = entity?.[field] ? getUploadUrl(module, entity[field]) : null;
  }
  const activeFields = Object.keys(result).filter((k) => result[k] !== null);
  console.log("multimedia", "initFileStates", { module, activeFields });
  return result;
}
