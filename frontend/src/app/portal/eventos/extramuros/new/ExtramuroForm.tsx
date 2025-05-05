// frontend/src/app/portal/eventos/extramuros/new/ExtramuroForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createExtramuro, updateExtramuro } from "../Extramuros.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import FechaHoraReintegro from "@/components/ui/FechaHoraReintegro";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { HospitalInputField } from "@/components/ui/inputs/HospitalInputField";
import { SectorIntInputField } from "@/components/ui/inputs/SectorIntInputField";
import { PisoInputField } from "@/components/ui/inputs/PisoInputField";
import { HabitacionInputField } from "@/components/ui/inputs/HabitacionInputField";
import { CamaInputField } from "@/components/ui/inputs/CamaInputField";
import { useUserStore } from "@/lib/store";
import { ShowExtramuros, showCancelAlert } from "../../../../utils/alertUtils";
import MotivoSalidaSelect from "@/components/ui/selects/MotivoSalidaSelect";
import InternacionSelect from "@/components/ui/selects/InternacionSelect";
import MotivoReintegroSelect from "@/components/ui/selects/MotivoReintegroSelect";
import PorOrdenSelect from "@/components/ui/selects/PorOrdenSelect";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";

import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
interface FormValues {
  expediente: string;
  establecimiento: string;
  fechaHora: string;
  fechaHoraReintegro?: string;
  observacion: string;
  sector_internacion: string;
  piso: string;
  habitacion: string;
  cama: string;
  personalinvolucrado: string;
  internosinvolucrado: string;
  motivo: string;
  internacion: string;
  motivo_reintegro: string;
  porOrden: string;
  [key: string]: string | undefined; // Ajustar el tipo de índice
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

export function ExtramuroForm({ extramuro }: { extramuro: any }) {
  const { handleSubmit, setValue, register, reset, watch } = useForm<FormValues>({
    defaultValues: {
      establecimiento: extramuro?.establecimiento || "",
      fechaHora: extramuro?.fechaHora || "",
      fechaHoraReintegro: extramuro?.fechaHoraReintegro || "",
      observacion: extramuro?.observacion || "",
      personalinvolucrado: JSON.stringify(extramuro?.personalinvolucrado || []),
      internosinvolucrado: JSON.stringify(extramuro?.internosinvolucrado || []),
      expediente: extramuro?.expediente || "",
      hospital: extramuro?.hospital || "",
      motivo: extramuro?.motivo || "",
      clas_seg: extramuro?.clas_seg || "",
      internacion: extramuro?.internacion || "",
      sector_internacion: extramuro?.sector_internacion || "",
      motivo_reintegro: extramuro?.motivo_reintegro || "",
      piso: extramuro?.piso || "",
      habitacion: extramuro?.habitacion || "",
      cama: extramuro?.cama || "",
      porOrden: extramuro?.porOrden || "",
      imagen: extramuro?.imagen || "",
      imagenDer: extramuro?.imagenDer || "",
      imagenIz: extramuro?.imagenIz || "",
      imagenDact: extramuro?.imagenDact || "",
      imagenSen1: extramuro?.imagenSen1 || "",
      imagenSen2: extramuro?.imagenSen2 || "",
      imagenSen3: extramuro?.imagenSen3 || "",
      imagenSen4: extramuro?.imagenSen4 || "",
      imagenSen5: extramuro?.imagenSen5 || "",
      imagenSen6: extramuro?.imagenSen6 || "",
      pdf1: extramuro?.pdf1 || "",
      pdf2: extramuro?.pdf2 || "",
      pdf3: extramuro?.pdf3 || "",
      pdf4: extramuro?.pdf4 || "",
      pdf5: extramuro?.pdf5 || "",
      pdf6: extramuro?.pdf6 || "",
      pdf7: extramuro?.pdf7 || "",
      pdf8: extramuro?.pdf8 || "",
      pdf9: extramuro?.pdf9 || "",
      pdf10: extramuro?.pdf10 || "",
      word1: extramuro?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [fechaHora, setFechaHora] = useState<string>(
    extramuro?.fechaHora || ""
  );
  const [fechaHoraReintegro, setFechaHoraReintegro] = useState<string>(
    extramuro?.fechaHoraReintegro || ""
  );
  const [observacion, setObservacion] = useState<string>(
    extramuro?.observacion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(extramuro?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    extramuro?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    extramuro?.pabellon || ""
  );
  const [motivoSelect, setMotivoSelect] = useState<string>(
    extramuro?.motivo || ""
  );

  const [motivoReintegroSelect, setMotivoReintegroSelect] = useState<string>(
    extramuro?.motivo_reintegro || ""
  );
  const [internacionSelect, setInternacionSelect] = useState<string>(
    extramuro?.internacion || ""
  );
  const [porOrdenSelect, setPorOrdenSelect] = useState<string>(
    extramuro?.porOrden || ""
  );
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (extramuro?.personalinvolucrado) {
        return JSON.parse(extramuro.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [clas_seg, setClas_seg] = useState<string>(
    extramuro?.clas_seg || ""
  );
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (extramuro?.internosinvolucrado) {
        return JSON.parse(extramuro.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });

  const [imagen, setImagen] = useState<string | null>(
    extramuro?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagen}`
      : null
  );
  
  const [imagenDer, setImagenDer] = useState<string | null>(
    extramuro?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    extramuro?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    extramuro?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    extramuro?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    extramuro?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    extramuro?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    extramuro?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    extramuro?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    extramuro?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    extramuro?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    extramuro?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    extramuro?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    extramuro?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    extramuro?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    extramuro?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    extramuro?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    extramuro?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    extramuro?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    extramuro?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    extramuro?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.word1}`
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
    return `/api/extramuros/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/extramuros/uploads/${pdfPath.split("/").pop()}`;
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
  hospital: "Hospital",
};
const requiredFields = [
  "establecimiento",
  "fechaHora",
  "clas_seg",
  "hospital",
  "motivo",
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

  setIsSubmitting(true); // Bloquear el botón

  try {
    let response;

    const payload: any = {
      establecimiento: data.establecimiento,
      modulo_ur: selectedModuloUr,
      pabellon: selectedPabellon,
      fechaHora: data.fechaHora,
      observacion: data.observacion,
      personalinvolucrado: JSON.stringify(selectedAgentes),
      internosinvolucrado: JSON.stringify(selectedInternos),
      expediente: data.expediente,
      hospital: data.hospital,
      motivo: data.motivo,
      internacion: data.internacion,
      sector_internacion: data.sector_internacion,
      motivo_reintegro: data.motivo_reintegro,
      piso: data.piso,
      habitacion: data.habitacion,
      cama: data.cama,
      porOrden: data.porOrden,
      email: user?.email,
      clas_seg: data.clas_seg,
    };

    if (data.fechaHoraReintegro) {
      payload.fechaHoraReintegro = data.fechaHoraReintegro;
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

    let mensajeTitulo;
    if (params?.id) {
      response = await updateExtramuro(params.id, formData);
      mensajeTitulo = "Actualización de Salida Extramuro";
    } else {
      response = await createExtramuro(formData);
      mensajeTitulo = "Creación de Salida Extramuro";
    }

    if (response.success) {
      await ShowExtramuros(
        response.success,
        mensajeTitulo,
        {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
        }
      );
      router.push("/portal/eventos/extramuros");
    } else {
      console.error("Error al crear o actualizar Extramuro:", response.error);
      ShowExtramuros(false, "Error", {
        ...data,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
      });
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    ShowExtramuros(false, "Error", {
      ...data,
      modulo_ur: selectedModuloUr,
      pabellon: selectedPabellon,
    });
  } finally {
    setIsSubmitting(false); // Desbloquear el botón
  }
};
  const goToExtramuros = () => {
    router.push("/portal/eventos/extramuros");
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
        <FechaHoraReintegro
          value={fechaHoraReintegro}
          onChange={(value: string) => {
            setFechaHoraReintegro(value);
            setValue("fechaHoraReintegro", value);
          }}
        />
        <MotivoReintegroSelect
          value={motivoReintegroSelect}
          onChange={(value) => {
            setMotivoReintegroSelect(value);
            setValue("motivo_reintegro", value);
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
        <HospitalInputField
          register={register}
          label="Hospital, Clínica, etc."
        />
        <MotivoSalidaSelect
          value={motivoSelect}
          onChange={(value) => {
            setMotivoSelect(value);
            setValue("motivo", value);
          }}
        />
        <PorOrdenSelect
          value={porOrdenSelect}
          onChange={(value) => {
            setPorOrdenSelect(value);
            setValue("porOrden", value);
          }}
        />
        <InternacionSelect
          value={internacionSelect}
          onChange={(value) => {
            setInternacionSelect(value);
            setValue("internacion", value);
          }}
        />
        <SectorIntInputField register={register} label="Sector Internacion" />
        <PisoInputField register={register} label="Piso" />
        <HabitacionInputField register={register} label="Habitación" />
        <CamaInputField register={register} label="Cama" />
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
          <Button type="button" onClick={goToExtramuros} className="bg-orange-500">
          Volver
          </Button>
          <Button
            type="submit"
            className="bg-blue-500"
            disabled={isSubmitting} // Deshabilitar el botón si está enviando
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
