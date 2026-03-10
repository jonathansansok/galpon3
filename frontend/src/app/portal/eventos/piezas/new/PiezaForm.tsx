//frontend\src\app\portal\eventos\piezas\new\PiezaForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import { createPieza, updatePieza, getPieza } from "../Piezas.api";
import { getPartes } from "../../partes/Partes.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { Parte } from "@/types/Parte";

interface FormValues {
  nombre: string;
  medida: string;
  detalle: string;
  tipo: string;
  parteId: string;
  costo: string;
  horas: string;
  costoPorPano: string;
  panos: string;
}

const floatingInputClass =
  "block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";
const floatingLabelClass =
  "absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1";

export function PiezaForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partes, setPartes] = useState<Parte[]>([]);

  const { handleSubmit, setValue, register, control } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      medida: "",
      detalle: "",
      tipo: "chapa",
      parteId: "",
      costo: "0",
      horas: "0",
      costoPorPano: "0",
      panos: "0",
    },
  });

  const tipo = useWatch({ control, name: "tipo" });

  // Cargar partes disponibles
  useEffect(() => {
    const loadPartes = async () => {
      try {
        const data = await getPartes();
        setPartes(data);
      } catch (error) {
        console.error("[piezas] Error al cargar partes:", error);
      }
    };
    loadPartes();
  }, []);

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
            setValue("tipo", data.tipo || "chapa");
            setValue("parteId", data.parteId ? String(data.parteId) : "");
            setValue("costo", String(data.costo || 0));
            setValue("horas", String(data.horas || 0));
            setValue("costoPorPano", String(data.costoPorPano || 0));
            setValue("panos", String(data.panos || 0));
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

    if (!data.tipo) {
      Alert.error({ title: "Error", text: "El tipo es obligatorio.", icon: "error" });
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, any> = {
      nombre: data.nombre.trim(),
      medida: data.medida?.trim() || null,
      detalle: data.detalle?.trim() || null,
      tipo: data.tipo,
      parteId: data.parteId ? parseInt(data.parteId) : null,
    };

    if (data.tipo === "chapa") {
      payload.costo = parseFloat(data.costo) || 0;
      payload.horas = parseFloat(data.horas) || 0;
      payload.costoPorPano = 0;
      payload.panos = 0;
    } else {
      payload.costoPorPano = parseFloat(data.costoPorPano) || 0;
      payload.panos = parseFloat(data.panos) || 0;
      payload.costo = 0;
      payload.horas = 0;
    }

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

        {/* Medida */}
        <div className="relative">
          <input
            type="text"
            id="medida"
            {...register("medida")}
            className={floatingInputClass}
            placeholder=" "
          />
          <label htmlFor="medida" className={floatingLabelClass}>
            Medida
          </label>
        </div>
      </div>

      {/* Tipo y Parte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative">
          <select
            id="tipo"
            {...register("tipo")}
            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
          >
            <option value="chapa">Chapa</option>
            <option value="pintura">Pintura</option>
          </select>
          <label htmlFor="tipo" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 start-1">
            Tipo *
          </label>
        </div>

        <div className="relative">
          <select
            id="parteId"
            {...register("parteId")}
            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
          >
            <option value="">Sin parte asignada</option>
            {partes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}{p.abreviatura ? ` (${p.abreviatura})` : ""}
              </option>
            ))}
          </select>
          <label htmlFor="parteId" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 start-1">
            Parte
          </label>
        </div>
      </div>

      {/* Campos condicionales segun tipo */}
      {tipo === "chapa" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="number"
              step="0.01"
              id="costo"
              {...register("costo")}
              className={floatingInputClass}
              placeholder=" "
            />
            <label htmlFor="costo" className={floatingLabelClass}>
              Costo
            </label>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              id="horas"
              {...register("horas")}
              className={floatingInputClass}
              placeholder=" "
            />
            <label htmlFor="horas" className={floatingLabelClass}>
              Horas
            </label>
          </div>
        </div>
      )}

      {tipo === "pintura" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="number"
              step="0.01"
              id="costoPorPano"
              {...register("costoPorPano")}
              className={floatingInputClass}
              placeholder=" "
            />
            <label htmlFor="costoPorPano" className={floatingLabelClass}>
              Costo por Paño
            </label>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              id="panos"
              {...register("panos")}
              className={floatingInputClass}
              placeholder=" "
            />
            <label htmlFor="panos" className={floatingLabelClass}>
              Paños
            </label>
          </div>
        </div>
      )}

      {/* Detalle */}
      <div className="relative">
        <textarea
          id="detalle"
          {...register("detalle")}
          className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          rows={3}
        />
        <label
          htmlFor="detalle"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[1.5rem] peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
        >
          Detalle
        </label>
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
