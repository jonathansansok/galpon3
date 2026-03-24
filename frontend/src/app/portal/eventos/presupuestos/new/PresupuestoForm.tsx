//frontend\src\app\portal\eventos\presupuestos\new\PresupuestoForm.tsx
"use client";
import { usePresupuestoStore } from "@/lib/store"; // Importar el store de Zustand
import { useRepairStore } from "@/lib/repairStore";
import { InputField } from "@/components/ui/InputField";
import { useUserStore } from "@/lib/store"; // Importar el store de Zustand
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createPresupuesto, updatePresupuesto, getPresupuestoClienteTelefono } from "../Presupuestos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect, useCallback } from "react";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import { useFileFields, ALL_FILE_FIELDS } from "@/app/utils/useFileFields";
import ChapaYPinturaPage from "@/components/ui/ChapaYPinturaPage";
import { ChapaRow } from "@/components/ui/ChapaTable";
import { PinturaRow } from "@/components/ui/PinturaTable";
import PreciosCyP from "@/components/ui/PreciosCyP";
import TipoTrabajoSelect from "@/components/ui/TipoTrabajoSelect";
import MagnitudDanioCheckbox from "@/components/ui/MagnitudDanioCheckbox";

import {
  ShowPresupuestos,
  showCancelAlert,
} from "../../../../utils/alertUtils"; // Importa las funciones
import { validateAndNotify, clearFieldErrors, handleBackendErrors } from "../../../../utils/formValidation";

interface FormValues {
  [key: string]: string;
}

export function PresupuestoForm({ presupuesto, onSuccess, editId }: { presupuesto: any; onSuccess?: () => void; editId?: number }) {
  const clienteData = usePresupuestoStore((state) => state.clienteData);
  const selectedCliente = useRepairStore((s) => s.selectedCliente);

  useEffect(() => {
    console.log(
      "[DEBUG] Datos del cliente obtenidos desde Zustand:",
      clienteData
    );
  }, [clienteData]);
  const params = useParams<{ id: string }>(); // Declarar params antes de usarlo
  const effectiveId = editId ? String(editId) : params?.id;
  const idMovil = usePresupuestoStore((state) => state.idMovil); // Declarar idMovil antes de usarlo
  const patente = usePresupuestoStore((state) => state.patente); // Declarar patente antes de usarlo

  // Calcular los valores dinámicamente
  const movilId = effectiveId
    ? presupuesto?.movilId || idMovil || ""
    : idMovil || "";

  const patenteValue = effectiveId
    ? presupuesto?.patente || patente || ""
    : patente || "";
  console.log("[DEBUG] Valor de patente desde Zustand:", patente);
  console.log("[DEBUG] Valor calculado de patenteValue:", patenteValue);

  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      movilId, // Usar el valor calculado dinámicamente
      patente: patenteValue, // Usar el valor calculado dinámicamente
      monto: presupuesto?.monto || "",
      estado: presupuesto?.estado || "Pendiente",
      observaciones: presupuesto?.observaciones || "",
      imagen: presupuesto?.imagen || "",
      imagenDer: presupuesto?.imagenDer || "",
      imagenIz: presupuesto?.imagenIz || "",
      imagenDact: presupuesto?.imagenDact || "",
      imagenSen1: presupuesto?.imagenSen1 || "",
      imagenSen2: presupuesto?.imagenSen2 || "",
      imagenSen3: presupuesto?.imagenSen3 || "",
      imagenSen4: presupuesto?.imagenSen4 || "",
      imagenSen5: presupuesto?.imagenSen5 || "",
      imagenSen6: presupuesto?.imagenSen6 || "",
      pdf1: presupuesto?.pdf1 || "",
      pdf2: presupuesto?.pdf2 || "",
      pdf3: presupuesto?.pdf3 || "",
      pdf4: presupuesto?.pdf4 || "",
      pdf5: presupuesto?.pdf5 || "",
      pdf6: presupuesto?.pdf6 || "",
      pdf7: presupuesto?.pdf7 || "",
      pdf8: presupuesto?.pdf8 || "",
      pdf9: presupuesto?.pdf9 || "",
      pdf10: presupuesto?.pdf10 || "",
      word1: presupuesto?.word1 || "",
    },
  });
  console.log("[DEBUG] Valor de data.patente antes de enviar:", patenteValue);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tipoTrabajo, setTipoTrabajo] = useState<string>(presupuesto?.tipoTrabajo || "Siniestro");
  const [chapaRows, setChapaRows] = useState<ChapaRow[]>(() => {
    try { return presupuesto?.chapaRows ? JSON.parse(presupuesto.chapaRows) : []; }
    catch { return []; }
  });
  const [pinturaRows, setPinturaRows] = useState<PinturaRow[]>(() => {
    try { return presupuesto?.pinturaRows ? JSON.parse(presupuesto.pinturaRows) : []; }
    catch { return []; }
  });

  const calculateDiasPanos = (horas: number): number => {
    return Math.floor(horas / 4) + (horas % 4 >= 2 ? 0.5 : 0);
  };

  interface PreciosSection { costo: number; horas: number; diasPanos: number; materiales: string; }
  interface PreciosData { chapa: PreciosSection; pintura: PreciosSection; }
  const defaultPrecios: PreciosData = { chapa: { costo: 0, horas: 0, diasPanos: 0, materiales: "" }, pintura: { costo: 0, horas: 0, diasPanos: 0, materiales: "" } };
  const [preciosData, setPreciosData] = useState<PreciosData>(() => {
    try { return presupuesto?.preciosCyP ? JSON.parse(presupuesto.preciosCyP) : defaultPrecios; }
    catch { return defaultPrecios; }
  });
  const [manualOverride, setManualOverride] = useState(!!presupuesto?.preciosCyP);

  const calcularPrecios = useCallback(() => {
    const totalHorasChapa = chapaRows.reduce((sum, r) => sum + r.horas, 0);
    const totalHorasPintura = pinturaRows.reduce((sum, r) => sum + r.horas, 0);
    setPreciosData((prev) => ({
      chapa: {
        costo: chapaRows.reduce((sum, r) => sum + r.costo, 0),
        horas: totalHorasChapa,
        diasPanos: calculateDiasPanos(totalHorasChapa),
        materiales: prev.chapa.materiales,
      },
      pintura: {
        costo: pinturaRows.reduce((sum, r) => sum + r.costo, 0),
        horas: totalHorasPintura,
        diasPanos: totalHorasPintura / 6,
        materiales: prev.pintura.materiales,
      },
    }));
  }, [chapaRows, pinturaRows]);

  // Auto-calcular cuando cambian las filas de Chapa/Pintura (solo si no hay override manual)
  useEffect(() => {
    if (!manualOverride) {
      calcularPrecios();
    }
  }, [calcularPrecios, manualOverride]);

  const handlePreciosFieldChange = (row: "chapa" | "pintura", field: string, value: number | string) => {
    setManualOverride(true);
    setPreciosData((prev) => ({
      ...prev,
      [row]: { ...prev[row], [field]: value },
    }));
  };

  const handlePreciosReset = () => {
    setManualOverride(false);
    calcularPrecios();
  };
  // Estado para los checkboxes "Magnitud del Daño"
  const [magnitudDanio, setMagnitudDanio] = useState<string[]>(() => {
    try { return presupuesto?.magnitudDanio ? JSON.parse(presupuesto.magnitudDanio) : []; }
    catch { return []; }
  });
  const { files, setFile, getFileUrl } = useFileFields("presupuestos", presupuesto);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isWordOpen, setIsWordOpen] = useState(false);

  useEffect(() => {
    console.log(`ID del móvil recuperado: ${idMovil}`);
    console.log(`Patente recuperada: ${patente}`);
  }, [idMovil, patente]);

  const presupuestoValidationRules = {
    monto: { required: true, label: "Monto" },
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Validar con toast + scroll + red borders
    clearFieldErrors();
    const { valid } = validateAndNotify(data, presupuestoValidationRules);
    if (!valid) return;

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el formulario?",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    setIsSubmitting(true);

    const payload: any = {
        movilId: data.movilId,
        patente: data.patente,
        monto: data.monto,
        estado: data.estado || "Pendiente",
        observaciones: data.observaciones || "",
        tipoTrabajo,
        magnitudDanio: JSON.stringify(magnitudDanio),
        chapaRows: JSON.stringify(chapaRows),
        pinturaRows: JSON.stringify(pinturaRows),
        preciosCyP: JSON.stringify(preciosData),
      };

      console.log("[DEBUG] Payload enviado al backend:", payload);

      const formData = new FormData();
      for (const key in payload) {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== "") {
          formData.append(key, payload[key]);
        }
      }

      // Procesar imágenes y archivos
      const processFile = async (
        file: string | null,
        key: string,
        extension: string
      ) => {
        if (file && file.startsWith("data:")) {
          const uniqueFileName = `${key}-${Date.now()}-${Math.floor(
            Math.random() * 1000000
          )}.${extension}`;
          console.log("multimedia", "processFile", { key, extension, uniqueFileName });
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("files", blob, uniqueFileName);
          formData.append(key, uniqueFileName);
        }
      };

      const fileCount = ALL_FILE_FIELDS.filter((f) => files[f]?.startsWith("data:")).length;
      console.log("multimedia", "PresupuestoForm submit", { fileCount });

      await Promise.all(
        ALL_FILE_FIELDS.map((field) => {
          const ext = field.startsWith("pdf") ? "pdf" : field.startsWith("word") ? "docx" : "png";
          return processFile(files[field], field, ext);
        })
      );

      try {
        let response;

        if (effectiveId) {
          response = await updatePresupuesto(effectiveId!, formData);
        } else {
          response = await createPresupuesto(formData);
        }

        const mensajeTitulo = effectiveId
          ? "Actualización de Presupuesto"
          : "Creación de Presupuesto";

        // Resolver teléfono: primero desde el backend (funciona siempre, incluso sin navegación por tabs)
        const savedId = response.data?.id as number | undefined;
        const telefonoFromBackend = savedId ? await getPresupuestoClienteTelefono(savedId) : "";
        const clienteInfo = {
          nombre: clienteData?.nombre ?? selectedCliente?.nombres ?? "",
          apellido: clienteData?.apellido ?? selectedCliente?.apellido ?? "",
          telefono: telefonoFromBackend || clienteData?.telefono || selectedCliente?.telefono || "",
          email: clienteData?.email ?? selectedCliente?.emailCliente ?? "",
        };
        await ShowPresupuestos(
          response.success,
          mensajeTitulo,
          response.data ?? response.error,
          clienteInfo
        );

        if (response.success) {
          clearFieldErrors();
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/portal/eventos/presupuestos");
          }
        } else {
          console.error(
            "[ERROR] Error al crear o actualizar presupuesto:",
            response.error
          );
          handleBackendErrors(response);
        }
      } catch (error) {
        console.error("[EXCEPTION] Error inesperado:", error);
        handleBackendErrors({ message: error instanceof Error ? error.message : "Error desconocido" });
      } finally {
        setIsSubmitting(false);
      }
  };
  const goToPresupuestos = () => {
    router.push("/portal/eventos/presupuestos");
  };

  return (
    <form
      id="formulario"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <WatermarkBackground setBackgroundImage={() => {}} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-auto items-start">
        {/* Mostrar datos del cliente */}
        {clienteData && (
          <div className="col-span-2">
            <h3 className="text-lg font-semibold">Datos del Cliente</h3>
            <p>
              <strong>Nombre:</strong> {clienteData.nombre || "No disponible"}
            </p>
            <p>
              <strong>Apellido:</strong>{" "}
              {clienteData.apellido || "No disponible"}
            </p>
            <p>
              <strong>Email:</strong> {clienteData.email || "No disponible"}
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              {clienteData.telefono || "No disponible"}
            </p>
            <p>
              <strong>CUIT:</strong> {clienteData.cuit || "No disponible"}
            </p>
            <p>
              <strong>Localidad:</strong>{" "}
              {clienteData.localidad || "No disponible"}
            </p>
            <p>
              <strong>Dirección:</strong>{" "}
              {clienteData.direccion || "No disponible"}
            </p>
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {clienteData.fechaCreacion || "No disponible"}
            </p>
          </div>
        )}

        {/* Otros campos del formulario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID del Móvil
          </label>
          <input
            type="text"
            value={idMovil || presupuesto?.movilId || ""}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patente
          </label>
          <input
            type="text"
            value={patenteValue}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <Button
          type="button"
          onClick={() => setIsPhotosOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Fotografías
        </Button>
        <PhotosEvModal
          isOpen={isPhotosOpen}
          onClose={() => setIsPhotosOpen(false)}
          files={files}
          setFile={setFile}
          getFileUrl={getFileUrl}
        />

        <Button
          type="button"
          onClick={() => setIsPdfOpen(true)}
          className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
          PDFs
        </Button>
        <PdfModal
          isOpen={isPdfOpen}
          onClose={() => setIsPdfOpen(false)}
          files={files}
          setFile={setFile}
          getFileUrl={getFileUrl}
        />
        <Button
          type="button"
          onClick={() => setIsWordOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Word
        </Button>
        <WordModal
          isOpen={isWordOpen}
          onClose={() => setIsWordOpen(false)}
          files={files}
          setFile={setFile}
        />

        <InputField
          register={register}
          name="monto"
          label="Monto"
          placeholder=""
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            {...register("estado")}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Creado">Creado</option>
            <option value="En revisión">En revisión</option>
            <option value="Aprobado">Aprobado</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
        <Textarea
          id="observaciones"
          value={watch("observaciones")}
          onChange={(value) => setValue("observaciones", value)}
          label="Observaciones"
          placeholder="Escribe las observaciones aquí..."
        />
      </div>

      <ChapaYPinturaPage
        onChapaRowsChange={setChapaRows}
        onPinturaRowsChange={setPinturaRows}
        initialChapaRows={chapaRows}
        initialPinturaRows={pinturaRows}
      />
      <PreciosCyP
        data={preciosData}
        onMaterialesChange={(row, value) => {
          setPreciosData((prev) => ({
            ...prev,
            [row]: { ...prev[row], materiales: value },
          }));
        }}
        onFieldChange={handlePreciosFieldChange}
        onReset={handlePreciosReset}
      />
      {/* Select de Tipo de Trabajo */}
      <TipoTrabajoSelect
        value={tipoTrabajo}
        onChange={(value) => setTipoTrabajo(value)}
      />

      {/* Checkboxes de Magnitud del Daño */}
      <MagnitudDanioCheckbox
        values={magnitudDanio}
        onChange={(value) => {
          setMagnitudDanio((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value]
          );
        }}
      />
      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={() => router.push("/portal/eventos/presupuestos")}
          className="bg-slate-500 hover:bg-slate-600"
        >
          Volver
        </Button>
        <Button type="submit" className="bg-blue-500" disabled={isSubmitting}>
          {isSubmitting
            ? params.id
              ? "Actualizando..."
              : "Creando..."
            : params.id
            ? "Actualizar Presupuesto"
            : "Crear Presupuesto"}
        </Button>
      </div>
    </form>
  );
}
