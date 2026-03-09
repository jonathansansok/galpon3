// frontend/src/app/utils/useFileFields.ts
"use client";
import { useState, useCallback } from "react";
import { ModuleName, initFileStates, getUploadUrl } from "./multimediaUrl";

export const IMAGE_FIELDS = [
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

export const PDF_FIELDS = [
  "pdf1",
  "pdf2",
  "pdf3",
  "pdf4",
  "pdf5",
  "pdf6",
  "pdf7",
  "pdf8",
  "pdf9",
  "pdf10",
];

export const WORD_FIELDS = ["word1"];

export const ALL_FILE_FIELDS = [...IMAGE_FIELDS, ...PDF_FIELDS, ...WORD_FIELDS];

export function useFileFields(module: ModuleName, entity: any) {
  const [files, setFiles] = useState<Record<string, string | null>>(() =>
    initFileStates(module, entity, ALL_FILE_FIELDS)
  );

  const setFile = useCallback((field: string, value: string | null) => {
    console.log("multimedia", "setFile", {
      field,
      isDataUri: value?.startsWith("data:") ?? false,
    });
    setFiles((prev) => ({ ...prev, [field]: value }));
  }, []);

  const getFileUrl = useCallback(
    (value: string): string => {
      if (value.startsWith("data:") || value.startsWith("http")) return value;
      const url = getUploadUrl(module, value);
      return url || value;
    },
    [module]
  );

  return {
    files,
    setFile,
    getFileUrl,
    IMAGE_FIELDS,
    PDF_FIELDS,
    WORD_FIELDS,
    ALL_FILE_FIELDS,
  };
}
