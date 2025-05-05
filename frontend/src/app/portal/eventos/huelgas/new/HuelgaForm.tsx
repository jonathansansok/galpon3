"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createHuelga, updateHuelga } from "../Huelgas.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import TipoHuelgaSelect from "@/components/ui/selects/TipoHuelgaSelect";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import FechaHoraCierre from "@/components/ui/FechaHoraCierre";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { useUserStore } from "@/lib/store";
import { ShowHuelgas, showCancelAlert } from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";

interface FormValues {
  [key: string]: string;
  expediente: string;
  establecimiento: string;
  fechaHora: string;
  observacion: string;
  sector: string;
  internosinvolucrado: string;
  estado: string;
  motivo: string;
}

interface Sector {
  option: string;
}

interface Motivo {
  option: string;
}

interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  gravedad: string;
  atencionExtramuro: string;
  detalle: string;
}

export function HuelgaForm({ huelgas }: { huelgas: any }) {
  const { handleSubmit, setValue, register, reset, watch } = useForm<FormValues>({
    defaultValues: {
      establecimiento: huelgas?.establecimiento || "",
      fechaHora: huelgas?.fechaHora || "",
      fechaHoraCierre: huelgas?.fechaHoraCierre || "",
      observacion: huelgas?.observacion || "",
      sector: huelgas?.sector || "",
      clas_seg: huelgas?.clas_seg || "",
      internosinvolucrado: JSON.stringify(huelgas?.internosinvolucrado || []),
      expediente: huelgas?.expediente || "",
      estado: huelgas?.estado === "Cerrado" ? "Cerrado" : "Abierto",
      motivo: huelgas?.motivo || "",
      imagen: huelgas?.imagen || "",
      imagenDer: huelgas?.imagenDer || "",
      imagenIz: huelgas?.imagenIz || "",
      imagenDact: huelgas?.imagenDact || "",
      imagenSen1: huelgas?.imagenSen1 || "",
      imagenSen2: huelgas?.imagenSen2 || "",
      imagenSen3: huelgas?.imagenSen3 || "",
      imagenSen4: huelgas?.imagenSen4 || "",
      imagenSen5: huelgas?.imagenSen5 || "",
      imagenSen6: huelgas?.imagenSen6 || "",
      pdf1: huelgas?.pdf1 || "",
      pdf2: huelgas?.pdf2 || "",
      pdf3: huelgas?.pdf3 || "",
      pdf4: huelgas?.pdf4 || "",
      pdf5: huelgas?.pdf5 || "",
      pdf6: huelgas?.pdf6 || "",
      pdf7: huelgas?.pdf7 || "",
      pdf8: huelgas?.pdf8 || "",
      pdf9: huelgas?.pdf9 || "",
      pdf10: huelgas?.pdf10 || "",
      word1: huelgas?.word1 || "",


    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fechaHoraCierre, setFechaHoraCierre] = useState<string>(
    huelgas?.fechaHoraCierre || ""
  );

  const [fechaHora, setFechaHora] = useState<string>(huelgas?.fechaHora || "");
  const [observacion, setObservacion] = useState<string>(huelgas?.observacion || "");
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<string>(huelgas?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(huelgas?.modulo_ur || "");
  const [selectedPabellon, setSelectedPabellon] = useState<string>(huelgas?.pabellon || "");
  const [selectedMotivos, setSelectedMotivos] = useState<Motivo[]>(() => {
    if (huelgas?.motivo) {
      return huelgas.motivo.split(", ").map((motivo: string) => ({ option: motivo }));
    }
    return [];
  });
  const [clas_seg, setClas_seg] = useState<string>(
    huelgas?.clas_seg || ""
  );
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (huelgas?.internosinvolucrado) {
        return JSON.parse(huelgas.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });

  const [estado, setEstado] = useState<boolean>(huelgas?.estado === "Cerrado");

  const [imagen, setImagen] = useState<string | null>(
    huelgas?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagen}`
      : null
  );
  
  const [imagenDer, setImagenDer] = useState<string | null>(
    huelgas?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    huelgas?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    huelgas?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    huelgas?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    huelgas?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    huelgas?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    huelgas?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    huelgas?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    huelgas?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    huelgas?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    huelgas?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    huelgas?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    huelgas?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    huelgas?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    huelgas?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    huelgas?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    huelgas?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    huelgas?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    huelgas?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    huelgas?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelgas.word1}`
      : null
  );

  const nombres = watch("establecimiento");
  const apellido = watch("establecimiento");
  const lpu = watch("establecimiento");
  const lpuProv = watch("lpuPestablecimientorov");
  const nDoc = watch("establecimiento");
  const generateFileName = (type: string) => {
    return `${apellido}_${nombres}_L.P.U._${lpu}_L.P.U. PROV_${lpuProv}_NºDoc. ${nDoc}_${type}.png`.replace(
      /\s+/g,
      "_"
    );
  };
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const getImageUrl = (imagePath: string): string => {
    return `/api/huelgas/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/huelgas/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);




  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.email) {
          setUser({ name: data.name, email: data.email });
        } else {
          router.push("/api/auth/login");
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        router.push("/api/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, router]);
const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
const fieldLabels: Record<string, string> = {
  establecimiento: "Establecimiento",
  fechaHora: "Fecha y hora de evento",
  clas_seg: "Clasificación de Seguridad",
  motivo: "Motivo",
};
const requiredFields = [
  "establecimiento",
  "fechaHora",
  "clas_seg",
  "motivo"
];
const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
    return; // El usuario decidió no continuar
  }
}

  setIsSubmitting(true); // Bloquear el botón al iniciar el envío

  try {
    let response;
    const payload: any = {
      establecimiento: data.establecimiento,
      modulo_ur: selectedModuloUr,
      pabellon: selectedPabellon,
      motivo: selectedMotivos.map((s) => s.option).join(", "),
      fechaHora: data.fechaHora || null,
      observacion: data.observacion,
      internosinvolucrado: JSON.stringify(selectedInternos),
      expediente: data.expediente,
      estado: estado ? "Cerrado" : "Abierto",
      email: user?.email,
      clas_seg: data.clas_seg,
    };

    if (data.fechaHoraCierre) {
      payload.fechaHoraCierre = data.fechaHoraCierre;
    }

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

    if (params?.id) {
      response = await updateHuelga(params.id, formData);
    } else {
      response = await createHuelga(formData);
    }

    if (response.success) {
      await ShowHuelgas(
        response.success,
        params?.id ? "Datos Actualizados" : "Datos Creados",
        {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
          estado: estado ? "Cerrado" : "Abierto",
          motivo: selectedMotivos.map((s) => s.option).join(", "),
        }
      );
      router.push("/portal/eventos/huelgas");
    } else {
      console.error("Error al crear o actualizar huelgas:", response.error);
      ShowHuelgas(
        false,
        "Error",
        {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
          estado: estado ? "Cerrado" : "Abierto",
          motivo: selectedMotivos.map((s) => s.option).join(", "),
        }
      );
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    ShowHuelgas(
      false,
      "Error",
      {
        ...data,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        estado: estado ? "Cerrado" : "Abierto",
        motivo: selectedMotivos.map((s) => s.option).join(", "),
      }
    );
  } finally {
    setIsSubmitting(false); // Desbloquear el botón al finalizar
  }
};

  const goToHuelgas = () => {
    router.push("/portal/eventos/huelgas");
  };

  return (
<form
    id="formulario"
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6"
    style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      backgroundSize: "cover",
      backgroundRepeat: "repeat",
    }}
  >
    <WatermarkBackground setBackgroundImage={setBackgroundImage} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-auto items-start">
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
        <ClasSegSelect
          value={clas_seg}
          onChange={(value) => {
            setClas_seg(value);
            setValue("clas_seg", value);
          }}
        />
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />
        <FechaHoraCierre
          value={fechaHoraCierre}
          onChange={(value: string) => {
            setFechaHoraCierre(value);
            setValue("fechaHoraCierre", value);
          }}
        />
        <SelectComp
          initialEstablecimiento={selectedEstablecimiento}
          initialModuloUr={selectedModuloUr}
          initialPabellon={selectedPabellon}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value);
          }}
          onModuloUrChange={(value) => setSelectedModuloUr(value)}
          onPabellonChange={(value) => setSelectedPabellon(value)}
        />
        <TipoHuelgaSelect
          initialMotivos={selectedMotivos}
          onSelect={(value) => {
            setSelectedMotivos(value);
            setValue("motivo", value.map((s) => s.option).join(", "));
          }}
        />
        <InternosInvolucrados
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        />
        <InputFieldExpediente register={register} label="Expediente" />
        <Textarea
          id="observacion"
          value={observacion}
          onChange={(value) => {
            setObservacion(value);
            setValue("observacion", value);
          }}
          label="Observaciones"
          placeholder="Escribe las observaciones aquí..."
        />
        <div className="flex items-center space-x-2">
          <span>Abierto</span>
          <Toggle
            id="estado"
            value={estado}
            onChange={(value) => {
              setEstado(value);
              setValue("estado", value ? "Cerrado" : "Abierto");
            }}
            label=""
          />
          <span>Cerrado</span>
        </div>
        <div className="flex space-x-4">
          <Button type="button" onClick={goToHuelgas} className="bg-orange-500">
          Volver
          </Button>
          <Button
            type="submit"
            className="bg-blue-500"
            disabled={isSubmitting} // Bloquear el botón si está enviando
          >
            {isSubmitting
              ? params.id
                ? "Actualizando..."
                : "Posteando..."
              : params.id
              ? "Actualizar"
              : "Crear"}
          </Button>
        </div>
      </div>
    </form>
  );
}