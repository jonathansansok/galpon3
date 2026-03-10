//frontend\src\app\portal\eventos\partes\new\ParteForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { createParte, updateParte, getParte } from "../Partes.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";

interface FormValues {
  nombre: string;
  abreviatura: string;
}

const floatingInputClass =
  "block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";
const floatingLabelClass =
  "absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1";

export function ParteForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, setValue, register } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      abreviatura: "",
    },
  });

  useEffect(() => {
    if (params?.id) {
      const loadParte = async () => {
        try {
          console.log("[partes] Cargando parte para editar:", params.id);
          const data = await getParte(params.id);
          if (data) {
            setValue("nombre", data.nombre || "");
            setValue("abreviatura", data.abreviatura || "");
          }
        } catch (error) {
          console.error("[partes] Error al cargar parte:", error);
        }
      };
      loadParte();
    }
  }, [params?.id, setValue]);

  const onSubmit = async (data: FormValues) => {
    console.log("[partes] Enviando formulario:", data);

    if (!data.nombre || data.nombre.trim() === "") {
      Alert.error({ title: "Error", text: "El nombre es obligatorio.", icon: "error" });
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, any> = {
      nombre: data.nombre.trim(),
      abreviatura: data.abreviatura?.trim() || null,
    };

    try {
      let result;
      if (params?.id) {
        result = await updateParte(params.id, payload);
      } else {
        result = await createParte(payload);
      }

      if (result.success) {
        await Alert.success({
          title: params?.id ? "Parte actualizada" : "Parte creada",
          text: result.message || "Operación exitosa",
          icon: "success",
        });
        router.push("/portal/eventos/partes");
      } else {
        Alert.error({
          title: "Error",
          text: result.error || "Error al guardar la parte",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("[partes] Error al enviar formulario:", error);
      Alert.error({
        title: "Error",
        text: "Error inesperado al guardar la parte",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="relative">
          <input
            type="text"
            id="nombre"
            {...register("nombre")}
            className={floatingInputClass}
            placeholder=" "
            required
          />
          <label htmlFor="nombre" className={floatingLabelClass}>
            Nombre *
          </label>
        </div>

        {/* Abreviatura */}
        <div className="relative">
          <input
            type="text"
            id="abreviatura"
            {...register("abreviatura")}
            className={floatingInputClass}
            placeholder=" "
          />
          <label htmlFor="abreviatura" className={floatingLabelClass}>
            Abreviatura
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : params?.id
            ? "Actualizar Parte"
            : "Crear Parte"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/portal/eventos/partes")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
