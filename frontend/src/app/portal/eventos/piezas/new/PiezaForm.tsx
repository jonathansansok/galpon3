//frontend\src\app\portal\eventos\piezas\new\PiezaForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { createPieza, updatePieza, getPieza } from "../Piezas.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";

interface FormValues {
  nombre: string;
  medida: string;
  detalle: string;
}

export function PiezaForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, setValue, register } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      medida: "",
      detalle: "",
    },
  });

  // Cargar pieza existente en modo edición
  useEffect(() => {
    if (params?.id) {
      const loadPieza = async () => {
        try {
          console.log("[piezas] Cargando pieza para editar:", params.id);
          const data = await getPieza(params.id);
          if (data) {
            setValue("nombre", data.nombre || "");
            setValue("medida", data.medida || "");
            setValue("detalle", data.detalle || "");
          }
        } catch (error) {
          console.error("[piezas] Error al cargar pieza:", error);
        }
      };
      loadPieza();
    }
  }, [params?.id, setValue]);

  const onSubmit = async (data: FormValues) => {
    console.log("[piezas] Enviando formulario:", data);

    if (!data.nombre || data.nombre.trim() === "") {
      Alert.error({ title: "Error", text: "El nombre es obligatorio.", icon: "error" });
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, any> = {
      nombre: data.nombre.trim(),
      medida: data.medida?.trim() || null,
      detalle: data.detalle?.trim() || null,
    };

    try {
      let result;
      if (params?.id) {
        result = await updatePieza(params.id, payload);
      } else {
        result = await createPieza(payload);
      }

      if (result.success) {
        await Alert.success({
          title: params?.id ? "Pieza actualizada" : "Pieza creada",
          text: result.message || "Operación exitosa",
          icon: "success",
        });
        router.push("/portal/eventos/piezas");
      } else {
        Alert.error({
          title: "Error",
          text: result.error || "Error al guardar la pieza",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("[piezas] Error al enviar formulario:", error);
      Alert.error({
        title: "Error",
        text: "Error inesperado al guardar la pieza",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          {...register("nombre")}
          className="border rounded px-3 py-2 w-full"
          placeholder="Nombre de la pieza"
          required
        />
      </div>

      {/* Medida */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medida
        </label>
        <input
          type="text"
          {...register("medida")}
          className="border rounded px-3 py-2 w-full"
          placeholder="Medida (opcional)"
        />
      </div>

      {/* Detalle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detalle
        </label>
        <textarea
          {...register("detalle")}
          className="border rounded px-3 py-2 w-full"
          rows={3}
          placeholder="Detalle adicional (opcional)"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : params?.id
            ? "Actualizar Pieza"
            : "Crear Pieza"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/portal/eventos/piezas")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
