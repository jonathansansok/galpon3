//frontend\src\app\portal\eventos\presupuestos\new\PresupuestoForm.tsx
"use client";
import { usePresupuestoStore } from "@/lib/store"; // Importar el store de Zustand
import { InputField } from "@/components/ui/InputField";
import { useUserStore } from "@/lib/store"; // Importar el store de Zustand
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createPresupuesto, updatePresupuesto } from "../Presupuestos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ChapaYPinturaPage from "@/components/ui/ChapaYPinturaPage";
//import ChapaPinturaTable from "@/components/ui/ChapaPinturaTable";
import PreciosCyP from "@/components/ui/PreciosCyP";
import TipoTrabajoSelect from "@/components/ui/TipoTrabajoSelect";

import {
  ShowPresupuestos,
  showCancelAlert,
} from "../../../../utils/alertUtils"; // Importa las funciones

interface FormValues {
  [key: string]: string;
}

export function PresupuestoForm({ presupuesto }: { presupuesto: any }) {
  const clienteData = usePresupuestoStore((state) => state.clienteData);

  useEffect(() => {
    console.log(
      "[DEBUG] Datos del cliente obtenidos desde Zustand:",
      clienteData
    );
  }, [clienteData]);
  const params = useParams<{ id: string }>(); // Declarar params antes de usarlo
  const idMovil = usePresupuestoStore((state) => state.idMovil); // Declarar idMovil antes de usarlo
  const patente = usePresupuestoStore((state) => state.patente); // Declarar patente antes de usarlo

  // Calcular los valores dinámicamente
  const movilId = params?.id
    ? presupuesto?.movilId || idMovil || ""
    : idMovil || "";

  const patenteValue = params?.id
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

  const [tipoTrabajo, setTipoTrabajo] = useState<string>("Siniestro");
  const [preciosData, setPreciosData] = useState({
    chapa: {
      costo: 0,
      horas: 0,
      diasPanos: 0,
      materiales: "",
    },
    pintura: {
      costo: 0,
      horas: 0,
      diasPanos: 0,
      materiales: "",
    },
  });

  const onUpdateChapa = (costo: number, horas: number, diasPanos: number) => {
    setPreciosData((prev) => {
      const updatedRow = { ...prev.chapa };

      updatedRow.costo += costo;
      updatedRow.horas += horas;
      updatedRow.diasPanos += diasPanos;

      return {
        ...prev,
        chapa: updatedRow,
      };
    });
  };

  const onUpdatePintura = (costo: number, horas: number, diasPanos: number) => {
    setPreciosData((prev) => {
      const updatedRow = { ...prev.pintura };

      updatedRow.costo += costo;
      updatedRow.horas += horas;
      updatedRow.diasPanos += diasPanos;

      return {
        ...prev,
        pintura: updatedRow,
      };
    });
  };
  // Estado para los checkboxes "Magnitud del Daño"
  const [magnitudDanio, setMagnitudDanio] = useState<string[]>([]);
  const [imagen, setImagen] = useState<string | null>(
    presupuesto?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    presupuesto?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    presupuesto?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    presupuesto?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    presupuesto?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    presupuesto?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    presupuesto?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    presupuesto?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    presupuesto?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    presupuesto?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    presupuesto?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    presupuesto?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    presupuesto?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    presupuesto?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    presupuesto?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    presupuesto?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    presupuesto?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    presupuesto?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    presupuesto?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    presupuesto?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    presupuesto?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto.word1}`
      : null
  );
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const getImageUrl = (imagePath: string): string => {
    return `/api/presupuestos/uploads/${imagePath.split("/").pop()}`;
  };
  const generateFileName = (type: string) => {
    return `Documento_${type}.png`.replace(/\s+/g, "_");
  };
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/presupuestos/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    console.log(`ID del móvil recuperado: ${idMovil}`);
    console.log(`Patente recuperada: ${patente}`);
  }, [idMovil, patente]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el formulario?",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        movilId: data.movilId,
        patente: data.patente,
        monto: data.monto,
        estado: data.estado || "Pendiente",
        observaciones: data.observaciones || "",
      };

      console.log("[DEBUG] Payload enviado al backend:", payload);

      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
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
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("files", blob, uniqueFileName);
          formData.append(key, uniqueFileName);
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

      try {
        let response;

        if (params?.id) {
          response = await updatePresupuesto(params.id, formData);
        } else {
          response = await createPresupuesto(formData);
        }

        const mensajeTitulo = params?.id
          ? "Actualización de Presupuesto"
          : "Creación de Presupuesto";

        console.log("[DEBUG] response completo:", response);

        await ShowPresupuestos(
          response.success,
          mensajeTitulo,
          response.data ?? response.error
        );

        if (response.success) {
          router.push("/portal/eventos/presupuestos");
        } else {
          console.error(
            "[ERROR] Error al crear o actualizar presupuesto:",
            response.error
          );
          ShowPresupuestos(false, "Error", response.error);
        }
      } catch (error) {
        console.error("[EXCEPTION] Error inesperado:", error);
        ShowPresupuestos(
          false,
          "Error inesperado",
          error instanceof Error ? error.message : "Error desconocido"
        );
      } finally {
        setIsSubmitting(false);
      }
    } finally {
      setIsSubmitting(false); // Desbloquear el botón
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
          imagen={imagen}
          setImagen={setImagen}
          imagenDer={imagenDer}
          setImagenDer={setImagenDer}
          imagenIz={imagenIz}
          setImagenIz={setImagenIz}
          imagenDact={imagenDact}
          setImagenDact={setImagenDact}
          imagenSen1={imagenSen1}
          setImagenSen1={setImagenSen1}
          imagenSen2={imagenSen2}
          setImagenSen2={setImagenSen2}
          imagenSen3={imagenSen3}
          setImagenSen3={setImagenSen3}
          imagenSen4={imagenSen4}
          setImagenSen4={setImagenSen4}
          imagenSen5={imagenSen5}
          setImagenSen5={setImagenSen5}
          imagenSen6={imagenSen6}
          setImagenSen6={setImagenSen6}
          getImageUrl={getImageUrl}
          generateFileName={generateFileName}
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
          pdf1={pdf1}
          setPdf1={setPdf1}
          pdf2={pdf2}
          setPdf2={setPdf2}
          pdf3={pdf3}
          setPdf3={setPdf3}
          pdf4={pdf4}
          setPdf4={setPdf4}
          pdf5={pdf5}
          setPdf5={setPdf5}
          pdf6={pdf6}
          setPdf6={setPdf6}
          pdf7={pdf7}
          setPdf7={setPdf7}
          pdf8={pdf8}
          setPdf8={setPdf8}
          pdf9={pdf9}
          setPdf9={setPdf9}
          pdf10={pdf10}
          setPdf10={setPdf10}
          getPdfUrl={getPdfUrl}
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
          word1={word1}
          setWord1={setWord1}
        />

        <InputField
          register={register}
          name="monto"
          label="Monto"
          placeholder=""
        />
        <InputField
          register={register}
          name="estado"
          label="Estado"
          placeholder="Pendiente, Aprobado, etc."
        />
        <Textarea
          id="observaciones"
          value={watch("observaciones")}
          onChange={(value) => setValue("observaciones", value)}
          label="Observaciones"
          placeholder="Escribe las observaciones aquí..."
        />
      </div>

      <ChapaYPinturaPage
        onUpdateChapa={(costo, horas, diasPanos) =>
          onUpdateChapa(costo, horas, diasPanos)
        }
        onUpdatePintura={(costo, horas, diasPanos) =>
          onUpdatePintura(costo, horas, diasPanos)
        }
      />
      <PreciosCyP
        data={preciosData}
        onUpdate={(row, field, value) => {
          const diasPanos =
            field === "horas"
              ? Math.floor(value / 4) + (value % 4 >= 2 ? 0.5 : 0)
              : 0;

          if (row === "chapa") {
            onUpdateChapa(
              field === "costo" ? value : 0,
              field === "horas" ? value : 0,
              diasPanos
            );
          } else if (row === "pintura") {
            onUpdatePintura(
              field === "costo" ? value : 0,
              field === "horas" ? value : 0,
              diasPanos
            );
          }
        }}
      />
      {/* Select de Tipo de Trabajo */}
      <TipoTrabajoSelect
        value={tipoTrabajo}
        onChange={(value) => setTipoTrabajo(value)}
      />


      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={() => router.push("/portal/eventos/presupuestos")}
          className="bg-orange-500"
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
