"use client";
import { Button } from "@/components/ui/button";
import {
  validateRequiredFields,
  validateEmptyFields,
} from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createMovil, updateMovil } from "../Moviles.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState } from "react";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";

interface FormValues {
  patente: string;
  marca: string;
  modelo: string;
  anio: string; // Se recibe como string desde el formulario
  color: string;
  tipoPintura: string;
  paisOrigen: string;
  tipoVehic: string;
  motor: string;
  chasis: string;
  combustion: string;
  vin: string;
}

export function MovilForm({ movil }: { movil: any }) {
  const { handleSubmit, setValue, register } = useForm<FormValues>({
    defaultValues: {
      patente: movil?.patente || "",
      marca: movil?.marca || "",
      modelo: movil?.modelo || "",
      anio: movil?.anio?.toString() || "", // Convertir a string para el formulario
      color: movil?.color || "",
      tipoPintura: movil?.tipoPintura || "",
      paisOrigen: movil?.paisOrigen || "",
      tipoVehic: movil?.tipoVehic || "",
      motor: movil?.motor || "",
      chasis: movil?.chasis || "",
      combustion: movil?.combustion || "",
      vin: movil?.vin || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("[SUBMIT] Datos originales:", data);

    // Validar campos obligatorios y vacíos
    const missingFields = validateRequiredFields(data, requiredFields, fieldLabels);
    const emptyFields = validateEmptyFields(data, fieldLabels, excludedFields);

    if (missingFields.length > 0) {
      Alert.error({
        title: "Error",
        text: `Faltan campos obligatorios: ${missingFields.join(" - ")}.`,
      });
      return;
    }

    if (emptyFields.length > 0) {
      const confirmation = await Alert.confirm({
        title: "Advertencia",
        text: `Hay campos vacíos: ${emptyFields.join(" - ")}. ¿Deseas continuar?`,
        icon: "warning",
      });

      if (!confirmation.isConfirmed) {
        console.log("[SUBMIT] El usuario decidió no continuar debido a campos vacíos.");
        return;
      }
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el formulario?",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      console.log("[SUBMIT] El usuario canceló la confirmación.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar los datos para enviar
      const payload = {
        ...data,
        anio: parseInt(data.anio, 10), // Convertir a número entero
      };

      console.log("[SUBMIT] Datos procesados para enviar:", payload);

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value.toString()); // Convertir todos los valores a string
      });

      console.log("[SUBMIT] FormData inicial:", Array.from(formData.entries()));

      // Procesar archivos multimedia
      const processFile = async (
        file: string | null,
        key: string,
        extension: string
      ) => {
        if (file && file.startsWith("data:")) {
          const uniqueFileName = `${key}-${Date.now()}-${Math.floor(
            Math.random() * 1000000
          )}.${extension}`;
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("files", blob, uniqueFileName);
          formData.append(key, uniqueFileName);
          console.log(`[SUBMIT] Archivo procesado: ${key} -> ${uniqueFileName}`);
        }
      };

      await Promise.all([
        processFile(imagen, "imagen", "png"),
        processFile(imagenDer, "imagenDer", "png"),
        processFile(imagenIz, "imagenIz", "png"),
        processFile(imagenDact, "imagenDact", "png"),
        processFile(imagenSen1, "imagenSen1", "png"),
        processFile(imagenSen2, "imagenSen2", "png"),
        processFile(imagenSen3, "imagenSen3", "png"),
        processFile(imagenSen4, "imagenSen4", "png"),
        processFile(imagenSen5, "imagenSen5", "png"),
        processFile(imagenSen6, "imagenSen6", "png"),
        processFile(pdf1, "pdf1", "pdf"),
        processFile(pdf2, "pdf2", "pdf"),
        processFile(pdf3, "pdf3", "pdf"),
        processFile(pdf4, "pdf4", "pdf"),
        processFile(pdf5, "pdf5", "pdf"),
        processFile(pdf6, "pdf6", "pdf"),
        processFile(pdf7, "pdf7", "pdf"),
        processFile(pdf8, "pdf8", "pdf"),
        processFile(pdf9, "pdf9", "pdf"),
        processFile(pdf10, "pdf10", "pdf"),
        processFile(word1, "word1", "docx"),
      ]);

      console.log("[SUBMIT] FormData final con archivos:", Array.from(formData.entries()));

      // Enviar los datos al backend
      let response;
      if (params?.id) {
        response = await updateMovil(params.id, formData);
        console.log("[SUBMIT] Respuesta del backend (update):", response);
      } else {
        response = await createMovil(formData);
        console.log("[SUBMIT] Respuesta del backend (create):", response);
      }

      if (response.success) {
        Alert.success({
          title: "Éxito",
          text: params?.id
            ? "Móvil actualizado correctamente"
            : "Móvil creado correctamente",
        });
        router.push("/portal/eventos/moviles");
      } else {
        console.error("[SUBMIT] Error en la respuesta del backend:", response.error);
        Alert.error({
          title: "Error",
          text: response.error || "Ocurrió un error al guardar el móvil.",
        });
      }
    } catch (error) {
      console.error("[SUBMIT] Error al guardar el móvil:", error);
      Alert.error({
        title: "Error",
        text: "Ocurrió un error al guardar el móvil. Intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="formulario"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <WatermarkBackground setBackgroundImage={() => {}} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.keys(fieldLabels).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium">
              {fieldLabels[field]}
            </label>
            <input
              {...register(field as keyof FormValues, {
                required: `${fieldLabels[field]} es obligatorio`,
              })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={() => router.push("/portal/eventos/moviles")}
          className="bg-gray-500"
        >
          Volver
        </Button>
        <Button type="submit" className="bg-blue-500" disabled={isSubmitting}>
          {isSubmitting
            ? params?.id
              ? "Actualizando..."
              : "Creando..."
            : params?.id
            ? "Actualizar"
            : "Crear"}
        </Button>
      </div>
    </form>
  );
}