"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createSumario, updateSumario } from "../Sumarios.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import { useUserStore } from "@/lib/store"; // Importar el store de Zustand
import { ShowSumarios, showCancelAlert } from "../../../../utils/alertUtils"; // Importa las funciones
import SelectComp from "@/components/ui/SelectAnidaciones";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import EventoSumario from "@/components/ui/selects/EventoSumario"; // Importar el nuevo componente
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
interface FormValues {
  [key: string]: string;
  observacion: string;
  fechaHora: string;
  establecimiento: string;
  modulo_ur: string;
  email: string;
  personalinvolucrado: string;
  internosinvolucrado: string;
  expediente: string;
  evento: string;
}

interface Agente {
  grado: string;
  nombreApellidoAgente: string;
  credencial: string;
  gravedad: string;
  atencionART: string;
  detalle: string;
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

export function SumarioForm({ sumario }: { sumario: any }) {
  const { handleSubmit, setValue, register, reset, watch } = useForm<FormValues>({
    defaultValues: {
      observacion: sumario?.observacion || "",
      fechaHora: sumario?.fechaHora || "",
      establecimiento: sumario?.establecimiento || "",
      modulo_ur: sumario?.modulo_ur || "",
      email: sumario?.email || "",
      personalinvolucrado: JSON.stringify(sumario?.personalinvolucrado || []),
      internosinvolucrado: JSON.stringify(sumario?.internosinvolucrado || []),
      clas_seg: sumario?.clas_seg || "",
      expediente: sumario?.expediente || "",
      evento: sumario?.evento || "",
      imagen: sumario?.imagen || "",
      imagenDer: sumario?.imagenDer || "",
      imagenIz: sumario?.imagenIz || "",
      imagenDact: sumario?.imagenDact || "",
      imagenSen1: sumario?.imagenSen1 || "",
      imagenSen2: sumario?.imagenSen2 || "",
      imagenSen3: sumario?.imagenSen3 || "",
      imagenSen4: sumario?.imagenSen4 || "",
      imagenSen5: sumario?.imagenSen5 || "",
      imagenSen6: sumario?.imagenSen6 || "",
      pdf1: sumario?.pdf1 || "",
      pdf2: sumario?.pdf2 || "",
      pdf3: sumario?.pdf3 || "",
      pdf4: sumario?.pdf4 || "",
      pdf5: sumario?.pdf5 || "",
      pdf6: sumario?.pdf6 || "",
      pdf7: sumario?.pdf7 || "",
      pdf8: sumario?.pdf8 || "",
      pdf9: sumario?.pdf9 || "",
      pdf10: sumario?.pdf10 || "",
      word1: sumario?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [fechaHora, setFechaHora] = useState<string>(sumario?.fechaHora || "");
  const [observacion, setObservacion] = useState<string>(
    sumario?.observacion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(sumario?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    sumario?.modulo_ur || ""
  );
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (sumario?.personalinvolucrado) {
        return JSON.parse(sumario.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (sumario?.internosinvolucrado) {
        return JSON.parse(sumario.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [evento, setEvento] = useState<string>(sumario?.evento || "");
  const [clas_seg, setClas_seg] = useState<string>(
    sumario?.clas_seg || ""
  );
  const [imagen, setImagen] = useState<string | null>(
    sumario?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagen}`
      : null
  );
  
  const [imagenDer, setImagenDer] = useState<string | null>(
    sumario?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    sumario?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    sumario?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    sumario?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    sumario?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    sumario?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    sumario?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    sumario?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    sumario?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    sumario?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    sumario?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    sumario?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    sumario?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    sumario?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    sumario?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    sumario?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    sumario?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    sumario?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    sumario?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    sumario?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario.word1}`
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
    return `/api/sumarios/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/sumarios/uploads/${pdfPath.split("/").pop()}`;
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

  useEffect(() => {
    setValue("modulo_ur", selectedModuloUr);
  }, [selectedModuloUr, setValue]);
  const fieldLabels: Record<string, string> = {
    establecimiento: "Establecimiento",
    fechaHora: "Fecha y hora de evento",
    evento: "Tipo de informe",
  };
  const requiredFields = [
    "establecimiento",
    "fechaHora",
    "clas_seg",
    "evento",
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
        modulo_ur: data.modulo_ur,
        personalinvolucrado: JSON.stringify(selectedAgentes),
        internosinvolucrado: JSON.stringify(selectedInternos),
        expediente: data.expediente,
        email: user?.email,
        evento: data.evento,
        clas_seg: data.clas_seg,
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
        response = await updateSumario(params.id, formData);
      } else {
        response = await createSumario(formData);
      }
  
      const mensajeTitulo = params.id
        ? "Actualización de Sumario/Info. sumaria"
        : "Creación de Sumario/Info. sumaria";
  
      if (response.success) {
        await ShowSumarios(response.success, mensajeTitulo, payload);
        router.push("/portal/eventos/sumarios");
      } else {
        console.error("Error al crear o actualizar sumario:", response.error);
        await ShowSumarios(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await ShowSumarios(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };

  const goToSumarios = () => {
    router.push("/portal/eventos/sumarios");
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
        <EventoSumario
          value={evento}
          onChange={(value) => {
            setEvento(value);
            setValue("evento", value);
          }}
        />
        <SelectComp
          initialEstablecimiento={selectedEstablecimiento}
          initialModuloUr={selectedModuloUr}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value);
          }}
          onModuloUrChange={(value) => {
            setSelectedModuloUr(value);
            setValue("modulo_ur", value);
          }}
          showPabellon={false} // No mostrar pabellon
        />
        <PersonalInvolucrado
          initialAgentes={selectedAgentes}
          onSelect={(value) => {
            setSelectedAgentes(value);
            setValue("personalinvolucrado", JSON.stringify(value));
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
        <div className="flex space-x-4">
          <Button type="button" onClick={goToSumarios} className="bg-orange-500">
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
