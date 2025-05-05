"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import WatermarkBackground from "@/components/WatermarkBackground";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createImpacto, updateImpacto } from "../impacto.api";
import { useUserStore } from "@/lib/store";
import { ShowImpactos, showCancelAlert } from "../../../../utils/alertUtils";
import SelectAcontec from "@/components/ui/selects/SelectAcontec";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import Toggle from "@/components/ui/Toggle";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
interface FormValues {
  [key: string]: string;
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

export function ImpactoForm({ impacto }: { impacto: any }) {
  const { handleSubmit, setValue, register, reset, watch } = useForm<FormValues>({
    defaultValues: {
      observacion: impacto?.observacion || "",
      fechaHora: impacto?.fechaHora || "",
      establecimiento: impacto?.establecimiento || "",
      email: impacto?.email || "",
      acontecimiento: impacto?.acontecimiento || "",
      internosinvolucrado: JSON.stringify(impacto?.internosinvolucrado || []),
      foco_igneo: impacto?.foco_igneo === "Si" ? "Si" : "No", // Cambiar a cadena
      reyerta: impacto?.reyerta === "Si" ? "Si" : "No", // Cambiar a cadena
      interv_requisa: impacto?.interv_requisa === "Si" ? "Si" : "No", // Cambiar a cadena
      expediente: impacto?.expediente || "",
      modulo_ur: impacto?.modulo_ur || "",
      clas_seg: impacto?.clas_seg || "",
      pabellon: impacto?.pabellon || "",
      imagen: impacto?.imagen || "",
      imagenDer: impacto?.imagenDer || "",
      imagenIz: impacto?.imagenIz || "",
      imagenDact: impacto?.imagenDact || "",
      imagenSen1: impacto?.imagenSen1 || "",
      imagenSen2: impacto?.imagenSen2 || "",
      imagenSen3: impacto?.imagenSen3 || "",
      imagenSen4: impacto?.imagenSen4 || "",
      imagenSen5: impacto?.imagenSen5 || "",
      imagenSen6: impacto?.imagenSen6 || "",
      pdf1: impacto?.pdf1 || "",
      pdf2: impacto?.pdf2 || "",
      pdf3: impacto?.pdf3 || "",
      pdf4: impacto?.pdf4 || "",
      pdf5: impacto?.pdf5 || "",
      pdf6: impacto?.pdf6 || "",
      pdf7: impacto?.pdf7 || "",
      pdf8: impacto?.pdf8 || "",
      pdf9: impacto?.pdf9 || "",
      pdf10: impacto?.pdf10 || "",
      word1: impacto?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [observacion, setObservacion] = useState<string>(impacto?.observacion || "");
  const [fechaHora, setFechaHora] = useState<string>(impacto?.fechaHora || "");
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<string>(impacto?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(impacto?.modulo_ur || "");
  const [selectedPabellon, setSelectedPabellon] = useState<string>(impacto?.pabellon || "");
  const [acontecimiento, setAcontecimiento] = useState<string>(impacto?.acontecimiento || "");
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (impacto?.internosinvolucrado) {
        return JSON.parse(impacto.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [focoIgneo, setFocoIgneo] = useState<boolean>(
    impacto?.foco_igneo === "Si"
  );
  const [clas_seg, setClas_seg] = useState<string>(
    impacto?.clas_seg || ""
  );
  const [reyerta, setReyerta] = useState<boolean>(
    impacto?.reyerta === "Si"
  );
  const [intervRequisa, setIntervRequisa] = useState<boolean>(
    impacto?.interv_requisa === "Si"
  );
  const [expediente, setExpediente] = useState<string>(impacto?.expediente || "");

  const [imagen, setImagen] = useState<string | null>(
    impacto?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagen}`
      : null
  );
  
  const [imagenDer, setImagenDer] = useState<string | null>(
    impacto?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    impacto?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    impacto?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    impacto?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    impacto?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    impacto?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    impacto?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    impacto?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    impacto?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    impacto?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    impacto?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    impacto?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    impacto?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    impacto?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    impacto?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    impacto?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    impacto?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    impacto?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    impacto?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    impacto?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.word1}`
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
    return `/api/impactos/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/impactos/uploads/${pdfPath.split("/").pop()}`;
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
  acontecimiento: "Acontecimiento",
};

const requiredFields = ["establecimiento", "fechaHora", "clas_seg", "acontecimiento"];
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
   

  const confirmation = await Alert.confirm({
    title: "¿Estás seguro?",
    text: "¿Deseas enviar el formulario?",
    icon: "warning",
  });

  if (!confirmation.isConfirmed) {
    showCancelAlert();
    return;
  }

  setIsSubmitting(true); // Bloquear el botón al iniciar el envío

  try {
    let response;

    const payload: any = {
      observacion: data.observacion,
      fechaHora: data.fechaHora || null,
      establecimiento: data.establecimiento,
      email: user?.email,
      acontecimiento: data.acontecimiento,
      internosinvolucrado: JSON.stringify(selectedInternos),
      foco_igneo: focoIgneo ? "Si" : "No", // Enviar como cadena
      reyerta: reyerta ? "Si" : "No", // Enviar como cadena
      interv_requisa: intervRequisa ? "Si" : "No", // Enviar como cadena
      expediente: data.expediente,
      modulo_ur: selectedModuloUr,
      pabellon: selectedPabellon,
      clas_seg: clas_seg,
    };

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
      response = await updateImpacto(params.id, formData);
    } else {
      response = await createImpacto(formData);
    }

    const mensajeTitulo = params.id ? "Actualización de Impacto sanitario" : "Creación de Impacto sanitario";

    if (response.success) {
      await ShowImpactos(response.success, mensajeTitulo, payload);
      router.push("/portal/eventos/impactos");
    } else {
      console.error("Error al crear o actualizar impacto:", response.error);
      ShowImpactos(false, "Error", payload);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    ShowImpactos(false, "Error", {});
  } finally {
    setIsSubmitting(false); // Desbloquear el botón al finalizar
  }
};

  const goToImpactos = () => {
    router.push("/portal/eventos/impactos");
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
        <SelectComp
          initialEstablecimiento={selectedEstablecimiento}
          initialModuloUr={selectedModuloUr}
          initialPabellon={selectedPabellon}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value);
          }}
          onModuloUrChange={(value) => {
            setSelectedModuloUr(value);
            setValue("modulo_ur", value);
          }}
          onPabellonChange={(value) => {
            setSelectedPabellon(value);
            setValue("pabellon", value);
          }}
        />
        <SelectAcontec
          value={acontecimiento}
          onChange={(value) => {
            setAcontecimiento(value);
            setValue("acontecimiento", value);
          }}
        />
        <InternosInvolucrados
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        />
       <Toggle
          id="focoIgneo"
          value={focoIgneo}
          onChange={(value) => {
            setFocoIgneo(value);
            setValue("foco_igneo", value ? "Si" : "No");
          }}
          label="¿Foco ígneo?"
        />
        <Toggle
          id="reyerta"
          value={reyerta}
          onChange={(value) => {
            setReyerta(value);
            setValue("reyerta", value ? "Si" : "No");
          }}
          label="¿Reyerta?"
        />
        <Toggle
          id="intervRequisa"
          value={intervRequisa}
          onChange={(value) => {
            setIntervRequisa(value);
            setValue("interv_requisa", value ? "Si" : "No");
          }}
          label="¿Intervención de requisa?"
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

        <div className="flex space-x-4">
          <Button type="button" onClick={goToImpactos} className="bg-orange-500">
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